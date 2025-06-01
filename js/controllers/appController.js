export class AppController {
    constructor(wordModel, appView) {
        this.wordModel = wordModel;
        this.appView = appView;

      
        this.wordModel.subscribeLearnWordChange(data => this.appView.displayLearnWord(data));
        this.wordModel.subscribeTestWordChange(data => this.appView.displayTestWord(data));
        this.wordModel.subscribeTestFeedback(feedback => this.appView.displayTestFeedback(feedback));
        this.wordModel.subscribeTestProgress(progress => this.appView.updateTestProgressBar(progress));
        this.wordModel.subscribeTestCompleted(result => this.appView.displayTestCompleted(result));

     
        this.appView.bindShowLearnTranslation(() => this.wordModel.showLearnTranslation());
        this.appView.bindKnowLearnWord(() => this.wordModel.nextLearnWord());
        this.appView.bindDontKnowLearnWord(() => this.wordModel.nextLearnWord());

        this.appView.bindCheckTestAnswer((answer) => this.handleTestAnswerSubmission(answer, false));
        this.appView.bindSkipTestWord(() => this.handleTestAnswerSubmission(null, true));

  
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
                this.wordModel._notifyTestWordChange(); 
            }, 1500);
        } else if (!isSkipped && this.wordModel.currentTestIndex >= this.wordModel.testWords.length) {

        } else if (isSkipped && this.wordModel.currentTestIndex >= this.wordModel.testWords.length) {

        }
    }
}