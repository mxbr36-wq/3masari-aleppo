import { TRACKS, QUESTION_BANK, MAJOR_DETAILS, STUDY_TIPS } from './data.js?v=20260924-2';



const QUESTION_COUNT = 12;



// 1. طبقة التخزين (Storage)

class QuizStorage {

    static save(state) {

        try { localStorage.setItem('masari_state', JSON.stringify(state)); } catch(e) {}

    }

    static load() {

        try { return JSON.parse(localStorage.getItem('masari_state')); } catch(e) { return null; }

    }

    static clear() {

        try { localStorage.removeItem('masari_state'); } catch(e) {}

    }

}



// 2. طبقة المنطق والبيانات (Engine / Model)

class QuizEngine {

    constructor() {

        this.activeQuestions = [];

        this.answers = Array(QUESTION_COUNT).fill("");

        this.currentIndex = 0;

        this.skipUsed = 0;

        this.userData = { name: "", phone: "", age: "", academicBranch: "" };

        this.completed = false;

        this.result = null;

    }



    setUserData(name, phone, age, academicBranch) {

        this.userData = { name, phone, age, academicBranch };

    }



    shuffle(arr) {

        const a = [...arr];

        for (let i = a.length - 1; i > 0; i--) {

            const j = Math.floor(Math.random() * (i + 1));

            [a[i], a[j]] = [a[j], a[i]];

        }

        return a;

    }



    generateQuestions() {

        const candidates = this.shuffle(QUESTION_BANK);

        const selected = [];

        const covered = new Set();



        for (const q of candidates) {

            const tracks = q[1].map(x => x[0]);

            if (tracks.some(t => !covered.has(t))) {

                selected.push(q);

                tracks.forEach(t => covered.add(t));

            }

            if (selected.length >= QUESTION_COUNT) break;

        }



        for (const q of candidates) {

            if (selected.length >= QUESTION_COUNT) break;

            if (!selected.includes(q)) selected.push(q);

        }



        this.activeQuestions = this.shuffle(selected.slice(0, QUESTION_COUNT)).map(q => ({

            text: q[0],

            options: this.shuffle(q[1])

        }));



        this.answers = Array(QUESTION_COUNT).fill("");

        this.currentIndex = 0;

        this.skipUsed = 0;

    }



    setAnswer(val) {

        this.answers[this.currentIndex] = val;

        QuizStorage.save(this.getState());

    }



    skip() {

        if (this.skipUsed >= 2) return false;

        this.answers[this.currentIndex] = "";

        this.skipUsed++;

        QuizStorage.save(this.getState());

        return true;

    }



    next() {

        if (this.currentIndex < QUESTION_COUNT - 1) {

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

        const answered = this.answers.filter(a => a).length;

        return answered >= (QUESTION_COUNT - this.skipUsed);

    }



    getState() {

        return {

            activeQuestions: this.activeQuestions,

            answers: this.answers,

            currentIndex: this.currentIndex,

            skipUsed: this.skipUsed,

            userData: this.userData,

            completed: this.completed || false,

            result: this.result || null

        };

    }



    loadState(state) {

        this.activeQuestions = state.activeQuestions;

        this.answers = state.answers;

        this.currentIndex = state.currentIndex;

        this.skipUsed = state.skipUsed;

        this.userData = state.userData || { name: "", phone: "", age: "", academicBranch: "" };

        this.completed = state.completed || false;

        this.result = state.result || null;

    }



    computeResult() {

        const keys = Object.keys(TRACKS);

        const scores = Object.fromEntries(keys.map(k => [k, 0]));

        const opportunities = Object.fromEntries(keys.map(k => [k, 0]));



        this.activeQuestions.forEach(q => {

            q.options.forEach(o => {

                if (opportunities[o[0]] !== undefined) opportunities[o[0]]++;

            });

        });



        this.answers.forEach(a => {

            if (a && scores[a] !== undefined) scores[a]++;

        });



        const percentages = Object.fromEntries(keys.map(k => [

            k, opportunities[k] ? Math.round(18 + ((scores[k] / opportunities[k]) * 100) * 0.55) : 18

        ]));



        const ranking = this.shuffle(keys).sort((a, b) => percentages[b] - percentages[a]);

        const gap = percentages[ranking[0]] - (percentages[ranking[1]] || 0);



        let confidence = "نتيجتك متقاربة بين أكثر من مسار — يُفضَّل أن تستكشف التخصصات في أكثر من مجال.";

        if (gap >= 18) confidence = "نتيجتك واضحة نسبياً — المسار الظاهر يناسب اهتماماتك بقوة.";

        else if (gap >= 10) confidence = "نتيجتك واضحة نسبيًا — يظهر فيها تفوق لمسار مع وجود تداخل بسيط مع مسار آخر.";



        return { best: ranking[0], percentages, ranking, confidence };

    }

}



// 3. طبقة الواجهة (UI / View)

class QuizUI {

