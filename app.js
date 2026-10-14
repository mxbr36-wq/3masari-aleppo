/**
 * app.js — نقطة تجميع منصة «مساري»
 *
 * الطبقات (بترتيب ظهورها في الملف):
 *   QuizStorage    تخزين الحالة في localStorage
 *   QuizEngine     نموذج الاختبار: توليد الأسئلة، الإجابات، التخطي، حساب النتيجة
 *   QuizUI         واجهة التسجيل والأسئلة والنتيجة والنوافذ
 *   ResultExporter صورة المشاركة (Canvas)
 *   NotesFeedback  نموذج الملاحظات
 *   AppUtilities   الثيم والحركات وعدّاد الزيارات
 *
 * مبدأ عام: الـ Engine لا يلمس DOM، والـ UI لا يحسب شيئاً؛ النتيجة تُشتق دائماً
 * من الإجابات ولا تُخزَّن، لذلك استعادة الجلسة حتمية.
 */

import { QUESTION_BANK } from './questions.js?v=2.0';
import { DIMENSIONS, DIMENSION_KEYS } from './dimensions.js?v=2.0';
import { DIRECTIONS } from './directions.js?v=2.0';
import { SPECIALIZATIONS } from './specializations.js?v=2.0';
import { getIcon, renderIcons } from './icons.js?v=2.0';
import { makeQR } from './qr.js?v=2.0';
import {
    calculateDimensionScores,
    toVector,
    assessAnswerQuality,
    computeResult as computeScoringResult
} from './scoring.js?v=2.0';
import { injectGlowDefs, sparkline } from './glow.js?v=2.0';
import { MasariChat } from './chatbot.js?v=2.0';

/* ---------- الثوابت ---------- */

// كل سؤال يعرض 4 عبارات من 4 أبعاد مختلفة (اختيار إجباري)
const QUESTIONS_PER_QUIZ = 18;
const OPTIONS_PER_QUESTION = 4;

// قيمة أولية لكل بُعد (الاحتمال المتوقع 1/4 = 2.5 من 10) تُضاف PRIOR_WEIGHT مرات
// لتخفيف أثر الصدفة عندما يظهر البُعد مرات قليلة
const PRIOR_SCORE = 2.5;
const PRIOR_WEIGHT = 2;

const MAX_SKIPS = 2;

// محيط حلقة نسبة التوافق: 2πr حيث r = 42
const RING_CIRC = 263.9;

const AGE_MIN = 14;
const AGE_MAX = 100;
const NAME_MIN_LENGTH = 3;
const PHONE_MIN_DIGITS = 10;

// رقم الإصدار في المفتاح: تغيير بنية الحالة يستلزم رفعه كي تُهمل الجلسات القديمة
const STORAGE_KEY = 'masari_state_v4';

const FORM_GUARD_KEY = 'masari_form_guard';
const FORM_COOLDOWN_MS = 5 * 60 * 1000;

const REGISTRATION_FORM = Object.freeze({
    url: 'https://docs.google.com/forms/d/e/1FAIpQLSd8Kau8gogYPE0kgVIwQ5SLJjH553BDacjZwFrGyb8KD5rbdA/formResponse',
    entries: Object.freeze({
        name: 'entry.847679888',
        phone: 'entry.985614909',
        age: 'entry.55727980',
        branch: 'entry.1992046458',
        targetBranch: 'entry.1598693234',
        union: 'entry.1660430982'
    })
});

// قيمة data-branch في الزر ← النص المُرسل إلى النموذج
const BRANCH_LABELS = Object.freeze({
    sci: 'علمي',
    lit: 'أدبي'
});

const STUDY_TIPS = {
    health: "اهتم بالتطبيق العملي والتدريب الميداني قدر الإمكان. احرص على صحة نومك وتغذيتك خلال سنوات الدراسة الطويلة، فالاعتناء بنفسك جزء من إعدادك المهني.",
    engineering: "طبّق كل فكرة بشكل عملي حتى لو كانت بسيطة. احتفظ بمشاريعك الصغيرة، فهي التي تبني مهاراتك وتفتح لك أبواب التدريب لاحقًا.",
    business: "اربط ما تدرسه بأمثلة واقعية من السوق. تابع المشاريع الصغيرة حولك وافهم كيف تُدار، فهذا يعمّق فهمك أكثر من النظريات وحدها.",
    humanities: "خصّص وقتًا للقراءة الحرة بجانب المقرر. حاول أن تشرح ما تعلمته لشخص آخر، فهذا يثبّت الفكرة ويكشف لك نقاط الضعف.",
    culture: "اجمع أفكارك في دفتر أو ملف واحد، وخصّص وقتًا أسبوعيًا للتجريب الحر بلا ضغط علامة. الإبداع يحتاج مساحة منتظمة، وليس لحظات إلهام فقط."
};

const DEFAULT_STUDY_TIP = 'نظّم وقتك، وتابع ما تتعلمه بالتطبيق العملي، ولا تتردد في طلب المساعدة ممن سبقك في الدراسة.';

const SKIP_REASONS = Object.freeze(['السؤال غير واضح', 'لا يناسبني أي خيار', 'أفضّل عدم الإجابة']);

const SPECIALIZATION_RANK_LABELS = Object.freeze(['التخصص الأول', 'التخصص الثاني']);

// ذاكرة الأسئلة الظاهرة مؤخراً (آخر 3 اختبارات)
const SEEN_KEY = 'masari_seen_v1';
const SEEN_MAX = 54;

/* ---------- التخزين ---------- */

// كل العمليات تبتلع الأخطاء عمداً: الوضع الخاص أو امتلاء التخزين لا يجب أن يكسر الاختبار
class QuizStorage {
    static save(state) {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) {}
    }
    static load() {
        try { return JSON.parse(localStorage.getItem(STORAGE_KEY)); } catch (e) { return null; }
    }
    static clear() {
        try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
    }
}

/* ---------- Google Forms ---------- */

// منع الإرسال المكرر لنفس الرقم خلال فترة التهدئة (يحمي الجدول من إعادة الضغط والتحديث)
function shouldSkipFormSubmit(phone) {
    try {
        const raw = localStorage.getItem(FORM_GUARD_KEY);
        if (!raw) return false;
        const data = JSON.parse(raw);
        if (!data || !data.ts) return false;
        if (Date.now() - data.ts > FORM_COOLDOWN_MS) return false;
        const lastDigits = String(data.phone || '').replace(/\D/g, '');
        const currentDigits = String(phone || '').replace(/\D/g, '');
        return lastDigits.length >= 8 && currentDigits.length >= 8 && lastDigits === currentDigits;
    } catch (e) { return false; }
}

function markFormSubmitted(phone) {
    try {
        localStorage.setItem(FORM_GUARD_KEY, JSON.stringify({
            phone: String(phone || '').replace(/\D/g, ''),
            ts: Date.now()
        }));
    } catch (e) {}
}

// وضع no-cors يجعل الاستجابة مبهمة (opaque): لا يمكن معرفة نجاح الإرسال، ولا تُرسل الحقول الفارغة
function postGoogleForm(formUrl, fields) {
    const payload = new URLSearchParams();
    Object.entries(fields).forEach(([key, value]) => {
        if (value !== undefined && value !== null && String(value).length) payload.append(key, String(value));
    });
    return fetch(formUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
        body: payload.toString()
    }).catch(error => console.error('Google Form error:', error));
}

/* ---------- أدوات مساعدة ---------- */

function loadSeenQuestions() {
    try { return new Set(JSON.parse(localStorage.getItem(SEEN_KEY)) || []); } catch (e) { return new Set(); }
}

function saveSeenQuestions(texts) {
    try {
        const merged = [...loadSeenQuestions(), ...texts].slice(-SEEN_MAX);
        localStorage.setItem(SEEN_KEY, JSON.stringify(merged));
    } catch (e) {}
}

// Fisher–Yates؛ تُرجع نسخة ولا تعدّل الأصل
function shuffleArray(arr) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

const HTML_ESCAPES = Object.freeze({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
});

// أي نص قادم من المستخدم أو من البيانات يمر من هنا قبل innerHTML
function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, ch => HTML_ESCAPES[ch]);
}

// لوحة المفاتيح العربية قد تُنتج أرقاماً هندية/فارسية يعدّها \D «غير رقم»
function normalizeDigits(value) {
    return String(value ?? '')
        .replace(/[\u0660-\u0669]/g, ch => String(ch.charCodeAt(0) - 0x0660))
        .replace(/[\u06F0-\u06F9]/g, ch => String(ch.charCodeAt(0) - 0x06F0));
}

/* ---------- النموذج: QuizEngine ---------- */

const EMPTY_USER_DATA = Object.freeze({
    name: '',
    phone: '',
    age: '',
    branch: '',
    targetBranch: '',
    union: ''
});

class QuizEngine {
    constructor() {
        this.activeQuestions = [];
        this.userData = { ...EMPTY_USER_DATA };
        this.resetProgress();
    }

    // لا تمسّ الأسئلة ولا بيانات الطالب
    resetProgress() {
        this.answers = Array(QUESTIONS_PER_QUIZ).fill(null);
        this.currentIndex = 0;
        this.skipReasons = [];
        this.dimensionScores = null;
        this.completed = false;
        this.result = null;
    }

    // مشتق من skipReasons كي لا يوجد مصدران للحقيقة
    get skipUsed() {
        return this.skipReasons.length;
    }

    // لا حفظ هنا عمداً: الأسئلة لم تُولَّد بعد
    setUserData(name, phone, age, branch, targetBranch, union) {
        this.userData = { name, phone, age, branch, targetBranch, union };
    }

