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
        // أزلنا الحفظ من هنا لأن الأسئلة لم يتم توليدها بعد!
    }

    shuffle(arr) {
        const a = [...arr];
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    // توليد 12 سؤال عشوائي
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
        
        // استكمال الأسئلة إذا لم تصل لـ 12
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
        
        let confidence = "نتيجتك متقاربة بين أكثر من مسار — يُفضَّل أن تستكشف التخصصات في أكثر من مجال.";
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
        this.choiceScreen = document.getElementById('choiceScreen'); // جديد
        this.quizContent = document.getElementById('quizContent');
        this.resultBox = document.getElementById('resultBox');

        // عناصر إدخال البيانات (جديد)
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
        this.resultPill = document.querySelector('.resultBox .pill'); // أضف هذا السطر هنا
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

        // الزر الجديد للمتابعة بعد إدخال البيانات
        if(this.startQuizFormBtn) {
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
                // الفرع الأكاديمي اختياري:
                // إذا أدخله الطالب نرسله إلى Google Form،
                // وإذا تركه فارغاً نكمل الاختبار بشكل طبيعي.

                // 2. تجهيز البيانات وإرفاقها بمعرفات Google Form
                const payload = new URLSearchParams();

                payload.append('entry.1107585805', name);
                payload.append('entry.124913972', phone);
                payload.append('entry.1983079251', age);
                payload.append('entry.1746227930', unionChoice);

                if (academicBranch) {
                    payload.append('entry.234839250', academicBranch);
                }

                const formUrl =
                    'https://docs.google.com/forms/d/e/1FAIpQLSdNUYMpALSi4m2sdl99a1IiTPPerAvXGutEcJNnaWrAsYWHKw/formResponse';

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

        // استرجاع الجلسة حتى بعد Refresh أو إغلاق الصفحة.
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

        // حفظ الحالة الآن بعد أن أصبحت الأسئلة وبيانات المستخدم جاهزة
        QuizStorage.save(this.engine.getState());

        this.transitionToQuiz();
        if (!forceNew) this.showToast("يلا نبلّش ✨");
    }

    restartQuiz() {
        // امسح كل حالة الاختبار أولاً حتى لا يعاد فتح النتيجة أو الأسئلة القديمة.
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

        // إعادة تحميل الصفحة هي الضمان أن التطبيق يرجع فعلياً إلى الـ Home
        // وليس فقط يبدّل الـ classes داخل الـ DOM.
        const homeUrl = window.location.pathname + window.location.search;
        window.location.replace(homeUrl);
    }

    transitionToQuiz() {
        // 1. إخفاء شاشة البداية
        if (this.introScreen) this.introScreen.classList.add('hidden');
        
        // 2. إخفاء شاشة معلومات التسجيل (الحل الجذري للبغ)
        const userScreen = document.getElementById('userInfoScreen');
        if (userScreen) userScreen.classList.add('hidden'); 
        
        // 3. إظهار شاشة الاختبار
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

        // لا نمسح الجلسة عند ظهور النتيجة.
        // تبقى محفوظة حتى يضغط المستخدم «ابدأ من جديد».
        this.engine.completed = true;
        this.engine.result = result;
        QuizStorage.save(this.engine.getState());

        if (this.introScreen) this.introScreen.classList.add('hidden');
        if (this.userInfoScreen) this.userInfoScreen.classList.add('hidden');
        if (this.choiceScreen) this.choiceScreen.classList.add('hidden');

        const bestTrack = TRACKS[result.best];

        // 1. استخراج الاسم الأول (إذا كان موجوداً)
        let firstName = "";
        if (this.engine.userData && this.engine.userData.name) {
            firstName = this.engine.userData.name.trim().split(' ')[0];
        }

        // 2. تحديث نص الفقاعة العلوية (Pill)
        if (this.resultPill && firstName) {
            this.resultPill.textContent = `🎉 نتيجتك جاهزة يا ${firstName}`;
        }

        this.topResult.textContent = bestTrack.title;
        this.typeLabel.textContent = bestTrack.type;
        this.confidenceLabel.textContent = result.confidence;
        this.adviceText.textContent = bestTrack.advice;
        this.studyTipText.textContent = STUDY_TIPS[result.best] || STUDY_TIPS.default;

        this.renderScores(result);
        this.renderMajors(bestTrack);

        this.bar.style.width = "100%";
        this.quizContent.classList.remove("hidden");
        this.resultBox.classList.add("active");
        this.questionsEl.classList.add("hidden");
        this.navActions.classList.add("hidden");
        this.titleBar.classList.add("hidden");
        
        // 3. تحديث إشعار الـ Toast السفلي
        if (firstName) {
            this.showToast(`نتيجتك جاهزة يا ${firstName} 🎉`);
        } else {
            this.showToast("نتيجتك جاهزة 🎉");
        }
        
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    renderScores(result) {
        this.scoresList.innerHTML = result.ranking.map(k => `
            <div class="score-row">
                <div class="score-head">
                    <span class="score-name">${TRACKS[k].title}</span>
                    <span class="score-pct">${result.percentages[k]}%</span>
                </div>
                <div class="score-track" aria-hidden="true">
                    <div class="score-fill" style="width:${result.percentages[k]}%"></div>
                </div>
            </div>
        `).join("");
    }

    renderMajors(track) {
        const allMajors = [
            ...(track.majors.scientific || []),
            ...(track.majors.literary || [])
        ];

        const uniqueMajors = [
            ...new Map(allMajors.map(item => [item.name, item])).values()
        ];

        const suggested = this.engine.shuffle(uniqueMajors).slice(0, 4);

        this.majorsList.innerHTML = suggested.map((m) => `
            <button class="major" type="button">
                <div>
                    <div class="major-name">${m.name}</div>
                    <div class="major-meta">${m.kind} · اضغط للتفاصيل</div>
                </div>
            </button>
        `).join("");

        // نمرر كائن التخصص نفسه بدل data-* حتى لا تتأثر المطابقة بالـ Emoji.
        this.majorsList.querySelectorAll('.major').forEach((btn, index) => {
            btn.addEventListener('click', () => {
                this.openMajorModal(suggested[index]);
            });
        });
    }

    getMajorDetails(majorName) {
        if (!majorName) {
            return ['تفاصيل غير متوفرة حالياً.', 'غير محدد', []];
        }

        // أسماء التخصصات المعروضة تحتوي Emoji، بينما مفاتيح MAJOR_DETAILS
        // مكتوبة بدون Emoji. نستخدم مفتاحاً موحداً للطرفين حتى لا يعتمد
        // التطابق على شكل الـ Emoji أو المسافات أو علامات الترقيم.
        const normalizeMajorName = (value) => String(value)
            .normalize('NFKC')
            .replace(/[\u200D\uFE0F]/gu, '')
            .replace(/[^\p{L}\p{N}]+/gu, ' ')
            .replace(/\s+/g, ' ')
            .trim()
            .toLowerCase();

        if (MAJOR_DETAILS[majorName]) {
            return MAJOR_DETAILS[majorName];
        }

        const normalizedName = normalizeMajorName(majorName);

        const match = Object.entries(MAJOR_DETAILS).find(
            ([key]) => normalizeMajorName(key) === normalizedName
        );

        return match
            ? match[1]
            : ['تفاصيل غير متوفرة حالياً.', 'غير محدد', []];
    }

    openMajorModal(major) {
        const modal = document.getElementById('majorModal');
        if (!modal || !major) return;

        const details = this.getMajorDetails(major.name);

        document.getElementById('majorModalTitle').textContent = major.name;
        document.getElementById('majorModalSub').textContent = major.kind;
        document.getElementById('majorModalSummary').textContent = details[0];
        document.getElementById('majorModalDuration').textContent = details[1];
        document.getElementById('majorModalJobs').innerHTML =
            details[2].map(j => `<span class="major-job">${j}</span>`).join('');

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        document.getElementById('majorModalClose').onclick = () => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        };
    }
}
// 5. طبقة التصدير والمشاركة (Export & Share)
class ResultExporter {
    constructor(ui) {
        this.ui = ui;
        this.shareBtn = document.getElementById('shareBtn');
        this.copyBtn = document.getElementById('copyTextBtn');
        this.logos = {
            masari: "assets/masari-logo.png",
            union: "assets/union-logo-wide.png"
        };
        this.bindEvents();
    }