    constructor(engine) {

        this.engine = engine;

        this.cacheDOM();

        this.bindEvents();

        this.checkSavedProgress();

    }



    cacheDOM() {

        // الشاشات

        this.introScreen = document.getElementById('introScreen');

        this.userInfoScreen = document.getElementById('userInfoScreen');

        this.choiceScreen = document.getElementById('choiceScreen');

        this.quizContent = document.getElementById('quizContent');

        this.resultBox = document.getElementById('resultBox');



        // عناصر إدخال البيانات

        this.fullNameInput = document.getElementById('fullName');

        this.mobileInput = document.getElementById('mobileNumber');

        this.ageInput = document.getElementById('age');

        this.academicBranchInput = document.getElementById('academicBranch');

        this.studentUnionInputs = document.querySelectorAll('input[name="studentUnion"]');

        this.startQuizFormBtn = document.getElementById('startQuizFormBtn');

        this.confirmChoiceBtn = document.getElementById('confirmChoiceBtn');

        this.choicePhoneInput = document.getElementById('choicePhone');

        this.choiceBranchInput = document.getElementById('choiceBranch');

        this.submitChoiceBtn = document.getElementById('submitChoiceBtn');



        // عناصر التحكم والأسئلة

        this.questionsEl = document.getElementById('questions');

        this.bar = document.getElementById('bar');

        this.qCounter = document.getElementById('qCounter');

        this.savedHint = document.getElementById('savedHint');

        this.toastWrap = document.getElementById('toastWrap');



        // الأزرار

        this.startBtn = document.getElementById('startBtn');

        this.nextBtn = document.getElementById('nextBtn');

        this.backBtn = document.getElementById('backBtn');

        this.skipBtn = document.getElementById('skipBtn');

        this.restartBtn = document.getElementById('restartBtn');

        this.navActions = document.getElementById('navActions');

        this.titleBar = document.getElementById('titleBar');



        // عناصر النتيجة

        this.resultPill = document.querySelector('.resultBox .pill');

        this.topResult = document.getElementById('topResult');

        this.typeLabel = document.getElementById('typeLabel');

        this.confidenceLabel = document.getElementById('confidenceLabel');

        this.majorsList = document.getElementById('majorsList');

        this.adviceText = document.getElementById('adviceText');

        this.studyTipText = document.getElementById('studyTipText');

        this.scoresList = document.getElementById('scoresList');

    }



