export class AppView {
    constructor() {
        console.log("AppView: Constructor called.");
        this.appPage = document.getElementById('page-app');
        if (!this.appPage) {
            console.error("AppView: #page-app element not found!");
            return;
        }
        console.log("AppView: #page-app element FOUND.");

        // Знаходимо всі секції з класом .app-section
        const allAppSections = this.appPage.querySelectorAll('.app-section');
        console.log("AppView: Found allAppSections count:", allAppSections.length); // ЛОГ: Скільки секцій знайдено

        if (allAppSections.length >= 1) {
            this.learnSection = allAppSections[0]; // Перша секція для вивчення
            console.log("AppView: learnSection (allAppSections[0]):", this.learnSection); // ЛОГ
            if (this.learnSection) {
                this.learnForeignWordEl = this.learnSection.querySelector('.foreign-word');
                this.learnTranslationEl = this.learnSection.querySelector('.translation');
                this.showTranslationBtn = this.learnSection.querySelector('button:nth-of-type(1)');
                this.knowBtn = this.learnSection.querySelector('button:nth-of-type(2)');
                this.dontKnowBtn = this.learnSection.querySelector('button:nth-of-type(3)');
                this.learnStatsEl = this.learnSection.querySelector('div[style*="text-align: center"] p');
                console.log("AppView: learnSection buttons - show:", this.showTranslationBtn, "know:", this.knowBtn, "dontKnow:", this.dontKnowBtn);
            } else {
                console.error("AppView: learnSection (allAppSections[0]) is unexpectedly null or undefined even if allAppSections.length >= 1");
            }
        } else {
            this.learnSection = null; // Явно встановлюємо в null, якщо не знайдено
            console.error("AppView: No .app-section found for learnSection.");
        }


        if (allAppSections.length >= 2) {
            this.testSection = allAppSections[1]; // Друга секція для тестування
            console.log("AppView: testSection (allAppSections[1]):", this.testSection); // ЛОГ
            if (this.testSection) {
                this.testForeignWordDisplayP = this.testSection.querySelector('p.foreign-word');
                this.testForeignWordStrongEl = this.testSection.querySelector('.foreign-word strong'); // Додано для перевірки
                this.testUserInputEl = this.testSection.querySelector('#user-translation');
                this.checkBtn = this.testSection.querySelector('button:nth-of-type(1)');
                this.skipBtn = this.testSection.querySelector('button:nth-of-type(2)');
                this.feedbackAreaEl = this.testSection.querySelector('#feedback-area p');
                this.progressBarEl = this.testSection.querySelector('.progress-bar');
                console.log("AppView: testSection buttons - check:", this.checkBtn, "skip:", this.skipBtn);
                console.log("AppView: testForeignWordStrongEl:", this.testForeignWordStrongEl);
            } else {
                console.error("AppView: testSection (allAppSections[1]) is unexpectedly null or undefined even if allAppSections.length >= 2");
            }
        } else {
            this.testSection = null; // Явно встановлюємо в null, якщо не знайдено
            console.error("AppView: Less than 2 .app-section found, testSection will be null.");
        }
    }

    // --- Методи для режиму вивчення ---
    displayLearnWord(data) {
        if (!this.learnForeignWordEl || !this.learnTranslationEl) return;

        if (data.allLearned) {
            this.learnForeignWordEl.textContent = "Слова закінчились!";
            this.learnTranslationEl.textContent = "Ви молодець!";
            if (this.showTranslationBtn) this.showTranslationBtn.disabled = true;
            if (this.knowBtn) this.knowBtn.disabled = true;
            if (this.dontKnowBtn) this.dontKnowBtn.disabled = true;
            if (this.learnStatsEl) this.learnStatsEl.textContent = "Усі слова вивчено!";
        } else {
            this.learnForeignWordEl.textContent = data.word;
            this.learnTranslationEl.textContent = data.translation;
            this.learnTranslationEl.style.color = data.isTranslationShown ? "#555" : "#aaa";
            if (this.learnStatsEl) this.learnStatsEl.textContent = `Набір: ${data.category || 'Загальний'} | Слово ${data.index + 1} з ${data.total}`;
            
            if (this.showTranslationBtn) this.showTranslationBtn.disabled = data.isTranslationShown;
            if (this.knowBtn) this.knowBtn.disabled = false;
            if (this.dontKnowBtn) this.dontKnowBtn.disabled = false;
        }
    }

    bindShowLearnTranslation(handler) { if (this.showTranslationBtn) this.showTranslationBtn.addEventListener('click', handler); }
    bindKnowLearnWord(handler) { if (this.knowBtn) this.knowBtn.addEventListener('click', handler); }
    bindDontKnowLearnWord(handler) { if (this.dontKnowBtn) this.dontKnowBtn.addEventListener('click', handler); }

    // --- Методи для режиму тестування ---
    displayTestWord(data) { // data = { word: "SomeWord", testCompleted: false }
        if (!this.testForeignWordDisplayP || !this.testUserInputEl) return;
        
        if (data.testCompleted) { // Це обробляється в displayTestCompleted
            return;
        }
        
        this.testForeignWordDisplayP.innerHTML = `Перекладіть: <strong>${data.word}</strong>`;
        
        this.testUserInputEl.value = '';
        this.testUserInputEl.disabled = false;
        this.testUserInputEl.focus();
        
        if (this.checkBtn) this.checkBtn.disabled = false;
        if (this.skipBtn) this.skipBtn.disabled = false;
        if (this.feedbackAreaEl) {
            this.feedbackAreaEl.textContent = "Результат: [Очікування відповіді...]";
            this.feedbackAreaEl.style.color = "inherit";
        }
    }

    getTestAnswer() { return this.testUserInputEl ? this.testUserInputEl.value : ''; }

    displayTestFeedback({ isCorrect, correctAnswer }) {
        if (!this.feedbackAreaEl) return;
        if (isCorrect) {
            this.feedbackAreaEl.textContent = "Правильно!";
            this.feedbackAreaEl.style.color = "green";
        } else {
            this.feedbackAreaEl.textContent = `Неправильно. Правильна відповідь: ${correctAnswer}`;
            this.feedbackAreaEl.style.color = "red";
        }
    }
    
    updateTestProgressBar(progressPercentage) {
        if (!this.progressBarEl) return;
        const progress = Math.round(Math.min(progressPercentage, 100));
        this.progressBarEl.style.width = `${progress}%`;
        this.progressBarEl.textContent = `${progress}%`;
    }

    displayTestCompleted(result) { // data = { correct: X, total: Y }
        if(this.testForeignWordDisplayP) this.testForeignWordDisplayP.textContent = "Тест завершено!";
        if(this.testUserInputEl) this.testUserInputEl.disabled = true;
        if(this.checkBtn) this.checkBtn.disabled = true;
        if(this.skipBtn) this.skipBtn.disabled = true;
        if(this.feedbackAreaEl) this.feedbackAreaEl.textContent = `Результат: ${result.correct} з ${result.total} правильних.`;
    }

    bindCheckTestAnswer(handler) { if (this.checkBtn) this.checkBtn.addEventListener('click', () => handler(this.getTestAnswer())); }
    bindSkipTestWord(handler) { if (this.skipBtn) this.skipBtn.addEventListener('click', handler); }
}