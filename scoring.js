/**

 * scoring.js

 * 

 * خوارزمية حساب النتيجة في اختبار "مساري"

 * 

 * الخطوات:

 * 1. حساب درجة الطالب على كل بُعد

 * 2. تحويلها إلى متجه (vector) بترتيب ثابت

 * 3. حساب Cosine Similarity مع كل تخصص

 * 4. ترتيب التخصصات حسب التشابه

 * 5. تجميعها حسب الاتجاه

 * 6. اختيار أعلى اتجاهين

 * 7. من كل اتجاه: أفضل تخصصين

 * 8. حساب مستوى الثقة

 */



import { DIMENSION_KEYS } from './dimensions.js?v=20261007-v12';

import { SPECIALIZATIONS } from './specializations.js?v=20261007-v12';

import { DIRECTIONS } from './directions.js?v=20261007-v12';



/**

 * المرحلة 1: حساب درجة الطالب على كل بُعد

 * 

 * @param {Object} answersByDimension - كائن يحتوي على مصفوفات النقاط لكل بُعد

 *   مثال: { anal: [8, 9, 7], creative: [4, 5], ... }

 * @returns {Object} كائن بدرجة كل بُعد

 *   مثال: { anal: 8.0, creative: 4.5, ... }

 */

export function calculateDimensionScores(answersByDimension) {

  const scores = {};

  

  for (const dimKey of DIMENSION_KEYS) {

    const values = answersByDimension[dimKey] || [];

    

    if (values.length === 0) {

      // إذا لم يجب الطالب على أي سؤال من هذا البعد

      scores[dimKey] = 5; // قيمة محايدة

    } else {

      const sum = values.reduce((acc, val) => acc + val, 0);

      scores[dimKey] = sum / values.length;

    }

  }

  

  return scores;

}



/**

 * المرحلة 2: تحويل درجات الأبعاد إلى متجه بترتيب ثابت

 * 

 * @param {Object} scores - كائن درجات الأبعاد

 * @returns {Array<number>} مصفوفة من 7 أرقام

 */

export function toVector(scores) {

  return DIMENSION_KEYS.map(key => scores[key] || 0);

}



/**

 * المرحلة 3: حساب Cosine Similarity بين متجهين

 * 

 * المعادلة: (A · B) / (||A|| × ||B||)

 * النتيجة: رقم بين 0 و 1

 * 

 * @param {Array<number>} vecA

 * @param {Array<number>} vecB

 * @returns {number} معامل التشابه (0-1)

 */

export function cosineSimilarity(vecA, vecB) {

  if (vecA.length !== vecB.length) {

    throw new Error('المتجهان يجب أن يكونا بنفس الطول');

  }

  

  // الضرب النقطي (dot product)

  let dotProduct = 0;

  for (let i = 0; i < vecA.length; i++) {

    dotProduct += vecA[i] * vecB[i];

  }

  

  // طول كل متجه (magnitude)

  let magA = 0;

  let magB = 0;

  for (let i = 0; i < vecA.length; i++) {

    magA += vecA[i] * vecA[i];

    magB += vecB[i] * vecB[i];

  }

  magA = Math.sqrt(magA);

  magB = Math.sqrt(magB);

  

  // حماية من القسمة على صفر

  if (magA === 0 || magB === 0) return 0;

  

  return dotProduct / (magA * magB);

}



/**

 * معامل ارتباط بيرسون (Pearson Correlation) بين متجهين

 * = Cosine Similarity بعد طرح متوسط كل متجه منه (تمركز)

 * النتيجة: رقم بين -1 و +1

 * يحل مشكلة تقارب النتائج عندما تكون كل القيم موجبة

 * 

 * @param {Array<number>} vecA

 * @param {Array<number>} vecB

 * @returns {number} معامل الارتباط (-1 إلى +1)

 */

export function pearsonCorrelation(vecA, vecB) {

  if (vecA.length !== vecB.length) {

    throw new Error('المتجهان يجب أن يكونا بنفس الطول');

  }

  

  const n = vecA.length;

  const meanA = vecA.reduce((sum, v) => sum + v, 0) / n;

  const meanB = vecB.reduce((sum, v) => sum + v, 0) / n;

  

  let dot = 0;

  let magA = 0;

  let magB = 0;

  for (let i = 0; i < n; i++) {

    const a = vecA[i] - meanA;

    const b = vecB[i] - meanB;

    dot += a * b;

    magA += a * a;

    magB += b * b;

  }

  

  // حماية من القسمة على صفر (متجه ثابت القيم)

  if (magA === 0 || magB === 0) return 0;

  

  return dot / (Math.sqrt(magA) * Math.sqrt(magB));

}