    bindEvents() {
        if (this.shareBtn) this.shareBtn.addEventListener('click', () => this.shareResult());
        if (this.copyBtn) this.copyBtn.addEventListener('click', () => this.copyResultText());
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
        const rr = Math.min(r, w / 2, h / 2);
        ctx.beginPath();
        ctx.moveTo(x + rr, y);
        ctx.arcTo(x + w, y, x + w, y + h, rr);
        ctx.arcTo(x + w, y + h, x, y + h, rr);
        ctx.arcTo(x, y + h, x, y, rr);
        ctx.arcTo(x, y, x + w, y, rr);
        ctx.closePath();
    }

    wrapText(ctx, text, x, y, maxWidth, lineHeight, maxLines = 3) {
        text = String(text || '').trim();
        if (!text) return y;
        const words = text.split(/\s+/);
        const lines = [];
        let line = '';
        for (const word of words) {
            const test = line ? line + ' ' + word : word;
            if (ctx.measureText(test).width <= maxWidth || !line) {
                line = test;
            } else {
                lines.push(line);
                line = word;
                if (lines.length === maxLines - 1) break;
            }
        }
        if (line && lines.length < maxLines) lines.push(line);
        if (lines.length && words.length > 0) {
            const used = lines.join(' ').split(/\s+/).filter(Boolean).length;
            if (used < words.length) lines[lines.length - 1] += '…';
        }
        lines.forEach((ln, i) => ctx.fillText(ln, x, y + i * lineHeight));
        return y + lines.length * lineHeight;
    }