    /**
     * اختيار جشِع (greedy) لـ 18 سؤالاً من البنك. في كل خطوة يُختار السؤال الأقل «كلفة»:
     *  - ظهور سابق للأبعاد الأربعة (توازن الأبعاد)
     *  - تكرار مواجهة بُعدين معاً (تنويع المقارنات)
     *  - تكرار الأيقونة، وكلفة 1000 لموضوع (topic) سبق اختياره (مانع فعلي لتشابه المواقف)
     *  - ضجيج عشوائي صغير يكسر التعادل فتختلف الاختبارات بين المحاولات
     * ثم تُخلط الأسئلة والخيارات؛ ترتيب الملف لا يؤثر على العرض.
     */
    generateQuestions() {
        const offered = Object.fromEntries(DIMENSION_KEYS.map(key => [key, 0]));
        const pairSeen = {};
        const iconUsed = {};
        const topicUsed = {};
        const pool = shuffleArray(QUESTION_BANK);
        const chosen = [];
        const pairKey = (a, b) => (a < b ? `${a}|${b}` : `${b}|${a}`);

        while (chosen.length < QUESTIONS_PER_QUIZ && pool.length) {
            let bestIndex = 0;
            let bestCost = Infinity;
            pool.forEach((question, index) => {
                const dims = question[1].map(([, dim]) => dim);
                let cost = dims.reduce((sum, dim) => sum + offered[dim], 0);
                for (let i = 0; i < dims.length; i++) {
                    for (let j = i + 1; j < dims.length; j++) cost += 0.5 * (pairSeen[pairKey(dims[i], dims[j])] || 0);
                }
                cost += 3 * (iconUsed[question[2]] || 0);
                if (topicUsed[question[3]]) cost += 1000;
                cost += Math.random() * 0.8;
                if (cost < bestCost) { bestCost = cost; bestIndex = index; }
            });
            const [picked] = pool.splice(bestIndex, 1);
            const dims = picked[1].map(([, dim]) => dim);
            dims.forEach(dim => { offered[dim]++; });
            for (let i = 0; i < dims.length; i++) {
                for (let j = i + 1; j < dims.length; j++) {
                    const key = pairKey(dims[i], dims[j]);
                    pairSeen[key] = (pairSeen[key] || 0) + 1;
                }
            }
            iconUsed[picked[2]] = (iconUsed[picked[2]] || 0) + 1;
            topicUsed[picked[3]] = (topicUsed[picked[3]] || 0) + 1;
            chosen.push(picked);
        }

        this.activeQuestions = shuffleArray(chosen).map(([text, options, icon]) => ({
            text,
            icon: icon || 'sparkles',
            options: shuffleArray(options).map(([optionText, dimension]) => ({ text: optionText, dimension }))
        }));

        this.resetProgress();
    }

    // optionIndex = ترتيب الخيار كما هو معروض بعد الخلط
    setAnswer(optionIndex) {
        const question = this.activeQuestions[this.currentIndex];
        if (!question || !Number.isInteger(optionIndex)) return false;
        const option = question.options[optionIndex];
        if (!option) return false;

        this.answers[this.currentIndex] = { dimension: option.dimension, optionText: option.text, position: optionIndex };
        // الإجابة عن سؤال متخطّى تُلغي تخطيه وتُرجع حصته
        this.skipReasons = this.skipReasons.filter(skip => skip.index !== this.currentIndex);
        QuizStorage.save(this.getState());
        return true;
    }

    isSkipped(index) {
        return this.skipReasons.some(skip => skip.index === index);
    }

    skip(reason) {
        if (this.answers[this.currentIndex]) return false;
        if (this.isSkipped(this.currentIndex)) return true;
        if (this.skipUsed >= MAX_SKIPS) return false;

        this.skipReasons.push({
            index: this.currentIndex,
            reason: reason || '',
            text: this.activeQuestions[this.currentIndex]?.text || ''
        });
        QuizStorage.save(this.getState());
        return true;
    }

    next() {
        if (this.currentIndex < QUESTIONS_PER_QUIZ - 1) {
            this.currentIndex++;
            QuizStorage.save(this.getState());
            return true;
        }
        return false;
    }

    prev() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            QuizStorage.save(this.getState());
            return true;
        }
        return false;
    }

    isComplete() {
        if (this.activeQuestions.length !== QUESTIONS_PER_QUIZ) return false;
        return this.answers.every((answer, i) => answer !== null || this.isSkipped(i));
    }

    getState() {
        return {
            activeQuestions: this.activeQuestions,
            answers: this.answers,
            currentIndex: this.currentIndex,
            skipReasons: this.skipReasons,
            userData: this.userData,
            dimensionScores: this.dimensionScores,
            completed: this.completed
        };
    }

    // localStorage قابل للتعديل من المستخدم: لا نستعيد حالة قبل التحقق من كل حقل فيها
    static isValidState(state) {
        if (!state || typeof state !== 'object') return false;
        const { activeQuestions, answers, currentIndex, skipReasons } = state;

        if (!Array.isArray(activeQuestions) || activeQuestions.length !== QUESTIONS_PER_QUIZ) return false;
        const questionsOk = activeQuestions.every(q =>
            q && typeof q.text === 'string' && Array.isArray(q.options) &&
            q.options.length === OPTIONS_PER_QUESTION &&
            q.options.every(o => o && typeof o.text === 'string' && DIMENSION_KEYS.includes(o.dimension)) &&
            new Set(q.options.map(o => o.dimension)).size === OPTIONS_PER_QUESTION
        );
        if (!questionsOk) return false;

        if (!Array.isArray(answers) || answers.length !== QUESTIONS_PER_QUIZ) return false;
        const answersOk = answers.every((a, i) =>
            a === null || (
                a && typeof a.optionText === 'string' &&
                activeQuestions[i].options.some(o => o.dimension === a.dimension && o.text === a.optionText)
            )
        );
        if (!answersOk) return false;

        if (!Number.isInteger(currentIndex) || currentIndex < 0 || currentIndex >= QUESTIONS_PER_QUIZ) return false;

        if (!Array.isArray(skipReasons) || skipReasons.length > MAX_SKIPS) return false;
        const skippedIndexes = skipReasons.map(skip => skip && skip.index);
        const skipsOk = skippedIndexes.every(i => Number.isInteger(i) && i >= 0 && i < QUESTIONS_PER_QUIZ && answers[i] === null);
        if (!skipsOk || new Set(skippedIndexes).size !== skippedIndexes.length) return false;

        return true;
    }

    // تُرجع false دون أي تغيير إذا كانت الحالة غير سليمة
    loadState(state) {
        if (!QuizEngine.isValidState(state)) return false;

        const savedUser = state.userData || {};
        this.activeQuestions = state.activeQuestions;
        this.answers = state.answers;
        this.currentIndex = state.currentIndex;
        this.skipReasons = state.skipReasons.map(skip => ({
            index: skip.index,
            reason: String(skip.reason || ''),
            text: String(skip.text || '')
        }));
        this.userData = {
            name: savedUser.name ?? '',
            phone: savedUser.phone ?? '',
            age: savedUser.age ?? '',
            branch: savedUser.branch ?? '',
            targetBranch: savedUser.targetBranch ?? '',
            union: savedUser.union ?? ''
        };

        // علم completed المخزَّن لا يُصدَّق وحده: يجب أن يتطابق مع اكتمال الإجابات فعلاً
        this.completed = Boolean(state.completed) && this.isComplete();
        this.dimensionScores = null;
        this.result = this.completed ? this.computeResult() : null;
        return true;
    }

    /**
     * درجة كل بُعد = نسبة المرات التي اختاره الطالب حين عُرض عليه (0–10)، مع prior للتنعيم.
     * ثم تُقيَّم جودة الإجابات (نمط ثابت، نتيجة مسطّحة، أسئلة قليلة) وتُمرَّر للتسجيل
     * ليخفض الثقة عند الحاجة. الحساب حتمي بالنسبة للإجابات.
     */
    computeResult() {
        const valuesByDimension = {};
        const positions = [];
        const tallies = Object.fromEntries(DIMENSION_KEYS.map(key => [key, { offered: 0, chosen: 0 }]));
        let answered = 0;

        this.answers.forEach((answer, i) => {
            if (!answer) return;
            answered++;
            tallies[answer.dimension].chosen++;
            if (Number.isInteger(answer.position)) positions.push(answer.position);
            this.activeQuestions[i].options.forEach(option => {
                tallies[option.dimension].offered++;
                if (!valuesByDimension[option.dimension]) valuesByDimension[option.dimension] = [];
                valuesByDimension[option.dimension].push(option.dimension === answer.dimension ? 10 : 0);
            });
        });
        DIMENSION_KEYS.forEach(key => {
            if (!valuesByDimension[key]) valuesByDimension[key] = [];
            for (let n = 0; n < PRIOR_WEIGHT; n++) valuesByDimension[key].push(PRIOR_SCORE);
        });

        this.dimensionScores = calculateDimensionScores(valuesByDimension);
        const vector = toVector(this.dimensionScores);
        const quality = assessAnswerQuality({ answered, total: QUESTIONS_PER_QUIZ, positions, vector, tallies });
        return computeScoringResult(vector, this.userData.branch, quality);
    }
}

/* ---------- الواجهة: QuizUI ---------- */

class QuizUI {
    constructor(engine) {
        this.engine = engine;
        this.selectedBranch = '';   // 'sci' | 'lit'
        this.selectedUnion = '';    // 'نعم' | 'لا'
        this.flashTimer = null;

        this.cacheDOM();
        this.bindEvents();
        this.initAgeStepper();
        this.updateFlowSteps();
        this.checkSavedProgress();
    }

