export class AppController {
    constructor(wordModel, appView) {
        this.wordModel = wordModel;
        this.appView = appView;

        // Підписка View на зміни в Моделі
        this.wordModel.subscribeLearnWordChange(data => this.appView.displayLearnWord(data));
        this.wordModel.subscribeTestWordChange(data => this.appView.displayTestWord(data));
        this.wordModel.subscribeTestFeedback(feedback => this.appView.displayTestFeedback(feedback));
        this.wordModel.subscribeTestProgress(progress => this.appView.updateTestProgressBar(progress));
        this.wordModel.subscribeTestCompleted(result => this.appView.displayTestCompleted(result));

        // Прив'язка обробників з View до методів Моделі (через цей контролер)
        this.appView.bindShowLearnTranslation(() => this.wordModel.showLearnTranslation());
        this.appView.bindKnowLearnWord(() => this.wordModel.nextLearnWord());
        this.appView.bindDontKnowLearnWord(() => this.wordModel.nextLearnWord());

        this.appView.bindCheckTestAnswer((answer) => this.handleTestAnswerSubmission(answer, false));
        this.appView.bindSkipTestWord(() => this.handleTestAnswerSubmission(null, true));

        // Ініціалізація сесій
        this.wordModel.startLearningSession();
        this.wordModel.startTestSession();
    }

    handleTestAnswerSubmission(answer, isSkipped = false) {
        let result;
        if (isSkipped) {
            result = this.wordModel.skipTestWord();
        } else {
            result = this.wordModel.submitTestAnswer(answer);
        }
        
        if (result.shouldContinue) {
            setTimeout(() => {
                this.wordModel._notifyTestWordChange(); // Запитуємо наступне слово/оновлення
            }, 1500);
        } else if (!isSkipped && this.wordModel.currentTestIndex >= this.wordModel.testWords.length) {
            // Якщо це була остання відповідь і тест завершено, _notifyTestCompleted вже викликано з моделі.
            // _notifyTestProgress також оновиться.
        } else if (isSkipped && this.wordModel.currentTestIndex >= this.wordModel.testWords.length) {
            // Якщо пропустили останнє слово
        }
    }
}