    bindEvents() {

        this.startBtn.addEventListener('click', () => {

            this.introScreen.classList.add('hidden');

            this.userInfoScreen.classList.remove('hidden');

        });



        if (this.confirmChoiceBtn) {

            this.confirmChoiceBtn.addEventListener('click', () => {

                this.introScreen.classList.add('hidden');

                this.choiceScreen.classList.remove('hidden');

                this.choicePhoneInput?.focus();

            });

        }



        if (this.submitChoiceBtn) {

            this.submitChoiceBtn.addEventListener('click', () => {

                const phone = this.choicePhoneInput.value.trim();

                const branch = this.choiceBranchInput.value.trim();



                if (phone.length < 10) {

                    this.showToast('يرجى إدخال رقم هاتف صحيح', true);

                    return;

                }



                if (branch.length < 2) {

                    this.showToast('يرجى إدخال الفرع الأكاديمي الذي ترغب في الالتحاق به', true);

                    return;

                }



                const payload = new URLSearchParams();

                payload.append('entry.447393548', phone);

                payload.append('entry.849275435', branch);



                const formUrl =

                    'https://docs.google.com/forms/d/e/1FAIpQLSczXBeKu-d9DOt1E7Y6NDgv74G24TlH_0shVgFQEiUH3ePgNg/formResponse';



                fetch(formUrl, {

                    method: 'POST',

                    mode: 'no-cors',

                    headers: {

                        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'

                    },

                    body: payload.toString()

                }).catch(error => {

                    console.error('Google Form error:', error);

                });



                this.showToast('تم تأكيد اختيارك بنجاح ✓');

                this.choiceScreen.classList.add('hidden');

                this.introScreen.classList.remove('hidden');

                this.choicePhoneInput.value = '';

                this.choiceBranchInput.value = '';

            });

        }



        if (this.startQuizFormBtn) {

            this.startQuizFormBtn.addEventListener('click', () => {

                const name = this.fullNameInput.value.trim();

                const phone = this.mobileInput.value.trim();

                const age = this.ageInput.value.trim();

                const academicBranch = this.academicBranchInput.value.trim();

                const unionChoice = [...this.studentUnionInputs].find(input => input.checked)?.value || '';



                // 1. التحقق من صحة المدخلات

                if (name.length < 3) {

                    this.showToast('يرجى إدخال الاسم الكامل', true);

                    return;

                }

                if (phone.length < 10) {

                    this.showToast('يرجى إدخال رقم موبايل صحيح', true);

                    return;

                }

                if (!age || Number(age) < 10 || Number(age) > 100) {

                    this.showToast('يرجى إدخال عمر صحيح', true);

                    return;

                }

                if (!unionChoice) {

                    this.showToast('يرجى اختيار نعم أو لا بخصوص الانضمام إلى اتحاد طلبة سورية', true);

                    return;

                }



                // ============================================================

                // ===== إرسال البيانات إلى النموذجين معاً (الفريق + نموذجك) =====

                // ============================================================



                // ===== (1) إرسال للفريق - النموذج القديم =====

                const teamPayload = new URLSearchParams();

                teamPayload.append('entry.1107585805', name);

                teamPayload.append('entry.124913972', phone);

                teamPayload.append('entry.1983079251', age);

                teamPayload.append('entry.1746227930', unionChoice);

                if (academicBranch) {

                    teamPayload.append('entry.234839250', academicBranch);

                }



                const teamFormUrl =

                    'https://docs.google.com/forms/d/e/1FAIpQLSdNUYMpALSi4m2sdl99a1IiTPPerAvXGutEcJNnaWrAsYWHKw/formResponse';



                fetch(teamFormUrl, {

                    method: 'POST',

                    mode: 'no-cors',

                    headers: {

                        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'

                    },

                    body: teamPayload.toString()

                }).catch(error => {

                    console.error('Team Form error:', error);

                });



                // ===== (2) إرسال لك - النموذج الجديد =====

                const myPayload = new URLSearchParams();

                myPayload.append('entry.2039066148', name);

                myPayload.append('entry.580084176', phone);

                myPayload.append('entry.1343202930', age);

                myPayload.append('entry.948853225', unionChoice);

                if (academicBranch) {

                    myPayload.append('entry.887557934', academicBranch);

                }



                const myFormUrl =

                    'https://docs.google.com/forms/d/e/1FAIpQLSf3VwYRzvAdiG-ImH9ldW16-qvEc5wa_yl3bDzt1ZDyHLLZmA/formResponse';



                fetch(myFormUrl, {

                    method: 'POST',

                    mode: 'no-cors',

                    headers: {

                        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'

                    },

                    body: myPayload.toString()

                }).catch(error => {

                    console.error('My Form error:', error);

                });



                // ============================================================

                // ===== نهاية الإرسال المزدوج =====

                // ============================================================



                // حفظ البيانات محلياً وبدء الاختبار فوراً

                this.engine.setUserData(name, phone, age, academicBranch);

                this.startQuiz(false);

            });

        }



        this.restartBtn.addEventListener('click', () => this.restartQuiz());



        this.nextBtn.addEventListener('click', () => {

            if (this.engine.currentIndex < QUESTION_COUNT - 1) {

                if (!this.engine.answers[this.engine.currentIndex]) {

                    this.showToast("اختر إجابة أولاً، أو اضغط «تخطي».", true);

                    return;

                }

                this.engine.next();

                this.updateUI();

            } else {

                this.showResult();

            }

        });



        this.backBtn.addEventListener('click', () => {

            if (this.engine.prev()) this.updateUI();

        });



        this.skipBtn.addEventListener('click', () => {

            if (this.engine.answers[this.engine.currentIndex]) return;

            if (this.engine.skip()) {

                if (this.engine.currentIndex < QUESTION_COUNT - 1) {

                    this.engine.next();

                    this.updateUI();

                    this.showToast(`تم تخطي السؤال (${this.engine.skipUsed}/2)`);

                } else {

                    this.showResult();

                }

            } else {

                this.showToast("يمكنك تخطي سؤالين فقط في كل اختبار.", true);

            }

        });

    }