    // العناصر الناقصة تُسجَّل في الـ console بدل أن تُسقط الصفحة؛ بقية الكود يستخدم ?. و on()
    cacheDOM() {
        const missing = [];
        const byId = id => {
            const el = document.getElementById(id);
            if (!el) missing.push(id);
            return el;
        };

        this.introScreen = byId('introScreen');
        this.registrationScreen = byId('registrationScreen');
        this.quizContent = byId('quizContent');
        this.resultBox = byId('resultBox');

        this.startBtn = byId('startBtn');

        this.regName = byId('regName');
        this.regPhone = byId('regPhone');
        this.ageInput = byId('age');
        this.ageMinus = byId('ageMinus');
        this.agePlus = byId('agePlus');
        this.branchBtns = document.querySelectorAll('.branch-btn');
        this.unionBtns = document.querySelectorAll('.union-btn');
        this.regTargetBranch = byId('regTargetBranch');
        this.startQuizBtn = byId('startQuizBtn');

        this.titleBar = byId('titleBar');
        this.qCounter = byId('qCounter');
        this.bar = byId('bar');
        this.savedHint = byId('savedHint');
        this.questionsEl = byId('questions');
        this.navActions = byId('navActions');
        this.backBtn = byId('backBtn');
        this.skipBtn = byId('skipBtn');
        this.nextBtn = byId('nextBtn');

        this.resultPill = byId('resultPill');
        this.confidenceLabel = byId('confidenceLabel');
        this.bestCard = byId('bestCard');
        this.bestIcon = byId('bestIcon');
        this.bestName = byId('bestName');
        this.bestMeta = byId('bestMeta');
        this.bestPct = byId('bestPct');
        this.bestRing = byId('bestRing');
        this.directionStrip = byId('directionStrip');
        this.otherSpecs = byId('otherSpecs');
        this.dimensionsBars = byId('dimensionsBars');
        this.studyTipBox = byId('studyTipBox');
        this.studyTipText = byId('studyTipText');
        this.heroEl = document.getElementById('top');
        this.journeyEl = document.getElementById('journey');
        this.shareBtn = byId('shareBtn');
        this.restartBtn = byId('restartBtn');
        this.notesBtn = byId('notesBtn');

        this.majorModal = byId('majorModal');
        this.majorModalTitle = byId('majorModalTitle');
        this.majorModalSub = byId('majorModalSub');
        this.majorModalClose = byId('majorModalClose');
        this.majorModalSummary = byId('majorModalSummary');
        this.majorModalStudy = byId('majorModalStudy');
        this.majorModalDuration = byId('majorModalDuration');
        this.majorModalUniversities = byId('majorModalUniversities');
        this.majorModalJobs = byId('majorModalJobs');
        this.majorModalAdvice = byId('majorModalAdvice');

        this.noteModal = byId('noteModal');
        this.noteModalTitle = byId('noteModalTitle');
        this.noteModalClose = byId('noteModalClose');
        this.noteText = byId('noteText');
        this.noteCancelBtn = byId('noteCancelBtn');
        this.noteSubmitBtn = byId('noteSubmitBtn');

        this.toastWrap = byId('toastWrap');

        if (missing.length) {
            console.error('QuizUI: elements missing from index.html:', missing.join(', '));
        }
    }