    async buildImage() {
        const scale = 2;
        const W = 1080, H = 1480;
        const canvas = document.createElement('canvas');
        canvas.width = W * scale; canvas.height = H * scale;
        const ctx = canvas.getContext('2d');
        ctx.scale(scale, scale);
        ctx.direction = 'rtl';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'alphabetic';

        // الخلفية
        const bg = ctx.createLinearGradient(0, 0, 0, H);
        bg.addColorStop(0, '#ffffff');
        bg.addColorStop(0.55, '#f7fbf9');
        bg.addColorStop(1, '#eef6f2');
        ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

        // الديكور
        ctx.fillStyle = 'rgba(23,107,92,.05)'; ctx.beginPath(); ctx.arc(90, 110, 160, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = 'rgba(47,158,123,.04)'; ctx.beginPath(); ctx.arc(1000, 1280, 200, 0, Math.PI * 2); ctx.fill();

        // الشعارات
        try {
            const [masariLogo, unionLogo] = await Promise.all([
                this.loadImage(this.logos.masari),
                this.loadImage(this.logos.union)
            ]);
            const drawLogo = (img, boxX, boxY, maxW, maxH, align) => {
                const s = Math.min(maxW / (img.width || 1), maxH / (img.height || 1));
                const w = (img.width || 1) * s, h = (img.height || 1) * s;
                let x = align === 'right' ? boxX + maxW - w : (align === 'center' ? boxX + (maxW - w) / 2 : boxX);
                ctx.drawImage(img, x, boxY + (maxH - h) / 2, w, h);
            };
            drawLogo(unionLogo, 56, 28, 280, 72, 'left');
            drawLogo(masariLogo, 760, 28, 240, 72, 'right');
        } catch (e) { console.warn("تعذر تحميل الشعارات للرسم"); }

        ctx.strokeStyle = '#d5e5df'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(56, 120); ctx.lineTo(1024, 120); ctx.stroke();

        // النصوص الأساسية
        ctx.fillStyle = '#176b5c'; ctx.font = '800 44px system-ui'; ctx.fillText('نتيجتك في مساري', 1024, 175);
        ctx.fillStyle = '#6a7f7a'; ctx.font = '600 22px system-ui'; ctx.fillText('اكتشف اهتماماتك، واختر مستقبلك', 1024, 210);

        // المسار
        ctx.fillStyle = '#ffffff'; ctx.shadowColor = 'rgba(18,63,59,.08)'; ctx.shadowBlur = 20; ctx.shadowOffsetY = 6;
        this.roundRect(ctx, 56, 240, 968, 150, 24); ctx.fill(); ctx.shadowColor = 'transparent';
        ctx.fillStyle = '#e8f6f0'; this.roundRect(ctx, 780, 258, 220, 42, 14); ctx.fill();
        ctx.fillStyle = '#176b5c'; ctx.font = '800 20px system-ui'; ctx.fillText('المسار الأقرب', 970, 286);
        ctx.fillStyle = '#123f3b'; ctx.font = '900 36px system-ui';
        this.wrapText(ctx, this.ui.topResult.textContent, 1000, 340, 880, 42, 1);
        ctx.fillStyle = '#667b77'; ctx.font = '600 22px system-ui';
        this.wrapText(ctx, this.ui.typeLabel.textContent, 1000, 375, 880, 28, 1);

        // التخصصات
        ctx.fillStyle = '#123f3b'; ctx.font = '800 28px system-ui'; ctx.fillText('التخصصات المقترحة', 1024, 440);
        const majors = [...this.ui.majorsList.querySelectorAll('.major-name')].map(el => el.textContent.trim());
        const metas = [...this.ui.majorsList.querySelectorAll('.major-meta')].map(el => el.textContent.replace('· اضغط للتفاصيل', '').trim());
        
        majors.slice(0, 4).forEach((major, i) => {
            const y = 460 + i * 70;
            ctx.fillStyle = '#ffffff'; ctx.shadowColor = 'rgba(18,63,59,.06)'; ctx.shadowBlur = 12; ctx.shadowOffsetY = 3;
            this.roundRect(ctx, 56, y, 968, 58, 16); ctx.fill(); ctx.shadowColor = 'transparent';
            
            ctx.fillStyle = '#e8f6f0'; this.roundRect(ctx, 950, y + 12, 54, 34, 10); ctx.fill();
            ctx.fillStyle = '#176b5c'; ctx.font = '800 20px system-ui'; ctx.fillText(String(i + 1), 980, y + 36);
            ctx.fillStyle = '#183f3c'; ctx.font = '700 24px system-ui'; ctx.fillText(major, 930, y + 28);
            if (metas[i]) {
                ctx.fillStyle = '#7a8f8a'; ctx.font = '600 16px system-ui'; ctx.fillText(metas[i], 930, y + 48);
            }
        });

        // الفوتر
        ctx.strokeStyle = '#d5e5df'; ctx.beginPath(); ctx.moveTo(56, H - 90); ctx.lineTo(1024, H - 90); ctx.stroke();
        ctx.fillStyle = '#176b5c'; ctx.font = '800 18px system-ui'; ctx.textAlign = 'left';
        ctx.fillText('مساري • منصة استرشادية', 56, H - 30);

        return new Promise(resolve => canvas.toBlob(resolve, 'image/png', 1));
    }

    async shareResult() {
        if (!this.ui.topResult.textContent || this.ui.topResult.textContent === '—') {
            this.ui.showToast('اعرض النتيجة أولاً ثم شاركها.', true); return;
        }
        const originalText = this.shareBtn.textContent;
        this.shareBtn.disabled = true; this.shareBtn.textContent = 'جارٍ التجهيز...';
        
        try {
            const blob = await this.buildImage();
            const file = new File([blob], 'masari-result.png', { type: 'image/png' });
            
            if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({ title: 'نتيجتي في مساري', files: [file] });
                this.ui.showToast('تمت المشاركة بنجاح ✓');
            } else {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a'); a.href = url; a.download = 'masari-result.png';
                document.body.appendChild(a); a.click(); a.remove();
                this.ui.showToast('تم تحميل الصورة ✓');
            }
        } catch (e) {
            if (e.name !== 'AbortError') this.ui.showToast('تعذر تجهيز الصورة.', true);
        } finally {
            this.shareBtn.disabled = false; this.shareBtn.textContent = originalText;
        }
    }

