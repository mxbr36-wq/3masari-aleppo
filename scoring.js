/**
 * Result scoring.
 *
 * Pipeline: answers -> per-dimension scores -> fixed-order vector -> Pearson
 * correlation against every specialization fingerprint -> ranking -> grouping by
 * direction -> top two directions (two specializations each) -> confidence.
 *
 * Everything here is deterministic for a given set of answers. Constants marked
 * "calibrated" were tuned by simulating thousands of random and mixed answer
 * sets against the current question bank; re-run that simulation if the
 * questions, the specializations or their fingerprints change.
 */

import { DIMENSION_KEYS } from './dimensions.js?v=1.1';
import { SPECIALIZATIONS } from './specializations.js?v=1.1';
import { DIRECTIONS } from './directions.js?v=1.1';

/**
 * @param {Object<string, number[]>} answersByDimension  e.g. { anal: [10, 0, 10], ... }
 * @returns {Object<string, number>} mean score per dimension (neutral 5 when unanswered)
 */
export function calculateDimensionScores(answersByDimension) {
  const scores = {};

  for (const dimensionKey of DIMENSION_KEYS) {
    const values = answersByDimension[dimensionKey] || [];
    scores[dimensionKey] = values.length === 0
      ? 5
      : values.reduce((sum, value) => sum + value, 0) / values.length;
  }

  return scores;
}

/** Orders dimension scores by DIMENSION_KEYS so they line up with fingerprints. */
export function toVector(scores) {
  return DIMENSION_KEYS.map(key => scores[key] || 0);
}

/** Cosine similarity, 0..1 for non-negative vectors. Kept for reference and tests. */
export function cosineSimilarity(vectorA, vectorB) {
  if (vectorA.length !== vectorB.length) {
    throw new Error('المتجهان يجب أن يكونا بنفس الطول');
  }

  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;
  for (let i = 0; i < vectorA.length; i++) {
    dotProduct += vectorA[i] * vectorB[i];
    magnitudeA += vectorA[i] * vectorA[i];
    magnitudeB += vectorB[i] * vectorB[i];
  }
  magnitudeA = Math.sqrt(magnitudeA);
  magnitudeB = Math.sqrt(magnitudeB);

  if (magnitudeA === 0 || magnitudeB === 0) return 0;
  return dotProduct / (magnitudeA * magnitudeB);
}

/**
 * Pearson correlation (-1..+1): cosine similarity after centering each vector.
 * Used instead of plain cosine because all-positive vectors make every
 * specialization look similar; centering spreads them out.
 */
export function pearsonCorrelation(vectorA, vectorB) {
  if (vectorA.length !== vectorB.length) {
    throw new Error('المتجهان يجب أن يكونا بنفس الطول');
  }

  const length = vectorA.length;
  const meanA = vectorA.reduce((sum, value) => sum + value, 0) / length;
  const meanB = vectorB.reduce((sum, value) => sum + value, 0) / length;

  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;
  for (let i = 0; i < length; i++) {
    const a = vectorA[i] - meanA;
    const b = vectorB[i] - meanB;
    dotProduct += a * b;
    magnitudeA += a * a;
    magnitudeB += b * b;
  }

  // A constant vector has no variance: correlation is undefined, treat as 0.
  if (magnitudeA === 0 || magnitudeB === 0) return 0;
  return dotProduct / (Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB));
}

/** Maps Pearson's -1..+1 onto 0..100. */
export function toPercent(pearson) {
  return (pearson + 1) * 50;
}

/**
 * Per-direction offset, in percentage points (calibrated).
 * Directions differ in how many specializations they have and how similar their
 * fingerprints are, which structurally caps the top score each can reach: in
 * simulation "business" peaked near 12% and "humanities" near 28% against a fair
 * 20% each. These small shifts rebalance that without reordering specializations
 * inside a direction.
 */