    bindEvents() {
        const on = (element, type, handler) => {
            if (element) element.addEventListener(type, handler);
        };

        on(this.startBtn, 'click', () => {
            this.hideHero();
            this.introScreen?.classList.add('hidden');
            this.registrationScreen?.classList.remove('hidden');
            this.setHeroVisible(false);
        });

        this.branchBtns.forEach(btn => on(btn, 'click', () => {
            this.selectedBranch = btn.dataset.branch || '';
            this.setSelectedOption(this.branchBtns, btn);
        }));
        this.unionBtns.forEach(btn => on(btn, 'click', () => {
            this.selectedUnion = btn.dataset.union || '';
            this.setSelectedOption(this.unionBtns, btn);
        }));

        [this.regName, this.regPhone, this.ageInput, this.regTargetBranch].forEach(el =>
            ['input', 'change', 'keyup', 'blur'].forEach(evt => on(el, evt, () => this.updateFlowSteps())));
        [this.ageMinus, this.agePlus].forEach(el => on(el, 'click', () => this.updateFlowSteps()));

        on(this.startQuizBtn, 'click', () => this.submitRegistration());

        on(this.nextBtn, 'click', () => {
            const index = this.engine.currentIndex;
            if (index < QUESTIONS_PER_QUIZ - 1) {
                if (!this.engine.answers[index] && !this.engine.isSkipped(index)) {
                    this.showToast('اختر إجابة أولاً، أو اضغط «تخطي».', true);
                    return;
                }
                this.engine.next();
                this.updateUI();
            } else {
                this.showResult();
            }
        });

        on(this.backBtn, 'click', () => {
            if (this.engine.prev()) this.updateUI();
        });

        on(this.skipBtn, 'click', () => {
            const index = this.engine.currentIndex;
            if (this.engine.answers[index] || this.engine.isSkipped(index)) return;
            if (this.engine.skipUsed >= MAX_SKIPS) {
                this.showToast('يمكنك تخطي سؤالين فقط في كل اختبار.', true);
                return;
            }
            this.openSkipReasonPicker();
        });

        on(this.restartBtn, 'click', () => {
            if (confirm('سيتم مسح نتيجتك الحالية والبدء من جديد. متابعة؟')) this.restartQuiz();
        });

        on(document.getElementById('navCta'), 'click', e => {
            e.preventDefault();
            document.querySelector('.quiz-card')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });

        // قبل بدء الاختبار يعيد الشاشة الترحيبية؛ بعده يكتفي بالصعود لأعلى الصفحة
        on(document.getElementById('homeBtn'), 'click', e => {
            e.preventDefault();
            const inQuiz = this.quizContent && !this.quizContent.classList.contains('hidden');
            if (!inQuiz) {
                this.registrationScreen?.classList.add('hidden');
                this.introScreen?.classList.remove('hidden');
                this.setHeroVisible(true);
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        on(this.bestCard, 'click', () => this.openMajorModal(this.bestCard.dataset.specId));

        on(this.majorModalClose, 'click', () => this.closeMajorModal());
        on(this.majorModal, 'click', e => {
            if (e.target === this.majorModal) this.closeMajorModal();
        });

        document.addEventListener('keydown', e => this.handleKeydown(e));
    }

    setSelectedOption(buttons, activeBtn) {
        buttons.forEach(btn => {
            const isActive = btn === activeBtn;
            btn.classList.toggle('selected', isActive);
            btn.setAttribute('aria-checked', String(isActive));
        });
        this.updateFlowSteps();
    }

    // مراحل التسجيل: 1 البيانات ← 2 الفرع ← 3 الانضمام ← 4 البدء. كل مرحلة تتطلب اكتمال التي قبلها.
    updateFlowSteps() {
        const steps = document.querySelectorAll('.flow-step');
        if (!steps.length) return;

        const ageRaw = (this.ageInput?.value || '').trim();
        const phoneDigits = normalizeDigits(this.regPhone?.value).replace(/\D/g, '');
        const personalOk =
            (this.regName?.value || '').trim().length >= NAME_MIN_LENGTH &&
            phoneDigits.length >= PHONE_MIN_DIGITS &&
            /^\d{1,3}$/.test(ageRaw) && Number(ageRaw) >= AGE_MIN && Number(ageRaw) <= AGE_MAX;
        const done = [personalOk, personalOk && Boolean(this.selectedBranch)];
        done.push(done[1] && Boolean(this.selectedUnion));

        let current = done.findIndex(isDone => !isDone);
        if (current === -1) current = 3;
        steps.forEach((el, i) => {
            el.classList.toggle('done', i < current);
            const badge = el.querySelector('b');
            if (badge) badge.innerHTML = i < current ? getIcon('check', 16) : String(i + 1);
            el.classList.toggle('active', i === current);
        });
    }

    // رسمة الهيرو وشريط الرحلة تخصّان الشاشة الأولى فقط
    setHeroVisible(visible) {
        this.heroEl?.classList.toggle('hidden', !visible);
        this.journeyEl?.classList.toggle('hidden', !visible);
    }

    isModalActive(modal) {
        return Boolean(modal && modal.classList.contains('active'));
    }

    handleKeydown(event) {
        if (event.key === 'Escape') {
            // يُغلق الأعلى في ترتيب الطبقات فقط: التخطي ثم الملاحظات ثم التخصص
            const skipOverlay = document.getElementById('skipReasonOverlay');
            if (skipOverlay) { skipOverlay.remove(); return; }
            if (this.isModalActive(this.noteModal)) { this.noteModalClose?.click(); return; }
            if (this.isModalActive(this.majorModal)) { this.closeMajorModal(); }
            return;
        }

        if (event.key === 'Enter') {
            if (event.isComposing || event.repeat) return;
            if (event.ctrlKey || event.altKey || event.metaKey || event.shiftKey) return;
            if (!this.quizContent || this.quizContent.classList.contains('hidden')) return;
            if (this.engine.completed || this.resultBox?.classList.contains('active')) return;
            if (document.getElementById('skipReasonOverlay')) return;
            if (this.isModalActive(this.majorModal) || this.isModalActive(this.noteModal)) return;
            // هذه العناصر تعالج Enter بنفسها؛ تجاهلها يمنع التنفيذ المزدوج
            if (['BUTTON', 'A', 'INPUT', 'TEXTAREA', 'SELECT'].includes(event.target.tagName)) return;
            if (this.nextBtn && !this.nextBtn.disabled) this.nextBtn.click();
        }
    }

    initAgeStepper() {
        const input = this.ageInput;
        if (!input) return;
        input.min = AGE_MIN;
        input.max = AGE_MAX;

        // null عندما يكون الحقل فارغاً أو غير رقمي
        const readAge = () => {
            const raw = input.value.trim();
            if (!raw) return null;
            const n = Number(raw);
            return Number.isFinite(n) ? n : null;
        };
        const clamp = n => Math.min(AGE_MAX, Math.max(AGE_MIN, n));

        const updateButtons = () => {
            const age = readAge();
            if (this.ageMinus) this.ageMinus.disabled = age !== null && age <= AGE_MIN;
            if (this.agePlus) this.agePlus.disabled = age !== null && age >= AGE_MAX;
        };

        // إعادة تشغيل الأنميشن تتطلب إزالة الصنف وإجبار reflow قبل إضافته
        const animate = direction => {
            input.classList.remove('age-up', 'age-down');
            void input.offsetWidth;
            input.classList.add(direction > 0 ? 'age-up' : 'age-down');
        };
        const step = delta => {
            const age = readAge();
            input.value = age === null ? 17 : clamp(Math.round(age) + delta);
            animate(delta);
            updateButtons();
        };

        this.ageMinus?.addEventListener('click', () => step(-1));
        this.agePlus?.addEventListener('click', () => step(1));
        input.addEventListener('input', updateButtons);

        // الفارغ يبقى فارغاً ويُرفض لاحقاً في validateRegistration
        input.addEventListener('blur', () => {
            const age = readAge();
            if (age !== null) input.value = clamp(Math.round(age));
            updateButtons();
        });

        updateButtons();
    }

    // يُرجع البيانات إذا صحّت، وإلا null مع toast خطأ وتركيز على الحقل المعيب
    validateRegistration() {
        const name = this.regName.value.trim();
        const phone = normalizeDigits(this.regPhone.value).trim();
        const phoneDigits = phone.replace(/\D/g, '');
        const ageRaw = this.ageInput.value.trim();
        const age = Number(ageRaw);
        const targetBranch = this.regTargetBranch.value.trim();

        if (name.length < NAME_MIN_LENGTH) {
            this.showToast('يرجى إدخال الاسم الكامل (3 أحرف على الأقل)', true);
            this.regName.focus();
            return null;
        }
        if (phoneDigits.length < PHONE_MIN_DIGITS) {
            this.showToast('يرجى إدخال رقم هاتف صحيح (10 أرقام على الأقل)', true);
            this.regPhone.focus();
            return null;
        }
        if (!/^\d{1,3}$/.test(ageRaw) || age < AGE_MIN || age > AGE_MAX) {
            this.showToast(`يرجى إدخال عمر صحيح بين ${AGE_MIN} و${AGE_MAX}`, true);
            this.ageInput.focus();
            return null;
        }
        if (!this.selectedBranch) {
            this.showToast('يرجى اختيار الفرع الدراسي (علمي أو أدبي)', true);
            return null;
        }
        if (!this.selectedUnion) {
            this.showToast('يرجى اختيار نعم أو لا بخصوص الانضمام إلى اتحاد طلبة سورية', true);
            return null;
        }

        return { name, phone, age, branch: this.selectedBranch, targetBranch, union: this.selectedUnion };
    }

    submitRegistration() {
        const data = this.validateRegistration();
        if (!data) return;

        const branchLabel = BRANCH_LABELS[data.branch];

        if (!shouldSkipFormSubmit(data.phone)) {
            const { entries } = REGISTRATION_FORM;
            const fields = {
                [entries.name]: data.name,
                [entries.phone]: data.phone,
                [entries.age]: data.age,
                [entries.branch]: branchLabel,
                [entries.union]: data.union
            };
            if (data.targetBranch) fields[entries.targetBranch] = data.targetBranch;

            postGoogleForm(REGISTRATION_FORM.url, fields);
            markFormSubmitted(data.phone);
        }

        this.engine.setUserData(data.name, data.phone, data.age, branchLabel, data.targetBranch, data.union);
        this.startQuiz(true);
    }

    flashSaved() {
        if (!this.savedHint) return;
        this.savedHint.classList.add('show');
        clearTimeout(this.flashTimer);
        this.flashTimer = setTimeout(() => this.savedHint.classList.remove('show'), 1600);
    }

    showToast(message, isError = false) {
        if (!this.toastWrap) return;
        const el = document.createElement('div');
        el.className = 'toast' + (isError ? ' error' : '');
        el.textContent = message;
        this.toastWrap.appendChild(el);
        setTimeout(() => {
            el.style.opacity = '0';
            setTimeout(() => el.remove(), 300);
        }, 2800);
    }

    /* ----- الاختبار ----- */

    // استعادة الجلسة بعد التحديث؛ الحالة التالفة أو القديمة تُمسح ويبدأ الطالب من جديد
    checkSavedProgress() {
        const savedState = QuizStorage.load();
        if (!savedState) {
            QuizStorage.clear();
            return;
        }

        if (!this.engine.loadState(savedState)) {
            QuizStorage.clear();
            return;
        }

        if (this.engine.completed) {
            this.showResult(true);
        } else {
            this.showToast('تم استرجاع تقدمك السابق');
            this.transitionToQuiz();
        }
    }

    startQuiz(forceNew = false) {
        if (forceNew) QuizStorage.clear();
        this.engine.generateQuestions();

        // الحفظ بعد التوليد وليس قبله، كي لا تُحفظ حالة بلا أسئلة
        QuizStorage.save(this.engine.getState());

        this.transitionToQuiz();
        this.showToast('يلا نبلّش');
    }

    restartQuiz() {
        // المسح أولاً حتى لا تُستعاد النتيجة القديمة عند إعادة التحميل
        QuizStorage.clear();

        this.engine.activeQuestions = [];
        this.engine.resetProgress();
        this.engine.userData = { ...EMPTY_USER_DATA };

        // إعادة التحميل أضمن طريقة للعودة إلى الحالة الأولى الكاملة للصفحة
        window.location.replace(window.location.pathname + window.location.search);
    }

    transitionToQuiz() {
        this.hideHero();
        this.introScreen?.classList.add('hidden');
        this.registrationScreen?.classList.add('hidden');
        this.setHeroVisible(false);

        this.resultBox?.classList.remove('active');
        this.quizContent?.classList.remove('hidden');
        this.questionsEl?.classList.remove('hidden');
        this.navActions?.classList.remove('hidden');
        this.titleBar?.classList.remove('hidden');
        this.bar?.parentElement?.classList.remove('hidden');
        this.savedHint?.classList.remove('hidden');

        this.renderedIndex = -1;   // يفرض إعادة رسم السؤال الحالي
        this.updateUI();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // سؤال واحد في الدقيقة؛ يُعاد الرسم فقط عند تغيّر الفهرس (انظر renderedIndex في updateUI)
    renderCurrentQuestion() {
        const index = this.engine.currentIndex;
        const question = this.engine.activeQuestions[index];
        if (!question) {
            this.questionsEl.innerHTML = '';
            return;
        }

        this.questionsEl.innerHTML = `
            <div class="q active" data-q="${index}">
                <div class="q-head">
                    <span class="q-icon">${getIcon(question.icon || 'sparkles', 26)}</span>
                    <h4>${escapeHtml(question.text)}</h4>
                </div>
                <div class="options">
                    ${question.options.map((option, i) =>
                        `<button class="opt" type="button" data-index="${i}">${escapeHtml(option.text)}</button>`
                    ).join('')}
                </div>
            </div>`;

        this.questionsEl.querySelectorAll('.opt').forEach(btn => {
            btn.addEventListener('click', () => this.handleOptionClick(Number(btn.dataset.index)));
        });
        this.renderedIndex = index;
    }

    handleOptionClick(optionIndex) {
        if (!this.engine.setAnswer(optionIndex)) return;
        this.flashSaved();
        this.updateUI();
    }

    updateUI() {
        const engine = this.engine;
        const index = engine.currentIndex;
        const question = engine.activeQuestions[index];
        if (!question) return;

        if (this.renderedIndex !== index) this.renderCurrentQuestion();

        // المطابقة بنص الخيار لأن الخيارات فريدة داخل السؤال الواحد
        const answer = engine.answers[index];
        this.questionsEl.querySelectorAll('.opt').forEach((opt, i) => {
            const isSelected = Boolean(answer) && question.options[i].text === answer.optionText;
            opt.classList.toggle('selected', isSelected);
            opt.setAttribute('aria-pressed', String(isSelected));
        });

        this.bar.style.width = ((index / QUESTIONS_PER_QUIZ) * 100) + '%';
        this.qCounter.textContent = `السؤال ${index + 1} من ${QUESTIONS_PER_QUIZ}`;
        this.backBtn.disabled = index === 0;
        this.nextBtn.innerHTML = `<span>${index === QUESTIONS_PER_QUIZ - 1 ? 'اعرض نتيجتي' : 'التالي'}</span>${getIcon('arrowLeft', 18)}`;
        this.skipBtn.textContent = 'تخطي';
        this.skipBtn.disabled = engine.skipUsed >= MAX_SKIPS || Boolean(answer) || engine.isSkipped(index);
    }

    /* ----- التخطي ----- */

    openSkipReasonPicker() {
        document.getElementById('skipReasonOverlay')?.remove();

        const overlay = document.createElement('div');
        overlay.id = 'skipReasonOverlay';
        overlay.className = 'skip-reason-overlay';
        overlay.innerHTML = `
            <div class="skip-reason-card" role="dialog" aria-modal="true" aria-label="سبب التخطي">
                <div class="skip-reason-title">ليش حابب تتخطى؟</div>
                <div class="skip-reason-actions">
                    ${SKIP_REASONS.map(reason =>
                        `<button type="button" class="btn" data-reason="${escapeHtml(reason)}">${escapeHtml(reason)}</button>`
                    ).join('')}
                </div>
                <button type="button" class="btn ghost skip-reason-cancel">إلغاء</button>
            </div>`;
        document.body.appendChild(overlay);

        const close = () => overlay.remove();
        overlay.querySelector('.skip-reason-cancel').addEventListener('click', close);
        overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
        overlay.querySelectorAll('[data-reason]').forEach(btn => {
            btn.addEventListener('click', () => {
                close();
                this.handleSkip(btn.dataset.reason || '');
            });
        });
        overlay.querySelector('[data-reason]')?.focus();
    }

    handleSkip(reason) {
        if (!this.engine.skip(reason)) {
            this.showToast('يمكنك تخطي سؤالين فقط في كل اختبار.', true);
            return;
        }
        if (this.engine.currentIndex < QUESTIONS_PER_QUIZ - 1) {
            this.engine.next();
            this.updateUI();
            this.showToast(`تم تخطي السؤال (${this.engine.skipUsed}/${MAX_SKIPS})`);
        } else {
            this.updateUI();
            this.showResult();
        }
    }

    /* ----- النتيجة ----- */

    // restoring = true عند استعادة جلسة مكتملة: لا تحقق من الاكتمال ولا أنيميشن حساب
    async showResult(restoring = false) {
        if (this.isShowingResult) return;
        const engine = this.engine;

        if (!restoring && !engine.isComplete()) {
            const firstMissing = engine.answers.findIndex((answer, i) => answer === null && !engine.isSkipped(i));
            this.showToast('أجب عن الأسئلة المتبقية، أو استخدم التخطي.', true);
            if (firstMissing !== -1) {
                engine.currentIndex = firstMissing;
                QuizStorage.save(engine.getState());
                this.updateUI();
            }
            return;
        }

        this.isShowingResult = true;
        try {
            if (!restoring) await this.playCalculatingAnimation();

            const result = restoring && engine.result ? engine.result : engine.computeResult();
            engine.result = result;
            engine.completed = true;
            QuizStorage.save(engine.getState());

            // لا يُرسل عند استعادة جلسة محفوظة لتفادي تكرار التقرير
            if (!restoring) this.reportUnionAnalytics(result);

            const firstName = String(engine.userData?.name || '').trim().split(/\s+/)[0];
            if (this.resultPill) {
                this.resultPill.innerHTML = firstName
                    ? `<span class="name">${escapeHtml(firstName)}</span>، تعرّف على مسارك`
                    : 'تعرّف على مسارك';
            }
            if (this.confidenceLabel) {
                this.confidenceLabel.textContent = `مستوى الثقة: ${result.confidence.label} — ${result.confidence.message}`;
                this.confidenceLabel.dataset.level = result.confidence.level;
            }

            this.renderResultCards(result);
            this.renderDimensionsBars(engine.dimensionScores);
            this.renderSkipSummary();

            if (this.studyTipText) {
                this.studyTipText.textContent = STUDY_TIPS[result.first.direction] || DEFAULT_STUDY_TIP;
            }

            this.hideHero();
            this.introScreen?.classList.add('hidden');
            this.registrationScreen?.classList.add('hidden');
            this.setHeroVisible(false);
            this.bar.style.width = '100%';
            this.bar.parentElement?.classList.add('hidden');
            this.savedHint?.classList.add('hidden');
            this.quizContent.classList.remove('hidden');
            this.resultBox.classList.add('active');
            this.initResultMotion();
            this.questionsEl.classList.add('hidden');
            this.navActions.classList.add('hidden');
            this.titleBar.classList.add('hidden');

            this.showToast(firstName ? `نتيجتك جاهزة يا ${firstName}` : 'نتيجتك جاهزة');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } finally {
            this.isShowingResult = false;
        }
    }

    // Hook: سيُرسل لاحقاً رغبات الطالب (result) إلى لوحة تحكم اتحاد الطلبة
    reportUnionAnalytics(result) {
        // intentionally empty
    }

    // أقسام النتيجة تظهر وتختفي مع التمرير؛ out-up تحدد اتجاه الخروج (للأعلى أم للأسفل)
    initResultMotion() {
        if (this.resultObserver) this.resultObserver.disconnect();
        const items = this.resultBox?.querySelectorAll(
            '.result-head,.confidence,.direction-strip,.result-section,.other-specs,.scores-help,' +
            '.dimensions-bars,.study-tip,.kind-note,.edu-note,.result-note,.result-actions,.skip-summary');
        if (!items || !items.length || !('IntersectionObserver' in window)) return;
        this.resultObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                const el = entry.target;
                if (entry.isIntersecting) {
                    el.classList.remove('out-up');
                    el.classList.add('in');
                } else {
                    el.classList.remove('in');
                    el.classList.toggle('out-up', entry.boundingClientRect.top < 0);
                }
            });
        }, { threshold: 0.12 });
        items.forEach(el => { el.classList.add('result-anim'); this.resultObserver.observe(el); });
    }