    checkSavedProgress() {

        const savedState = QuizStorage.load();



        if (savedState && savedState.activeQuestions && savedState.activeQuestions.length > 0) {

            this.engine.loadState(savedState);



            if (savedState.completed && savedState.result) {

                this.showResult(true);

            } else {

                this.showToast("تم استرجاع تقدمك السابق ✓");

                this.transitionToQuiz();

            }

        } else {

            QuizStorage.clear();

        }

    }



    startQuiz(forceNew = false) {

        if (forceNew) QuizStorage.clear();

        this.engine.generateQuestions();



        QuizStorage.save(this.engine.getState());



        this.transitionToQuiz();

        if (!forceNew) this.showToast("يلا نبلّش ✨");

    }



    restartQuiz() {

        QuizStorage.clear();



        this.engine.activeQuestions = [];

        this.engine.answers = Array(QUESTION_COUNT).fill("");

        this.engine.currentIndex = 0;

        this.engine.skipUsed = 0;

        this.engine.userData = {

            name: "",

            phone: "",

            age: "",

            academicBranch: ""

        };

        this.engine.completed = false;

        this.engine.result = null;



        const homeUrl = window.location.pathname + window.location.search;

        window.location.replace(homeUrl);

    }



    transitionToQuiz() {

        if (this.introScreen) this.introScreen.classList.add('hidden');



        const userScreen = document.getElementById('userInfoScreen');

        if (userScreen) userScreen.classList.add('hidden');



        this.resultBox.classList.remove('active');

        this.quizContent.classList.remove('hidden');

        this.questionsEl.classList.remove('hidden');

        this.navActions.classList.remove('hidden');

        this.titleBar.classList.remove('hidden');



        this.renderQuestions();

        this.updateUI();

        window.scrollTo({ top: 0, behavior: "smooth" });

    }



    renderQuestions() {

        this.questionsEl.innerHTML = this.engine.activeQuestions.map((q, i) => `

            <div class="q" data-q="${i}">

                <h4>${q.text}</h4>

                <div class="options">

                    ${q.options.map(o => `<button class="opt" type="button" data-val="${o[0]}">${o[1]}</button>`).join('')}

                </div>

            </div>

        `).join('');



        this.questionsEl.querySelectorAll('.opt').forEach(opt => {

            opt.addEventListener('click', (e) => {

                this.engine.setAnswer(e.target.dataset.val);

                this.flashSaved();

                this.updateUI();

            });

        });

    }



    updateUI() {

        const qEls = [...this.questionsEl.querySelectorAll('.q')];

        qEls.forEach((el, i) => el.classList.toggle('active', i === this.engine.currentIndex));



        this.bar.style.width = ((this.engine.currentIndex / QUESTION_COUNT) * 100) + "%";

        this.qCounter.textContent = `السؤال ${this.engine.currentIndex + 1} من ${QUESTION_COUNT}`;



        this.backBtn.disabled = this.engine.currentIndex === 0;

        this.nextBtn.textContent = this.engine.currentIndex === QUESTION_COUNT - 1 ? "اعرض نتيجتي" : "التالي";

        this.skipBtn.disabled = this.engine.skipUsed >= 2 || !!this.engine.answers[this.engine.currentIndex];



        const currentQ = qEls[this.engine.currentIndex];

        if (!currentQ) return;



        const selectedVal = this.engine.answers[this.engine.currentIndex];

        currentQ.querySelectorAll('.opt').forEach(opt => {

            const isSelected = opt.dataset.val === selectedVal;

            opt.classList.toggle('selected', isSelected);

            opt.setAttribute('aria-pressed', isSelected ? 'true' : 'false');

        });

    }



    flashSaved() {

        if (!this.savedHint) return;

        this.savedHint.classList.add("show");

        clearTimeout(this.flashTimer);

        this.flashTimer = setTimeout(() => this.savedHint.classList.remove("show"), 1600);

    }



    showToast(msg, isError = false) {

        const el = document.createElement("div");

        el.className = "toast" + (isError ? " error" : "");

        el.textContent = msg;

        this.toastWrap.appendChild(el);

        setTimeout(() => { el.style.opacity = "0"; setTimeout(() => el.remove(), 300); }, 2800);

    }



    showResult(restoring = false) {

        if (!restoring && !this.engine.isComplete()) {

            this.showToast("أجب عن الأسئلة المتبقية، أو استخدم التخطي.", true);

            return;

        }



        const result = restoring && this.engine.result

            ? this.engine.result

            : this.engine.computeResult();



        this.engine.completed = true;

        this.engine.result = result;

        QuizStorage.save(this.engine.getState());



        if (this.introScreen) this.introScreen.classList.add('hidden');

        if