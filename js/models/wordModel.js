export class WordModel {
    constructor(defaultWords = []) {
        this.defaultWords = [...defaultWords]; // Оригінальний набір слів
        
        // Для режиму вивчення
        this.wordsToLearn = [];
        this.currentLearnIndex = 0;
        this.isLearnTranslationShown = false;

        // Для режиму тестування
        this.testWords = [];
        this.currentTestIndex = 0;
        this.correctTestAnswers = 0;

        // Колбеки для сповіщення View про зміни
        this.onLearnWordChangedCallbacks = [];
        this.onTestWordChangedCallbacks = [];
        this.onTestFeedbackCallbacks = [];
        this.onTestProgressCallbacks = []; // Для прогрес-бару
        this.onTestCompletedCallbacks = [];
    }

    // --- Методи підписки ---
    subscribeLearnWordChange(callback) { this.onLearnWordChangedCallbacks.push(callback); }
    subscribeTestWordChange(callback) { this.onTestWordChangedCallbacks.push(callback); }
    subscribeTestFeedback(callback) { this.onTestFeedbackCallbacks.push(callback); }
    subscribeTestProgress(callback) { this.onTestProgressCallbacks.push(callback); }
    subscribeTestCompleted(callback) { this.onTestCompletedCallbacks.push(callback); }

    _notifyLearnWordChange() {
        const data = this.getCurrentLearnWordData();
        this.onLearnWordChangedCallbacks.forEach(cb => cb(data));
    }
    _notifyTestWordChange() {
        const data = this.getCurrentTestWordData();
        this.onTestWordChangedCallbacks.forEach(cb => cb(data));
        this._notifyTestProgress();
    }
    _notifyTestFeedback(isCorrect, correctAnswer = '') {
        this.onTestFeedbackCallbacks.forEach(cb => cb({ isCorrect, correctAnswer }));
    }
    _notifyTestProgress() {
        const progress = this.testWords.length > 0 ? (this.currentTestIndex / this.testWords.length) * 100 : 0;
        this.onTestProgressCallbacks.forEach(cb => cb(Math.min(progress, 100)));
    }
    _notifyTestCompleted() {
        const result = {
            correct: this.correctTestAnswers,
            total: this.testWords.length
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
        const word = this.wordsToLearn[this.currentLearnIndex];
        return {
            word: word.foreign,
            translation: this.isLearnTranslationShown ? word.translation : "[Переклад приховано]",
            category: word.category,
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

    nextLearnWord() {
        if (this.currentLearnIndex < this.wordsToLearn.length) {
            this.currentLearnIndex++;
            this.isLearnTranslationShown = false; // Скидаємо показ перекладу для нового слова
            this._notifyLearnWordChange();
        }
    }

    // --- Режим тестування ---
    startTestSession() {
        this.testWords = this._shuffleArray(this.defaultWords);
        this.currentTestIndex = 0;
        this.correctTestAnswers = 0;
        this._notifyTestWordChange();
    }

    getCurrentTestWordData() {
        if (this.currentTestIndex >= this.testWords.length) {
            return { word: null, testCompleted: true, index: this.currentTestIndex, total: this.testWords.length };
        }
        const word = this.testWords[this.currentTestIndex];
        return { word: word.foreign, testCompleted: false, index: this.currentTestIndex, total: this.testWords.length };
    }

    submitTestAnswer(userAnswer) {
        if (this.currentTestIndex >= this.testWords.length) return;

        const currentWord = this.testWords[this.currentTestIndex];
        const isCorrect = userAnswer.trim().toLowerCase() === currentWord.translation.toLowerCase();

        if (isCorrect) {
            this.correctTestAnswers++;
        }
        this._notifyTestFeedback(isCorrect, currentWord.translation);
        
        this.currentTestIndex++;
        
        if (this.currentTestIndex >= this.testWords.length) {
            this._notifyTestCompleted(); // Сповіщаємо про завершення тесту
        }
        // _notifyTestWordChange() буде викликано з наступного setTimeout в контролері,
        // щоб дати час на відображення фідбеку
    }

    skipTestWord() {
        if (this.currentTestIndex >= this.testWords.length) return;
        const currentWord = this.testWords[this.currentTestIndex];
        this._notifyTestFeedback(false, currentWord.translation); // Позначаємо як неправильну відповідь при пропуску
        
        this.currentTestIndex++;

        if (this.currentTestIndex >= this.testWords.length) {
            this._notifyTestCompleted();
        }
    }
}