    hideHero() {
        document.getElementById('top')?.classList.add('hidden');
        document.getElementById('journey')?.classList.add('hidden');
    }

    // easing تكعيبي (ease-out)؛ مع prefers-reduced-motion تُعرض القيمة النهائية مباشرة
    countUp(el, to, duration = 1100) {
        if (!el) return;
        if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) { el.textContent = to + '%'; return; }
        const start = performance.now();
        el.textContent = '0%';
        const tick = now => {
            const t = Math.min(1, (now - start) / duration);
            el.textContent = Math.round(to * (1 - Math.pow(1 - t, 3))) + '%';
            if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    }

    // البطاقة الرئيسية + شريط الاتجاهين + 3 تخصصات إضافية (الثاني في الاتجاه الأول، والاثنان في الثاني)
    renderResultCards(result) {
        const infoOf = direction => direction.info || DIRECTIONS[direction.direction];
        const best = result.first.top2[0];
        const pct = Math.round(best.score);

        if (this.bestCard) this.bestCard.dataset.specId = best.id;
        if (this.bestIcon) this.bestIcon.innerHTML = getIcon(best.icon, 40);
        if (this.bestName) this.bestName.textContent = best.name.replace(/\s*[(（].*$/, '');
        if (this.bestMeta) {
            const extra = (best.name.match(/[(（](.*)[)）]/) || [])[1];
            this.bestMeta.textContent = `${best.type} • ${best.duration}` + (extra ? ` • ${extra}` : '');
        }
        this.countUp(this.bestPct, pct);
        if (this.bestRing) {
            this.bestRing.style.strokeDashoffset = RING_CIRC;
            // إطاران متتاليان: يضمنان أن المتصفح رسم الحالة الابتدائية قبل بدء الانتقال
            requestAnimationFrame(() => requestAnimationFrame(() => {
                this.bestRing.style.strokeDashoffset = RING_CIRC * (1 - pct / 100);
            }));
        }

        if (this.directionStrip) {
            const chip = (label, direction) => `
                <span class="dir-chip">
                    <span class="dir-chip-icon">${getIcon(infoOf(direction).icon, 16)}</span>
                    <span class="dir-chip-label">${label}</span>
                    <b>${escapeHtml(infoOf(direction).name)}</b>
                </span>`;
            this.directionStrip.innerHTML = chip('اتجاهك الأول:', result.first) + chip('اتجاهك الثاني:', result.second);
        }

        if (this.otherSpecs) {
            const others = [
                { spec: result.first.top2[1], dir: result.first },
                { spec: result.second.top2[0], dir: result.second },
                { spec: result.second.top2[1], dir: result.second }
            ].filter(item => item.spec);

            this.otherSpecs.innerHTML = others.map(({ spec, dir }) => `
                <button class="spec-card" type="button" data-spec-id="${escapeHtml(spec.id)}">
                    <span class="spec-top">
                        <span class="spec-name">${escapeHtml(spec.name.replace(/\s*[(（].*$/, ""))}</span>
                        <span class="spec-ico">${getIcon(spec.icon, 22)}</span>
                    </span>
                    <span class="spec-pct">${Math.round(spec.score)}%</span>
                    <span class="spec-dir">${escapeHtml(infoOf(dir).name)}</span>
                    <span class="spark">${sparkline(spec.score, spec.id)}</span>
                </button>`).join('');
            this.otherSpecs.querySelectorAll('.spec-pct').forEach(el => this.countUp(el, parseInt(el.textContent, 10)));
            this.otherSpecs.querySelectorAll('.spec-card').forEach(card => {
                card.addEventListener('click', () => this.openMajorModal(card.dataset.specId));
            });
        }
    }

    bindMajorCards(container) {
        container.querySelectorAll('.major-card').forEach(card => {
            card.addEventListener('click', () => this.openMajorModal(card.dataset.specId));
        });
    }

    // مرتبة تنازلياً؛ العرض يبدأ من 0 ويُحرَّك بانتقال CSS
    renderDimensionsBars(scores) {
        if (!this.dimensionsBars || !scores) return;

        const rows = DIMENSIONS
            .map(dimension => ({ dimension, percent: Math.round((Number(scores[dimension.key]) || 0) * 10) }))
            .sort((a, b) => b.percent - a.percent);

        this.dimensionsBars.innerHTML = rows.map(({ dimension, percent }) => `
            <div class="dim-bar">
                <div class="dim-bar-label">
                    <span class="dim-bar-icon" aria-hidden="true">${getIcon(dimension.icon, 16)}</span>${escapeHtml(dimension.name)}
                </div>
                <div class="dim-bar-track" role="progressbar" aria-label="${escapeHtml(dimension.name)}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${percent}">
                    <div class="dim-bar-fill" data-width="${percent}"></div>
                </div>
                <div class="dim-bar-value">${percent}%</div>
            </div>`).join('');

        requestAnimationFrame(() => requestAnimationFrame(() => {
            this.dimensionsBars.querySelectorAll('.dim-bar-fill').forEach(fill => {
                fill.style.width = fill.dataset.width + '%';
                const valueEl = fill.closest('.dim-bar')?.querySelector('.dim-bar-value');
                if (valueEl) this.countUp(valueEl, Number(fill.dataset.width));
            });
        }));
    }

    // الصندوق يُنشأ ديناميكياً بعد سطر الثقة؛ يُخفى إن لم يُتخطَّ أي سؤال
    renderSkipSummary() {
        let box = document.getElementById('skipSummaryBox');
        if (!box) {
            box = document.createElement('div');
            box.id = 'skipSummaryBox';
            box.className = 'skip-summary';
            if (this.confidenceLabel?.parentNode) {
                this.confidenceLabel.parentNode.insertBefore(box, this.confidenceLabel.nextSibling);
            } else {
                this.resultBox?.querySelector('.resultBox')?.appendChild(box);
            }
        }

        const skips = this.engine.skipReasons;
        if (!skips.length) {
            box.classList.add('hidden');
            box.innerHTML = '';
            return;
        }

        const counts = {};
        skips.forEach(skip => {
            const reason = skip.reason || 'بدون سبب';
            counts[reason] = (counts[reason] || 0) + 1;
        });
        const lines = Object.entries(counts).map(([reason, n]) =>
            `<li><b>${escapeHtml(reason)}</b> — ${n} ${n === 1 ? 'سؤال' : 'أسئلة'}</li>`
        ).join('');

        box.classList.remove('hidden');
        box.innerHTML = `
            <div class="skip-summary-title">ملاحظات التخطي</div>
            <p class="skip-summary-help">تخطيت ${skips.length} من الأسئلة. هذا قد يجعل النتيجة أقل دقة قليلاً.</p>
            <ul class="skip-summary-list">${lines}</ul>`;
    }

    // الحساب الفعلي لحظي؛ هذه الشاشة تأخير مقصود (~2.8 ثانية) يمنح النتيجة وزناً
    playCalculatingAnimation() {
        return new Promise(resolve => {
            let overlay = document.getElementById('calcOverlay');
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.id = 'calcOverlay';
                overlay.className = 'calc-overlay';
                overlay.innerHTML = `
                  <div class="calc-card">
                    <div class="calc-label">لحظات قليلة</div>
                    <h2 class="calc-title">نجهّز نتيجتك</h2>
                    <div class="calc-progress-wrap">
                      <svg class="calc-progress-svg" viewBox="0 0 140 140">
                        <circle class="calc-progress-bg" cx="70" cy="70" r="60"/>
                        <circle class="calc-progress-bar" cx="70" cy="70" r="60" id="calcProgressBar"/>
                      </svg>
                      <div class="calc-progress-text">
                        <span id="calcProgressNum">0</span><span class="calc-progress-pct">%</span>
                      </div>
                    </div>
                    <ul class="calc-checklist">
                      <li class="calc-item" data-threshold="25">
                        <span class="calc-check"></span>
                        <span>نقرأ اختياراتك بعناية</span>
                      </li>
                      <li class="calc-item" data-threshold="50">
                        <span class="calc-check"></span>
                        <span>نفهم ما يميّزك</span>
                      </li>
                      <li class="calc-item" data-threshold="75">
                        <span class="calc-check"></span>
                        <span>نطابقه مع التخصصات الجامعية</span>
                      </li>
                      <li class="calc-item" data-threshold="100">
                        <span class="calc-check"></span>
                        <span>نرتّب لك أنسب الخيارات</span>
                      </li>
                    </ul>
                    <p class="calc-footnote">خطوة صغيرة نحو قرار مدروس.</p>
                  </div>`;
                document.body.appendChild(overlay);
            }

            const progressBar = overlay.querySelector('#calcProgressBar');
            const numEl = overlay.querySelector('#calcProgressNum');
            const items = overlay.querySelectorAll('.calc-item');

            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            this.questionsEl?.classList.add('hidden');
            this.navActions?.classList.add('hidden');
            this.titleBar?.classList.add('hidden');

            progressBar.style.strokeDashoffset = 377;
            numEl.textContent = '0';
            items.forEach(item => item.classList.remove('done'));

            const CALC_DURATION_MS = 2800;
            const CALC_RING_CIRC = 377;   // 2π × 60
            const start = performance.now();

            const tick = now => {
                const pct = Math.min(100, ((now - start) / CALC_DURATION_MS) * 100);
                progressBar.style.strokeDashoffset = CALC_RING_CIRC - (CALC_RING_CIRC * pct / 100);
                numEl.textContent = Math.round(pct);
                items.forEach(item => {
                    if (pct >= Number(item.dataset.threshold)) item.classList.add('done');
                });
                if (pct < 100) {
                    requestAnimationFrame(tick);
                } else {
                    setTimeout(() => {
                        overlay.classList.remove('active');
                        document.body.style.overflow = '';
                        resolve();
                    }, 400);
                }
            };
            requestAnimationFrame(tick);
        });
    }