    copyResultText() {
        if (!this.ui.topResult.textContent || this.ui.topResult.textContent === '—') return;
        const majors = [...this.ui.majorsList.querySelectorAll('.major-name')].map(el => el.textContent.trim());
        const text = `نتيجتي في مساري 🎯\n\n${this.ui.topResult.textContent}\n${this.ui.typeLabel.textContent}\n\nالتخصصات المقترحة:\n${majors.map((m, i) => `${i + 1}.${m}`).join('\n')}\n\nمساري — اكتشف اهتماماتك واختر مستقبلك`;
        
        navigator.clipboard.writeText(text)
            .then(() => this.ui.showToast('تم نسخ النتيجة كنص ✓'))
            .catch(() => this.ui.showToast('تعذر النسخ.', true));
    }
}

// 6. أدوات النظام (Theme & Hit Counter)
class AppUtilities {
    static initTheme() {
        const themeBtn = document.getElementById('themeBtn');
        const THEME_KEY = 'masari_theme';
        
        const applyTheme = (dark) => {
            document.documentElement.classList.toggle('dark', dark);
            themeBtn.textContent = dark ? '☀️' : '🌙';
            try { localStorage.setItem(THEME_KEY, dark ? 'dark' : 'light'); } catch (e) {}
        };

        themeBtn.addEventListener('click', () => applyTheme(!document.documentElement.classList.contains('dark')));
        
        try {
            const saved = localStorage.getItem(THEME_KEY);
            if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                applyTheme(true);
            }
        } catch (e) {}
    }

    static async initCounter() {
        const el = document.getElementById("visitCount");
        if (!el) return;
        try {
            const r = await fetch("https://counterapi.com/api/masari-demo-2026/view/total-visits", { cache: "no-store" });
            if (r.ok) {
                const d = await r.json();
                el.textContent = d.value.toLocaleString("ar-EG");
                localStorage.setItem("masari_visit_cache", d.value);
            }
        } catch (e) {
            const cached = localStorage.getItem("masari_visit_cache");
            el.textContent = cached ? Number(cached).toLocaleString("ar-EG") : "—";
        }
    }
}
// 7. طبقة الملاحظات (Feedback Notes)
class NotesFeedback {
    constructor(ui) {
        this.ui = ui;
        this.modal = document.getElementById('noteModal');
        this.textarea = document.getElementById('noteText');
        this.notesBtn = document.getElementById('notesBtn');
        this.closeBtn = document.getElementById('noteModalClose');
        this.cancelBtn = document.getElementById('noteCancelBtn');
        this.submitBtn = document.getElementById('noteSubmitBtn');
        // النموذج الجديد للملاحظات
        this.formUrl =
            'https://docs.google.com/forms/d/e/1FAIpQLScKu23LHukvNt_aT_XwvRKkMR9Y-JK5zeGbkFmwzAH865d1cA/formResponse';
        this.entryId = 'entry.1916202014';
        this.submitting = false;
        this.bindEvents();
    }

