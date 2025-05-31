export class AppView {
    constructor() {
        this.appPage = document.getElementById('page-app');
        if (!this.appPage) {
            console.error("AppView: #page-app element not found!");
            return;
        }

        // Елементи для режиму вивчення
        this.learnSection = this.appPage.querySelector('.app-section:nth-child(1)');
        if (this.learnSection) {
            this.learnForeignWordEl = this.learnSection.querySelector('.foreign-word');
            this.learnTranslationEl = this.learnSection.querySelector('.translation');
            this.showTranslationBtn = this.learnSection.querySelector('button:nth-of-type(1)');
            this.knowBtn = this.learnSection.querySelector('button:nth-of-type(2)');
            this.dontKnowBtn = this.learnSection.querySelector('button:nth-of-type(3)');
            this.learnStatsEl = this.learnSection.querySelector('div[style*="text-align: center"] p');
        }


        // Елементи для режиму контролю
        this.testSection = this.appPage.querySelector('.app-section:nth-child(2)');
        if (this.testSection) {
            this.testForeignWordDisplayEl = this.testSection.querySelector('p.foreign-word'); // Батьківський <p>
            this.testForeignWordStrongEl = this.testSection.querySelector('.foreign-word strong'); // Сам <strong>
            this.testUserInputEl = this.testSection.querySelector('#user-translation');
            this.checkBtn = this.testSection.querySelector('button:nth-of-type(1)');
            this.skipBtn = this.testSection.querySelector('button:nth-of-type(2)');
            this.feedbackAreaEl = this.testSection.querySelector('#feedback-area p');
            this.progressBarEl = this.testSection.querySelector('.progress-bar');
            this.testProgressTextEl = this.testSection.querySelector('p:first-of-type'); // "Прогрес тесту:"
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

    bindShowLearnTranslation(handler) {
        if (this.showTranslationBtn) this.showTranslationBtn.addEventListener('click', handler);
    }
    bindKnowLearnWord(handler) {
        if (this.knowBtn) this.knowBtn.addEventListener('click', handler);
    }
    bindDontKnowLearnWord(handler) {
        if (this.dontKnowBtn) this.dontKnowBtn.addEventListener('click', handler);
    }

    // --- Методи для режиму тестування ---
    displayTestWord(data) {
        if (!this.testForeignWordStrongEl || !this.testUserInputEl) return;
        if (data.testCompleted) {
            // Це буде оброблятися в displayTestCompleted
            return;
        }
        
        if (this.testForeignWordDisplayEl) this.testForeignWordDisplayEl.innerHTML = `Перекладіть: <strong>${data.word}</strong>`;
        
        if (this.testUserInputEl) {
            this.testUserInputEl.value = '';
            this.testUserInputEl.disabled = false;
            this.testUserInputEl.focus();
        }
        if (this.checkBtn) this.checkBtn.disabled = false;
        if (this.skipBtn) this.skipBtn.disabled = false;
        if (this.feedbackAreaEl) {
            this.feedbackAreaEl.textContent = "Результат: [Очікування відповіді...]";
            this.feedbackAreaEl.style.color = "inherit";
        }
    }

    getTestAnswer() {
        return this.testUserInputEl ? this.testUserInputEl.value : '';
    }

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
        this.progressBarEl.style.width = `${progressPercentage}%`;
        this.progressBarEl.textContent = `${Math.round(progressPercentage)}%`;
    }

    displayTestCompleted(result) {
        if(this.testForeignWordDisplayEl) this.testForeignWordDisplayEl.textContent = "Тест завершено!";
        if(this.testUserInputEl) this.testUserInputEl.disabled = true;
        if(this.checkBtn) this.checkBtn.disabled = true;
        if(this.skipBtn) this.skipBtn.disabled = true;
        if(this.feedbackAreaEl) this.feedbackAreaEl.textContent = `Результат: ${result.correct} з ${result.total} правильних.`;
        if(this.testProgressTextEl && this.testProgressTextEl.parentElement.lastChild === this.progressBarEl.parentElement) {
             // Не ховаємо прогрес-бар, просто оновлюємо текст
        }
    }

    bindCheckTestAnswer(handler) {
        if (this.checkBtn) this.checkBtn.addEventListener('click', () => handler(this.getTestAnswer()));
    }
    bindSkipTestWord(handler) {
        if (this.skipBtn) this.skipBtn.addEventListener('click', handler);
    }
}