    /* ----- نافذة التخصص ----- */

    openMajorModal(specId) {
        if (!this.majorModal) return;
        const spec = SPECIALIZATIONS.find(item => item.id === specId);
        if (!spec) return;

        const chips = items => items.map(item => `<span class="major-job">${escapeHtml(item)}</span>`).join('');

        this.majorModalTitle.innerHTML = `<span class="mm-ico">${getIcon(spec.icon, 22)}</span>${escapeHtml(spec.name)}`;
        this.majorModalSub.textContent = spec.type;
        this.majorModalSummary.textContent = spec.description;
        this.majorModalStudy.innerHTML =
            `<ul class="major-study-list">${spec.whatYouStudy.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`;
        this.majorModalDuration.textContent = spec.duration;
        this.majorModalUniversities.innerHTML = chips(spec.universities);
        this.majorModalJobs.innerHTML = chips(spec.careers);
        this.majorModalAdvice.textContent = spec.advice;

        this.injectAleppoUniversityData(specId);

        this.lastFocusedElement = document.activeElement;
        this.majorModal.classList.add('active');
        this.majorModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        this.majorModalClose?.focus();
    }

    // Hook: يُستدعى بعد تعبئة النافذة؛ سيُحقن فيه لاحقاً دليل كليات ومواد جامعة حلب
    injectAleppoUniversityData(specId) {
        // intentionally empty
    }

    closeMajorModal() {
        if (!this.majorModal) return;
        this.majorModal.classList.remove('active');
        this.majorModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        this.lastFocusedElement?.focus?.();
        this.lastFocusedElement = null;
    }
}

/* ---------- التصدير والمشاركة: ResultExporter ---------- */

// رابط المنصة المرمَّز في QR؛ الفارغ يعني استخدام رابط الصفحة الحالية
const PLATFORM_URL = '';

const SHARE_IMAGE = Object.freeze({
    width: 1080,
    height: 1700,
    scale: 2,
    fileName: 'masari-result.png',
    logos: Object.freeze({
        masari: 'assets/masari-logo.png',
        union: 'assets/union-logo-wide.png'
    }),
    fontFamily: 'system-ui, "Segoe UI", Tahoma, Arial, sans-serif',
    colors: Object.freeze({
        ink: '#16164a',
        primary: '#202080',
        accent: '#00D0F0',
        muted: '#6b7394',
        line: '#dfe5f5',
        soft: '#eef3ff',
        track: '#e3e8f5',
        card: '#ffffff'
    })
});

/**
 * يرسم بطاقة النتيجة على canvas بإحداثيات ثابتة (1080×1700 منطقية × scale للدقة).
 * التخطيط مكتوب يدوياً عمداً: لا اعتماد على DOM فلا تختلف الصورة بين الأجهزة والخطوط.
 */
class ResultExporter {
    constructor(ui) {
        this.ui = ui;
        this.shareBtn = document.getElementById('shareBtn');
        this.bindEvents();
    }

    bindEvents() {
        if (this.shareBtn) this.shareBtn.addEventListener('click', () => this.shareResult());
    }

    // null إن لم تُعرض نتيجة بعد
    getResult() {
        const engine = this.ui.engine;
        return engine.completed && engine.result ? engine.result : null;
    }

    loadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });
    }

    roundRect(ctx, x, y, w, h, r) {
        const radius = Math.min(r, w / 2, h / 2);
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.arcTo(x + w, y, x + w, y + h, radius);
        ctx.arcTo(x + w, y + h, x, y + h, radius);
        ctx.arcTo(x, y + h, x, y, radius);
        ctx.arcTo(x, y, x + w, y, radius);
        ctx.closePath();
    }

    // يلفّ النص على maxLines سطر كحد أقصى (الزائد يُقصّ بـ «…») ويُرجع Y التالي
    wrapText(ctx, text, x, y, maxWidth, lineHeight, maxLines = 3) {
        const words = String(text || '').trim().split(/\s+/).filter(Boolean);
        if (!words.length) return y;

        let lines = [];
        let line = '';
        for (const word of words) {
            const candidate = line ? `${line} ${word}` : word;
            if (line && ctx.measureText(candidate).width > maxWidth) {
                lines.push(line);
                line = word;
            } else {
                line = candidate;
            }
        }
        lines.push(line);

        if (lines.length > maxLines) {
            lines = lines.slice(0, maxLines);
            lines[maxLines - 1] += '…';
        }
        // كلمة منفردة أطول من العرض: تُقصّ حتى تتسع
        lines = lines.map(text => {
            let out = text;
            while (out.length > 1 && ctx.measureText(out).width > maxWidth) {
                out = out.slice(0, -2) + '…';
            }
            return out;
        });

        lines.forEach((text, i) => ctx.fillText(text, x, y + i * lineHeight));
        return y + lines.length * lineHeight;
    }

    async buildImage() {
        const result = this.getResult();
        if (!result) throw new Error('RESULT_NOT_READY');

        const { width: W, height: H, scale, colors: C } = SHARE_IMAGE;
        const font = (weight, size) => `${weight} ${size}px ${SHARE_IMAGE.fontFamily}`;
        const canvas = document.createElement('canvas');
        canvas.width = W * scale;
        canvas.height = H * scale;
        const ctx = canvas.getContext('2d');
        ctx.scale(scale, scale);
        ctx.direction = 'rtl';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'alphabetic';

        const cardShadow = on => {
            ctx.shadowColor = on ? 'rgba(32,32,128,.10)' : 'transparent';
            ctx.shadowBlur = on ? 20 : 0;
            ctx.shadowOffsetY = on ? 6 : 0;
        };

        const background = ctx.createLinearGradient(0, 0, 0, H);
        background.addColorStop(0, '#ffffff');
        background.addColorStop(0.55, '#f5f8ff');
        background.addColorStop(1, '#e9f0ff');
        ctx.fillStyle = background;
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = 'rgba(32,32,128,.05)';
        ctx.beginPath(); ctx.arc(90, 110, 160, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = 'rgba(0,208,240,.06)';
        ctx.beginPath(); ctx.arc(1000, 1400, 200, 0, Math.PI * 2); ctx.fill();

        // فشل تحميل الشعارات لا يمنع التصدير: تُترك الترويسة بلا شعار
        try {
            const [masariLogo, unionLogo] = (await Promise.allSettled([
                this.loadImage(SHARE_IMAGE.logos.masari),
                this.loadImage(SHARE_IMAGE.logos.union)
            ])).map(settled => (settled.status === 'fulfilled' ? settled.value : null));
            const drawLogo = (img, boxX, boxY, maxW, maxH, align) => {
                const ratio = Math.min(maxW / (img.width || 1), maxH / (img.height || 1));
                const w = (img.width || 1) * ratio;
                const h = (img.height || 1) * ratio;
                const x = align === 'right' ? boxX + maxW - w : boxX;
                ctx.drawImage(img, x, boxY + (maxH - h) / 2, w, h);
            };
            if (unionLogo) drawLogo(unionLogo, 56, 28, 280, 72, 'left');
            if (masariLogo) drawLogo(masariLogo, 760, 28, 240, 72, 'right');
        } catch (e) {
            console.warn('Share image: logos could not be loaded');
        }

        ctx.strokeStyle = C.line;
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(56, 120); ctx.lineTo(1024, 120); ctx.stroke();

        ctx.fillStyle = C.primary; ctx.font = font(800, 44);
        ctx.fillText('نتيجتك في مساري', 1024, 175);
        ctx.fillStyle = C.muted; ctx.font = font(600, 22);
        ctx.fillText('اكتشف اهتماماتك، واختر مستقبلك', 1024, 210);

        // بطاقة اتجاه: الوسم + الاسم + أفضل تخصصين
        const drawDirectionCard = (top, label, directionResult) => {
            const info = directionResult.info || DIRECTIONS[directionResult.direction];

            ctx.fillStyle = C.card;
            cardShadow(true);
            this.roundRect(ctx, 56, top, 968, 270, 24); ctx.fill();
            cardShadow(false);

            ctx.fillStyle = 'rgba(0,208,240,.16)';
            this.roundRect(ctx, 800, top + 18, 200, 38, 12); ctx.fill();
            ctx.fillStyle = C.primary; ctx.font = font(800, 20);
            ctx.fillText(label, 984, top + 44);

            ctx.fillStyle = C.ink; ctx.font = font(900, 34);
            this.wrapText(ctx, info.name, 1000, top + 100, 880, 40, 1);

            directionResult.top2.forEach((spec, i) => {
                const y = top + 126 + i * 68;
                ctx.fillStyle = C.soft;
                this.roundRect(ctx, 80, y, 920, 58, 16); ctx.fill();

                ctx.fillStyle = 'rgba(0,208,240,.22)';
                this.roundRect(ctx, 938, y + 12, 50, 34, 10); ctx.fill();
                ctx.fillStyle = C.primary; ctx.font = font(800, 20);
                ctx.textAlign = 'center';
                ctx.fillText(String(i + 1), 963, y + 36);
                ctx.textAlign = 'right';

                ctx.fillStyle = C.ink; ctx.font = font(700, 24);
                this.wrapText(ctx, spec.name, 920, y + 27, 620, 28, 1);
                ctx.fillStyle = C.muted; ctx.font = font(600, 16);
                ctx.fillText(`${spec.type} • ${spec.duration}`, 920, y + 48);

                ctx.fillStyle = C.primary; ctx.font = font(900, 26);
                ctx.textAlign = 'left';
                ctx.fillText(`${Math.round(spec.score)}%`, 104, y + 38);
                ctx.textAlign = 'right';
            });
        };
        drawDirectionCard(240, 'الاتجاه الأول', result.first);
        drawDirectionCard(530, 'الاتجاه الثاني', result.second);

        ctx.fillStyle = C.card;
        cardShadow(true);
        this.roundRect(ctx, 56, 820, 968, 140, 24); ctx.fill();
        cardShadow(false);
        ctx.fillStyle = C.primary; ctx.font = font(800, 28);
        ctx.fillText(`مستوى الثقة: ${result.confidence.label}`, 1000, 866);
        ctx.fillStyle = C.muted; ctx.font = font(600, 20);
        this.wrapText(ctx, result.confidence.message, 1000, 902, 910, 28, 2);

        ctx.fillStyle = C.ink; ctx.font = font(800, 28);
        ctx.fillText('ملفّك عبر الأبعاد السبعة', 1024, 1010);

        const rows = DIMENSIONS
            .map(dimension => ({
                dimension,
                percent: Math.round((Number(this.ui.engine.dimensionScores?.[dimension.key]) || 0) * 10)
            }))
            .sort((a, b) => b.percent - a.percent);

        const TRACK_X = 150, TRACK_W = 520;
        rows.forEach(({ dimension, percent }, i) => {
            const y = 1040 + i * 58;
            ctx.fillStyle = C.ink; ctx.font = font(700, 22);
            this.wrapText(ctx, dimension.name, 1024, y + 26, 330, 26, 1);

            ctx.fillStyle = C.track;
            this.roundRect(ctx, TRACK_X, y + 8, TRACK_W, 16, 8); ctx.fill();
            const fillW = Math.max(16, (TRACK_W * Math.min(percent, 100)) / 100);
            const gradient = ctx.createLinearGradient(TRACK_X, 0, TRACK_X + TRACK_W, 0);
            gradient.addColorStop(0, C.accent);
            gradient.addColorStop(1, C.primary);
            ctx.fillStyle = gradient;
            // الشريط يمتلئ من اليمين (اتجاه RTL)
            this.roundRect(ctx, TRACK_X + TRACK_W - fillW, y + 8, fillW, 16, 8); ctx.fill();

            ctx.fillStyle = C.primary; ctx.font = font(900, 22);
            ctx.textAlign = 'left';
            ctx.fillText(`${percent}%`, 56, y + 26);
            ctx.textAlign = 'right';
        });

        // الفوتر: QR (إن توفر رابط http/https) + دعوة قصيرة
        const platformUrl = PLATFORM_URL || this.currentPageUrl();
        const qr = platformUrl ? makeQR(platformUrl) : null;
        ctx.strokeStyle = C.line;
        ctx.beginPath(); ctx.moveTo(56, H - 170); ctx.lineTo(1024, H - 170); ctx.stroke();

        if (qr) {
            // quiet zone = 4 خلايا من كل جهة
            const cell = Math.max(2, Math.floor(148 / (qr.size + 8)));
            const box = cell * (qr.size + 8);
            const boxX = 56, boxY = H - 158;
            ctx.fillStyle = '#ffffff';
            cardShadow(true);
            this.roundRect(ctx, boxX, boxY, box, box, 16); ctx.fill();
            cardShadow(false);
            ctx.fillStyle = C.ink;
            for (let y = 0; y < qr.size; y++) {
                for (let x = 0; x < qr.size; x++) {
                    if (qr.modules[y][x]) ctx.fillRect(boxX + (x + 4) * cell, boxY + (y + 4) * cell, cell, cell);
                }
            }
        }
        ctx.textAlign = 'right';
        ctx.fillStyle = C.ink; ctx.font = font(800, 30);
        ctx.fillText('جرّب مساري بنفسك', 1024, H - 104);
        ctx.fillStyle = C.muted; ctx.font = font(600, 20);
        ctx.fillText(qr ? 'امسح الرمز للدخول إلى المنصة' : 'مساري • منصة استرشادية', 1024, H - 66);
        if (qr) { ctx.font = font(700, 16); ctx.fillText('مساري • منصة استرشادية', 1024, H - 36); }

        return new Promise((resolve, reject) => {
            canvas.toBlob(blob => (blob ? resolve(blob) : reject(new Error('EMPTY_IMAGE'))), 'image/png', 1);
        });
    }

    // فارغ عند الفتح محلياً (file://) لأن QR لرابط محلي بلا قيمة
    currentPageUrl() {
        try {
            const { protocol, origin, pathname } = window.location;
            if (!/^https?:$/.test(protocol)) return '';
            return origin + pathname.replace(/index\.html$/i, '');
        } catch (e) { return ''; }
    }

    downloadBlob(blob, fileName) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        link.remove();
        setTimeout(() => URL.revokeObjectURL(url), 10000);
    }

    // الأولوية لـ Web Share API (جوال)، وأي فشل غير الإلغاء يتراجع إلى التحميل المباشر
    async shareResult() {
        if (!this.getResult()) {
            this.ui.showToast('اعرض النتيجة أولاً ثم شاركها.', true);
            return;
        }
        if (this.shareBtn.disabled) return;

        const originalText = this.shareBtn.textContent;
        this.shareBtn.disabled = true;
        this.shareBtn.textContent = 'جارٍ التجهيز...';

        try {
            const blob = await this.buildImage();
            const file = new File([blob], SHARE_IMAGE.fileName, { type: 'image/png' });

            if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
                try {
                    await navigator.share({ title: 'نتيجتي في مساري', files: [file] });
                    this.ui.showToast('تمت المشاركة بنجاح');
                    return;
                } catch (shareError) {
                    if (shareError && shareError.name === 'AbortError') return;
                }
            }
            this.downloadBlob(blob, SHARE_IMAGE.fileName);
            this.ui.showToast('تم تحميل الصورة');
        } catch (error) {
            this.ui.showToast('تعذر تجهيز الصورة.', true);
        } finally {
            this.shareBtn.disabled = false;
            this.shareBtn.textContent = originalText;
        }
    }
}