export const DIRECTION_CALIBRATION = Object.freeze({
  health: -0.3,
  engineering: -0.2,
  business: 2.9,
  humanities: -2.0,
  culture: -0.4
});

/** @returns {Array} the given specializations with a `score` (0..100), best first */
export function rankSpecializations(studentVector, specializations = SPECIALIZATIONS) {
  return specializations
    .map(spec => ({
      ...spec,
      score: Math.min(100, Math.max(0,
        toPercent(pearsonCorrelation(studentVector, spec.fingerprint)) + (DIRECTION_CALIBRATION[spec.direction] || 0)))
    }))
    .sort((a, b) => b.score - a.score);
}

/** @returns {Object<string, Array>} direction key -> its specializations, order preserved */
export function groupByDirection(ranked) {
  const groups = {};
  for (const spec of ranked) {
    if (!groups[spec.direction]) groups[spec.direction] = [];
    groups[spec.direction].push(spec);
  }
  return groups;
}

/** A direction's strength is its best specialization; keeps the top two of each. */
export function rankDirections(groups) {
  return Object.entries(groups)
    .map(([directionKey, specs]) => ({
      direction: directionKey,
      info: DIRECTIONS[directionKey],
      topScore: specs[0].score,
      top2: specs.slice(0, 2)
    }))
    .sort((a, b) => b.topScore - a.topScore);
}

/**
 * Confidence from the gap (in points) between the first and second direction.
 * @returns {{level: string, label: string, message: string}}
 */
export function calculateConfidence(gap) {
  if (gap >= 12) {
    return {
      level: 'high',
      label: 'عالية',
      message: 'نتيجتك واضحة — الاتجاه الأول يتفوق بوضوح على الاتجاه الثاني.'
    };
  }
  if (gap >= 7) {
    return {
      level: 'good',
      label: 'جيدة',
      message: 'يتفوق اتجاه واحد مع تداخل بسيط مع اتجاه آخر، وكلاهما يستحق النظر.'
    };
  }
  if (gap >= 3) {
    return {
      level: 'close',
      label: 'متقاربة',
      message: 'اتجاهان يتنافسان بقوة متقاربة، ويُفضّل أن تستكشف كليهما بعمق قبل الاختيار.'
    };
  }
  return {
    level: 'weak',
    label: 'منخفضة',
    message: 'اهتماماتك موزعة على أكثر من اتجاه بقوة متقاربة، وهذا طبيعي. استكشف الاتجاهين وتعرّف على تخصصات كل منهما قبل أن تقرر.'
  };
}

/**
 * Answer-quality thresholds for the "pattern" statistic (calibrated on the
 * 18-question quiz): a chi-square-like distance between how often each dimension
 * was chosen and the 25% expected from random picking among 4 options.
 *   random answers: median ~4.8 (90% below 9); average student ~10; clear preferences ~16.
 * Below FLAT_PATTERN there is no reliable preference; between FLAT and MILD it is
 * weak, so confidence is never shown as "high" however large the gap.
 */
const FLAT_PATTERN = 5.5;
const MILD_PATTERN = 9;

/**
 * Flags suspicious or weak answer sets:
 *  - straight: the same option position in >= 80% of answers (likely not reading)
 *  - flat / mild: choices spread evenly across dimensions, no standout
 *  - few: fewer than 70% of the questions answered
 */
export function assessAnswerQuality({ answered = 0, total = 18, positions = [], vector = [], tallies = null } = {}) {
  const flags = [];
  const spread = vector.length ? Math.max(...vector) - Math.min(...vector) : 0;

  if (positions.length >= 10) {
    const counts = {};
    positions.forEach(position => { counts[position] = (counts[position] || 0) + 1; });
    if (Math.max(...Object.values(counts)) / positions.length >= 0.8) flags.push('straight');
  }

  let pattern = null;
  if (tallies) {
    pattern = Object.values(tallies).reduce((sum, { offered, chosen }) => {
      const expected = 0.25 * offered;
      return expected ? sum + ((chosen - expected) ** 2) / expected : sum;
    }, 0);
  }
  const hasEnoughAnswers = pattern !== null && answered >= 10;
  if (spread < 2 || (hasEnoughAnswers && pattern < FLAT_PATTERN)) flags.push('flat');
  else if (hasEnoughAnswers && pattern < MILD_PATTERN) flags.push('mild');
  if (answered < Math.ceil(total * 0.7)) flags.push('few');

  return { flags, spread, answered, pattern };
}