/**

 * تحويل معامل بيرسون من المجال [-1, +1] إلى نسبة [0, 100]

 * الصيغة A: (pearson + 1) * 50

 * 

 * @param {number} pearson

 * @returns {number} نسبة بين 0 و 100

 */

export function toPercent(pearson) {

  return (pearson + 1) * 50;

}



/**

 * المرحلة 4: ترتيب التخصصات حسب التشابه مع الطالب

 * 

 * @param {Array<number>} studentVector

 * @param {Array} [specList] - التخصصات المراد ترتيبها (الافتراضي: كل التخصصات)

 * @returns {Array} قائمة التخصصات مع نسبة التشابه، مرتبة تنازلياً

 */

// معايرة الاتجاهات: لعدد التخصصات وتشابه بصماتها في كل اتجاه أثر بنيوي على أعلى نسبة يصلها.
// بمحاكاة آلاف الإجابات (عشوائية ومختلطة) كان «الاقتصاد والإدارة» يتصدّر 12% فقط و«الإنسان والمجتمع» 28%،
// بينما العدل 20% لكل اتجاه. هذه الإزاحات الصغيرة (بالنقاط المئوية) تعيد التوازن دون تغيير ترتيب التخصصات داخل الاتجاه.
// إن غيّرت التخصصات أو الأسئلة أعد معايرتها بالمحاكاة.
export const DIRECTION_CALIBRATION = Object.freeze({
  health: -0.3,
  engineering: -0.2,
  business: 2.9,
  humanities: -2.0,
  culture: -0.4
});

export function rankSpecializations(studentVector, specList = SPECIALIZATIONS) {

  return specList

    .map(spec => ({

      ...spec,

      score: Math.min(100, Math.max(0, toPercent(pearsonCorrelation(studentVector, spec.fingerprint)) + (DIRECTION_CALIBRATION[spec.direction] || 0)))

    }))

    .sort((a, b) => b.score - a.score);

}



/**

 * المرحلة 5: تجميع التخصصات حسب الاتجاه

 * 

 * @param {Array} ranked - التخصصات المرتبة

 * @returns {Object} كائن: كل مفتاح اتجاه → قائمة تخصصاته المرتبة

 */

export function groupByDirection(ranked) {

  const groups = {};

  

  for (const spec of ranked) {

    if (!groups[spec.direction]) {

      groups[spec.direction] = [];

    }

    groups[spec.direction].push(spec);

  }

  

  return groups;

}



/**

 * المرحلة 6: ترتيب الاتجاهات حسب قوتها

 * 

 * قوة الاتجاه = أعلى تخصص فيه

 * 

 * @param {Object} groups - التخصصات مجمعة حسب الاتجاه

 * @returns {Array} قائمة الاتجاهات مرتبة تنازلياً

 */

export function rankDirections(groups) {

  return Object.entries(groups)

    .map(([directionKey, specs]) => ({

      direction: directionKey,

      info: DIRECTIONS[directionKey],

      topScore: specs[0].score,

      top2: specs.slice(0, 2) // أفضل تخصصين في هذا الاتجاه

    }))

    .sort((a, b) => b.topScore - a.topScore);

}



/**

 * المرحلة 7: حساب مستوى الثقة بناءً على الفجوة

 * 

 * @param {number} gap - الفجوة بين الاتجاه الأول والثاني (نسبة مئوية)

 * @returns {Object} كائن يحتوي على المستوى والرسالة العربية

 */

export function calculateConfidence(gap) {
  if (gap >= 12) {
    return {
      level: 'high',
      label: 'عالية',
      message: 'نتيجتك واضحة — الاتجاه الأول يتفوق بوضوح على الاتجاه الثاني.'
    };
  } else if (gap >= 7) {
    return {
      level: 'good',
      label: 'جيدة',
      message: 'يتفوق اتجاه واحد مع تداخل بسيط مع اتجاه آخر، وكلاهما يستحق النظر.'
    };
  } else if (gap >= 3) {
    return {
      level: 'close',
      label: 'متقاربة',
      message: 'اتجاهان يتنافسان بقوة متقاربة، ويُفضّل أن تستكشف كليهما بعمق قبل الاختيار.'
    };
  } else {
    return {
      level: 'weak',
      label: 'منخفضة',
      message: 'اهتماماتك موزعة على أكثر من اتجاه بقوة متقاربة، وهذا طبيعي. استكشف الاتجاهين وتعرّف على تخصصات كل منهما قبل أن تقرر.'
    };
  }
}