/* ---------- الملاحظات: NotesFeedback ---------- */

const NOTES_FORM = Object.freeze({
    url: 'https://docs.google.com/forms/d/e/1FAIpQLScKu23LHukvNt_aT_XwvRKkMR9Y-JK5zeGbkFmwzAH865d1cA/formResponse',
    entry: 'entry.1916202014'
});
const NOTE_MIN_LENGTH = 3;

class NotesFeedback {
    constructor(ui) {
        this.ui = ui;
        this.modal = document.getElementById('noteModal');
        this.textarea = document.getElementById('noteText');
        this.notesBtn = document.getElementById('notesBtn');
        this.closeBtn = document.getElementById('noteModalClose');
        this.cancelBtn = document.getElementById('noteCancelBtn');
        this.submitBtn = document.getElementById('noteSubmitBtn');
        this.submitting = false;
        this.bindEvents();
    }

    bindEvents() {
        if (this.notesBtn) this.notesBtn.addEventListener('click', () => this.openNoteModal());
        if (this.closeBtn) this.closeBtn.addEventListener('click', () => this.closeNoteModal());
        if (this.cancelBtn) this.cancelBtn.addEventListener('click', () => this.closeNoteModal());
        if (this.submitBtn) this.submitBtn.addEventListener('click', () => this.submitNote());
        if (this.modal) {
            this.modal.addEventListener('click', event => {
                if (event.target === this.modal) this.closeNoteModal();
            });
        }
    }

    openNoteModal() {
        if (!this.modal) return;
        this.lastFocusedElement = document.activeElement;
        this.modal.classList.add('active');
        this.modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        if (this.textarea) setTimeout(() => this.textarea.focus(), 50);
    }

    closeNoteModal() {
        if (!this.modal) return;
        this.modal.classList.remove('active');
        this.modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        this.lastFocusedElement?.focus?.();
        this.lastFocusedElement = null;
    }

    async submitNote() {
        if (this.submitting) return;

        const text = (this.textarea?.value || '').trim();
        if (text.length < NOTE_MIN_LENGTH) {
            this.ui.showToast(`اكتب ملاحظة من ${NOTE_MIN_LENGTH} أحرف على الأقل.`, true);
            this.textarea?.focus();
            return;
        }

        this.submitting = true;
        const originalLabel = this.submitBtn?.textContent;
        if (this.submitBtn) {
            this.submitBtn.disabled = true;
            this.submitBtn.textContent = 'جارٍ الإرسال...';
        }

        // postGoogleForm لا ترمي أخطاء الشبكة (وضع no-cors لا يكشف نتيجة الإرسال أصلاً)
        await postGoogleForm(NOTES_FORM.url, { [NOTES_FORM.entry]: text });

        this.submitting = false;
        if (this.submitBtn) {
            this.submitBtn.disabled = false;
            this.submitBtn.textContent = originalLabel || 'إرسال';
        }
        if (this.textarea) this.textarea.value = '';
        this.closeNoteModal();
        this.ui.showToast('تم إرسال ملاحظتك');
    }
}

/* ---------- أدوات النظام: AppUtilities ---------- */

const THEME_KEY = 'masari_theme';
const VISIT_CACHE_KEY = 'masari_visit_cache';
const VISIT_COUNTER_URL = 'https://counterapi.com/api/masari-demo-2026/view/total-visits';

class AppUtilities {
    // الأولوية لاختيار الطالب المحفوظ، ثم تفضيل النظام
    static initTheme() {
        const themeBtn = document.getElementById('themeBtn');
        if (!themeBtn) return;

        // الشمس والقمر عنصران ثابتان؛ المقبض (CSS) ينزلق تحت الفعّال بانتقال
        themeBtn.innerHTML =
            `<span class="theme-sun">${getIcon('sun', 16)}</span><span class="theme-moon">${getIcon('moon', 16)}</span>`;
        const sun = themeBtn.querySelector('.theme-sun');
        const moon = themeBtn.querySelector('.theme-moon');
        let animTimer = null;

        // صنف theme-anim مؤقت يفعّل انتقال الألوان على كامل الصفحة أثناء التبديل فقط
        const applyTheme = (dark, animate = false) => {
            const root = document.documentElement;
            if (animate) {
                root.classList.add('theme-anim');
                clearTimeout(animTimer);
                animTimer = setTimeout(() => root.classList.remove('theme-anim'), 650);
            }
            root.classList.toggle('dark', dark);
            themeBtn.setAttribute('aria-pressed', String(dark));
            sun.classList.toggle('active', !dark);
            moon.classList.toggle('active', dark);
        };

        themeBtn.addEventListener('click', () => {
            const dark = !document.documentElement.classList.contains('dark');
            applyTheme(dark, true);
            // لا يُحفظ إلا الاختيار الصريح، فيبقى اتباع تفضيل النظام حيّاً لمن لم يختر
            try { localStorage.setItem(THEME_KEY, dark ? 'dark' : 'light'); } catch (e) {}
        });

        let saved = null;
        try { saved = localStorage.getItem(THEME_KEY); } catch (e) {}
        const prefersDark = typeof window.matchMedia === 'function' &&
            window.matchMedia('(prefers-color-scheme: dark)').matches;
        applyTheme(saved ? saved === 'dark' : prefersDark);
    }

    static initMotion() {
        const nav = document.querySelector('.nav');
        const onScroll = () => nav?.classList.toggle('scrolled', window.scrollY > 8);
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();

        const targets = document.querySelectorAll('.journey, .about-card, .union-about, .site-footer');
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) { entry.target.classList.add('in'); observer.unobserve(entry.target); }
                });
            }, { threshold: 0.12 });
            targets.forEach(el => { el.classList.add('reveal'); observer.observe(el); });
        }

        // تأثير parallax للرسمة عبر متغيرات CSS؛ على الأجهزة التي تدعم hover فقط
        const hero = document.querySelector('.hero');
        if (hero && window.matchMedia?.('(hover: hover)').matches) {
            hero.addEventListener('pointermove', e => {
                const rect = hero.getBoundingClientRect();
                hero.style.setProperty('--px', ((e.clientX - rect.left) / rect.width - 0.5).toFixed(3));
                hero.style.setProperty('--py', ((e.clientY - rect.top) / rect.height - 0.5).toFixed(3));
            });
        }
    }

    // كل تحميل للصفحة يُحتسب زيارة؛ عند الفشل تُعرض آخر قيمة محفوظة أو «—»
    static async initCounter() {
        const el = document.getElementById('visitCount');
        if (!el) return;
        const show = value => { el.textContent = Number(value).toLocaleString('ar-EG'); };
        let cached = null;
        try { cached = localStorage.getItem(VISIT_CACHE_KEY); } catch (e) {}

        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 6000);
        try {
            const response = await fetch(VISIT_COUNTER_URL, { cache: 'no-store', signal: controller.signal });
            if (!response.ok) throw new Error('COUNTER_HTTP_' + response.status);
            const data = await response.json();
            const value = Number(data && data.value);
            if (!Number.isFinite(value)) throw new Error('COUNTER_BAD_PAYLOAD');
            show(value);
            try { localStorage.setItem(VISIT_CACHE_KEY, String(value)); } catch (e) {}
        } catch (error) {
            if (cached && Number.isFinite(Number(cached))) show(cached); else el.textContent = '—';
        } finally {
            clearTimeout(timer);
        }
    }
}

/* ---------- نقطة الانطلاق ---------- */

document.addEventListener('DOMContentLoaded', () => {
    renderIcons();
    injectGlowDefs();
    AppUtilities.initTheme();
    AppUtilities.initMotion();
    AppUtilities.initCounter();
    const engine = new QuizEngine();
    const ui = new QuizUI(engine);
    new ResultExporter(ui);
    new NotesFeedback(ui);
    new MasariChat(engine);
});