/** Lowers confidence according to answer quality; never raises it. */
export function applyQuality(confidence, quality) {
  const flags = quality?.flags || [];

  if (flags.includes('straight')) {
    return {
      level: 'weak',
      label: 'منخفضة',
      message: 'لاحظنا أنك اخترت الموضع نفسه في أغلب الأسئلة، فقد لا تعكس النتيجة تفضيلاتك. جرّب الاختبار مرة أخرى بهدوء وقراءة كل خيار.'
    };
  }
  if (flags.includes('flat')) {
    return {
      level: 'weak',
      label: 'منخفضة',
      message: 'كانت اختياراتك متقاربة بين المجالات، فلم يظهر مجال متفوق بوضوح. هذا يحدث أحياناً، ويمكنك إعادة الاختبار لاحقاً أو استكشاف الاتجاهين معاً.'
    };
  }
  if (flags.includes('mild') && confidence.level === 'high') {
    return {
      level: 'good',
      label: 'جيدة',
      message: 'النتيجة واضحة نسبيًا، لكن اختياراتك كانت متقاربة قليلًا بين المجالات، فاستكشف الاتجاهين قبل أن تقرر.'
    };
  }
  if (flags.includes('few') && (confidence.level === 'high' || confidence.level === 'good')) {
    return {
      level: 'close',
      label: 'متوسطة',
      message: 'أجبت عن عدد قليل من الأسئلة، لذا النتيجة أقل دقة من المعتاد. أعد الاختبار كاملاً للحصول على نتيجة أوضح.'
    };
  }
  return confidence;
}

/**
 * Branch filter. A literary-branch student only ever sees literary and shared
 * (`both`) specializations; a scientific-branch student sees everything. The
 * filter is applied before ranking, so scientific specializations never take
 * part in the scores, gap or confidence shown to a literary student.
 *
 * The app stores the Arabic label ('أدبي' / 'علمي'); the internal key 'lit' is
 * accepted too so callers are not tied to the display text.
 */
const LITERARY_BRANCH_VALUES = ['أدبي', 'lit'];

export function filterByBranch(userBranch, specializations = SPECIALIZATIONS) {
  if (!LITERARY_BRANCH_VALUES.includes(userBranch)) return specializations;
  return specializations.filter(spec => spec.branch === 'lit' || spec.branch === 'both');
}

/**
 * Full result for one student.
 *
 * @param {number[]} studentVector
 * @param {string} [userBranch='علمي']  'علمي' (all specializations) or 'أدبي' (literary + shared)
 * @param {Object|null} [quality]        output of assessAnswerQuality
 * @returns {{first, second, confidence, gap, quality, studentVector, allRanked}}
 */
export function computeResult(studentVector, userBranch = 'علمي', quality = null) {
  const ranked = rankSpecializations(studentVector, filterByBranch(userBranch));
  const directionsRanked = rankDirections(groupByDirection(ranked));

  const first = directionsRanked[0];
  // With a single direction available there is no runner-up; reuse the first
  // rather than reaching outside the branch filter.
  const second = directionsRanked[1] || first;

  // Round first, then derive the level from the rounded gap so the number on
  // screen and the confidence label always agree.
  const gap = Math.round((first.topScore - second.topScore) * 10) / 10;
  const confidence = applyQuality(calculateConfidence(gap), quality);

  return {
    first,
    second,
    confidence,
    gap,
    quality,
    studentVector,
    allRanked: ranked
  };
}