    bindEvents() {
        if (this.notesBtn) this.notesBtn.addEventListener('click', () => this.openNoteModal());
        if (this.closeBtn) this.closeBtn.addEventListener('click', () => this.closeNoteModal());
        if (this.cancelBtn) this.cancelBtn.addEventListener('click', () => this.closeNoteModal());
        if (this.submitBtn) this.submitBtn.addEventListener('click', () => this.submitNote());
        if (this.modal) {
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal) this.closeNoteModal();
            });
        }
    }

    openNoteModal() {
        if (!this.modal) return;
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
    }

    // إرسال عبر form مخفي + iframe — أوثق مع Google Forms من المتصفح
    submitViaHiddenForm(text) {
        return new Promise((resolve) => {
            const iframeName = 'masari_note_iframe';
            let iframe = document.querySelector(`iframe[name="${iframeName}"]`);
            if (!iframe) {
                iframe = document.createElement('iframe');
                iframe.name = iframeName;
                iframe.style.display = 'none';
                document.body.appendChild(iframe);
            }

            const form = document.createElement('form');
            form.method = 'POST';
            form.action = this.formUrl;
            form.target = iframeName;
            form.style.display = 'none';

            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = this.entryId;
            input.value = text;
            form.appendChild(input);

            // حقول مساعدة أحياناً يطلبها Google Forms
            const draft = document.createElement('input');
            draft.type = 'hidden';
            draft.name = 'fvv';
            draft.value = '1';
            form.appendChild(draft);

            const pageHistory = document.createElement('input');
            pageHistory.type = 'hidden';
            pageHistory.name = 'pageHistory';
            pageHistory.value = '0';
            form.appendChild(pageHistory);

            document.body.appendChild(form);

            const done = () => {
                try { form.remove(); } catch (e) {}
                resolve();
            };

            // لا نحصل على استجابة حقيقية بسبب cross-origin؛ ننتظر قليلاً ثم نعتبره مرسلاً
            iframe.onload = () => done();
            try {
                form.submit();
            } catch (e) {
                done();
                return;
            }
            setTimeout(done, 1200);
        });
    }

    async submitNote() {
        if (this.submitting) return;
        const textVal = (this.textarea?.value || '').trim();
        if (textVal.length < 3) {
            this.ui.showToast('اكتب ملاحظة أقصرها بضعة أحرف على الأقل', true);
            this.textarea?.focus();
            return;
        }

        this.submitting = true;
        const original = this.submitBtn?.textContent;
        if (this.submitBtn) {
            this.submitBtn.disabled = true;
            this.submitBtn.textContent = 'جارٍ الإرسال...';
        }

        try {
            await this.submitViaHiddenForm(textVal);

            // احتياطي: fetch no-cors بنفس البيانات
            const payload = new URLSearchParams();
            payload.append(this.entryId, textVal);
            fetch(this.formUrl, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
                body: payload.toString()
            }).catch(() => {});
        } finally {
            this.submitting = false;
            if (this.submitBtn) {
                this.submitBtn.disabled = false;
                this.submitBtn.textContent = original || 'إرسال';
            }
            if (this.textarea) this.textarea.value = '';
            this.closeNoteModal();
            this.ui.showToast('تم إرسال ملاحظتك ✓');
        }
    }
}

// 8. نقطة الانطلاق (Entry Point)
document.addEventListener('DOMContentLoaded', () => {
    AppUtilities.initTheme();
    AppUtilities.initCounter();

    const engine = new QuizEngine();
    const ui = new QuizUI(engine);
    const exporter = new ResultExporter(ui);
    const notes = new NotesFeedback(ui);
});
