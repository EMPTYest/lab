export class AppController {
    constructor(wordModel, appView /*, userModel опціонально */) {
        this.wordModel = wordModel;
        this.appView = appView;
        // this.userModel = userModel; // Якщо потрібно зберігати прогрес

        // Підписка View на зміни в Моделі
        this.wordModel.subscribeLearnWordChange(data => this.appView.displayLearnWord(data));
        this.wordModel.subscribeTestWordChange(data => this.appView.displayTestWord(data));
        this.wordModel.subscribeTestFeedback(feedback => this.appView.displayTestFeedback(feedback));
        this.wordModel.subscribeTestProgress(progress => this.appView.updateTestProgressBar(progress));
        this.wordModel.subscribeTestCompleted(result => this.appView.displayTestCompleted(result));


        // Прив'язка обробників з View до методів Моделі (через цей контролер)
        this.appView.bindShowLearnTranslation(() => this.wordModel.showLearnTranslation());
        this.appView.bindKnowLearnWord(() => this.wordModel.nextLearnWord()); // "Знаю" і "Не знаю" поки роблять те саме
        this.appView.bindDontKnowLearnWord(() => this.wordModel.nextLearnWord());

        this.appView.bindCheckTestAnswer((answer) => this.handleTestAnswerSubmission(answer));
        this.appView.bindSkipTestWord(() => this.handleTestAnswerSubmission(null, true)); // true означає skip

        // Ініціалізація сесій
        this.wordModel.startLearningSession();
        this.wordModel.startTestSession();
    }

    handleTestAnswerSubmission(answer, isSkipped = false) {
        if (isSkipped) {
            this.wordModel.skipTestWord();
        } else {
            this.wordModel.submitTestAnswer(answer);
        }
        // Після обробки відповіді/пропуску, якщо тест не завершено,
        // потрібно показати наступне слово (з невеликою затримкою, щоб користувач побачив фідбек)
        setTimeout(() => {
            if (!this.wordModel.getCurrentTestWordData().testCompleted) {
                 this.wordModel._notifyTestWordChange(); // Примусово оновлюємо, щоб показати наступне слово
            }
        }, 1500); // Затримка 1.5 секунди
    }
}