/**

 * المرحلة النهائية: حساب النتيجة الكاملة

 * 

 * @param {Array<number>} studentVector - متجه الطالب

 * @param {string} [userBranch='علمي'] - فرع الطالب: 'علمي' (كل التخصصات) أو 'أدبي' (الأدبية والمشتركة فقط)

 * @returns {Object} النتيجة الكاملة:

 *   - first: الاتجاه الأول (مع تخصصيه)

 *   - second: الاتجاه الثاني (مع تخصصيه)

 *   - confidence: مستوى الثقة

 *   - gap: الفجوة

 *   - studentVector: متجه الطالب

 *   - allRanked: كل التخصصات مرتّبة

 */

/**
 * تقييم جودة إجابات الطالب (طالب حقيقي غير مثالي):
 * - straight: اختار الموضع نفسه في ≥80% من الأسئلة (غالباً لم يقرأ الخيارات)
 * - flat: اختياراته متقاربة بين الأبعاد فلا يظهر بُعد متفوق
 * - few: أجاب عن أقل من 70% من الأسئلة
 */
// عتبات مقياس النمط (معايَرة بالمحاكاة على بنك الأسئلة الحالي، 18 سؤالاً):
// - الإجابة العشوائية: وسيط ≈ 4.8 و90% منها أقل من 9
// - طالب عادي بتفضيلات متوسطة: وسيط ≈ 10، وتفضيلات واضحة: ≈ 16
// أقل من FLAT_PATTERN: لا يظهر تفضيل يُعتمد عليه فتنخفض الثقة.
// بين FLAT_PATTERN و MILD_PATTERN: تفضيل خفيف، فلا تُعرض الثقة «عالية» مهما كانت الفجوة.
const FLAT_PATTERN = 5.5;
const MILD_PATTERN = 9;

export function assessAnswerQuality({ answered = 0, total = 18, positions = [], vector = [], tallies = null } = {}) {
  const flags = [];
  const spread = vector.length ? Math.max(...vector) - Math.min(...vector) : 0;

  if (positions.length >= 10) {
    const counts = {};
    positions.forEach(p => { counts[p] = (counts[p] || 0) + 1; });
    if (Math.max(...Object.values(counts)) / positions.length >= 0.8) flags.push('straight');
  }
  // مقياس النمط: كم ابتعدت اختياراتك عمّا يتوقع من الاختيار العشوائي (كل خيار من 4 = 25%).
  // الإجابة العشوائية تعطي قيمة وسيطها ≈ 5 ونادراً ما تتجاوز 10؛ أصحاب التفضيلات الواضحة يتجاوزون 12 غالباً.
  let pattern = null;
  if (tallies) {
    pattern = Object.values(tallies).reduce((sum, { offered, chosen }) => {
      const expected = 0.25 * offered;
      return expected ? sum + ((chosen - expected) ** 2) / expected : sum;
    }, 0);
  }
  const enough = pattern !== null && answered >= 10;
  if (spread < 2 || (enough && pattern < FLAT_PATTERN)) flags.push('flat');
  else if (enough && pattern < MILD_PATTERN) flags.push('mild');
  if (answered < Math.ceil(total * 0.7)) flags.push('few');

  return { flags, spread, answered, pattern };
}

/**
 * تعديل مستوى الثقة بحسب جودة الإجابات (لا يرفع الثقة أبداً، يخفضها فقط)
 */
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

export function computeResult(studentVector, userBranch = 'علمي', quality = null) {

  // الطالب الأدبي يرى التخصصات الأدبية والمشتركة فقط، والعلمي يرى كل التخصصات

  const allowed = userBranch === 'أدبي'

    ? SPECIALIZATIONS.filter(s => s.branch === 'lit' || s.branch === 'both')

    : SPECIALIZATIONS;

  

  // ترتيب التخصصات

  const ranked = rankSpecializations(studentVector, allowed);

  

  // تجميعها حسب الاتجاه

  const groups = groupByDirection(ranked);

  

  // ترتيب الاتجاهات

  const directionsRanked = rankDirections(groups);

  

  // أعلى اتجاهين

  const first = directionsRanked[0];

  let second = directionsRanked[1];
  if (!second) {
    const fallback = rankDirections(groupByDirection(rankSpecializations(studentVector)))
      .find(d => d.direction !== first.direction);
    second = fallback || first;
  }

  

  // الفجوة (تُقرَّب أولاً، ثم يُحسب المستوى من القيمة المقرَّبة لضمان تناسق العرض)

  const rawGap = first.topScore - second.topScore;

  const gap = Math.round(rawGap * 10) / 10;

  

  // مستوى الثقة

  const confidence = applyQuality(calculateConfidence(gap), quality);

  

  return {

    first,

    second,

    confidence,

    gap, // القيمة المقرَّبة
    quality,

    studentVector,

    allRanked: ranked

  };

}