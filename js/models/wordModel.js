export class WordModel {
    constructor(defaultWords = []) {
        this.defaultWords = [...defaultWords];
        
        this.wordsToLearn = [];
        this.currentLearnIndex = 0;
        this.isLearnTranslationShown = false;

        this.testWords = [];
        this.currentTestIndex = 0;
        this.correctTestAnswers = 0;
        this.totalTestQuestions = 0; // Додаємо

        this.onLearnWordChangedCallbacks = [];
        this.onTestWordChangedCallbacks = [];
        this.onTestFeedbackCallbacks = [];
        this.onTestProgressCallbacks = [];
        this.onTestCompletedCallbacks = [];
    }

    // --- Методи підписки (залишаються без змін з попередньої версії MVC) ---
    subscribeLearnWordChange(callback) { this.onLearnWordChangedCallbacks.push(callback); }
    subscribeTestWordChange(callback) { this.onTestWordChangedCallbacks.push(callback); }
    subscribeTestFeedback(callback) { this.onTestFeedbackCallbacks.push(callback); }
    subscribeTestProgress(callback) { this.onTestProgressCallbacks.push(callback); }
    subscribeTestCompleted(callback) { this.onTestCompletedCallbacks.push(callback); }

    // --- Методи сповіщення (залишаються без змін, можливо з невеликими корекціями даних) ---
    _notifyLearnWordChange() {
        const data = this.getCurrentLearnWordData();
        this.onLearnWordChangedCallbacks.forEach(cb => cb(data));
    }
    _notifyTestWordChange() { // Для показу наступного слова або завершення
        if (this.currentTestIndex >= this.testWords.length) {
            this._notifyTestCompleted();
        } else {
            const data = this.getCurrentTestWordData();
            this.onTestWordChangedCallbacks.forEach(cb => cb(data));
        }
        this._notifyTestProgress();
    }
    _notifyTestFeedback(isCorrect, correctAnswer = '') {
        this.onTestFeedbackCallbacks.forEach(cb => cb({ isCorrect, correctAnswer }));
    }
    _notifyTestProgress() {
        const progress = this.totalTestQuestions > 0 ? (this.currentTestIndex / this.totalTestQuestions) * 100 : 0;
        this.onTestProgressCallbacks.forEach(cb => cb(Math.min(progress, 100)));
    }
    _notifyTestCompleted() {
        const result = {
            correct: this.correctTestAnswers,
            total: this.totalTestQuestions
        };
        this.onTestCompletedCallbacks.forEach(cb => cb(result));
    }

    _shuffleArray(array) {
        let newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }

    // --- Режим вивчення ---
    startLearningSession() {
        this.wordsToLearn = this._shuffleArray(this.defaultWords);
        this.currentLearnIndex = 0;
        this.isLearnTranslationShown = false;
        this._notifyLearnWordChange();
    }

    getCurrentLearnWordData() {
        if (this.currentLearnIndex >= this.wordsToLearn.length) {
            return { word: null, translation: null, category: null, allLearned: true, index: this.currentLearnIndex, total: this.wordsToLearn.length, isTranslationShown: this.isLearnTranslationShown };
        }
        const wordData = this.wordsToLearn[this.currentLearnIndex];
        return {
            word: wordData.foreign,
            translation: this.isLearnTranslationShown ? wordData.translation : "[Переклад приховано]",
            category: wordData.category,
            allLearned: false,
            index: this.currentLearnIndex,
            total: this.wordsToLearn.length,
            isTranslationShown: this.isLearnTranslationShown
        };
    }

    showLearnTranslation() {
        if (this.currentLearnIndex < this.wordsToLearn.length && !this.isLearnTranslationShown) {
            this.isLearnTranslationShown = true;
            this._notifyLearnWordChange();
        }
    }

    nextLearnWord() { // Для кнопок "Знаю" та "Не знаю"
        if (this.currentLearnIndex < this.wordsToLearn.length) {
            this.currentLearnIndex++;
        }
        this.isLearnTranslationShown = false;
        this._notifyLearnWordChange();
    }

    // --- Режим тестування ---
    startTestSession() {
        this.testWords = this._shuffleArray(this.defaultWords);
        this.currentTestIndex = 0;
        this.correctTestAnswers = 0;
        this.totalTestQuestions = this.testWords.length;
        this._notifyTestWordChange(); // Повідомити про перше слово
        this._notifyTestProgress();  // Повідомити початковий прогрес (0%)
    }

    getCurrentTestWordData() {
        if (this.currentTestIndex >= this.testWords.length) {
            return { word: null, testCompleted: true };
        }
        const wordData = this.testWords[this.currentTestIndex];
        return { word: wordData.foreign, testCompleted: false };
    }

    submitTestAnswer(userAnswer) {
        if (this.currentTestIndex >= this.testWords.length) return {isCorrect: false, shouldContinue: false};

        const currentWord = this.testWords[this.currentTestIndex];
        const isCorrect = userAnswer.trim().toLowerCase() === currentWord.translation.toLowerCase();

        if (isCorrect) {
            this.correctTestAnswers++;
        }
        this._notifyTestFeedback(isCorrect, currentWord.translation);
        
        this.currentTestIndex++;
        // Не викликаємо _notifyTestWordChange тут, це зробить контролер після таймауту
        return {isCorrect, shouldContinue: this.currentTestIndex < this.testWords.length};
    }

    skipTestWord() {
        if (this.currentTestIndex >= this.testWords.length) return {shouldContinue: false};
        const currentWord = this.testWords[this.currentTestIndex];
        this._notifyTestFeedback(false, currentWord.translation);
        
        this.currentTestIndex++;
        return {shouldContinue: this.currentTestIndex < this.testWords.length};
    }
}