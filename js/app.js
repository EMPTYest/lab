import { UserModel } from './models/userModel.js';
import { WordModel } from './models/wordModel.js'; 
import { NavView } from './views/navView.js';
import { AuthView } from './views/authView.js';
import { AuthController } from './controllers/authController.js';
import { ProfileView } from './views/profileView.js';
import { ProfileController } from './controllers/profileController.js';
import { AppView } from './views/appView.js';             
import { AppController } from './controllers/appController.js'; 


const defaultWordSet = [
    { foreign: "Apple", translation: "Яблуко", category: "Fruits" },
    { foreign: "Banana", translation: "Банан", category: "Fruits" },
    { foreign: "Book", translation: "Книга", category: "Objects" },
    { foreign: "Hello", translation: "Привіт", category: "Greetings" },
    { foreign: "Cat", translation: "Кіт", category: "Animals" },
    { foreign: "Dog", translation: "Собака", category: "Animals" },
    { foreign: "Sun", translation: "Сонце", category: "Nature" },
    { foreign: "Water", translation: "Вода", category: "Nature" },
    { foreign: "Run", translation: "Бігти", category: "Verbs" },
    { foreign: "Read", translation: "Читати", category: "Verbs" },
];

class App {
    constructor() {
        this.userModel = new UserModel();
        this.wordModel = new WordModel(defaultWordSet); 
        
        this.navView = new NavView();
        
        this.userModel.subscribeAuthChange((isLoggedIn) => {
            this.navView.updateNav(isLoggedIn);
        });
        
        this.navView.updateNav(this.userModel.isLoggedIn());
        this.navView.bindLogout(this.handleLogout.bind(this));
        this.navView.setCurrentPageClass();


        const bodyId = document.body.id;

        if (bodyId === 'page-register' || bodyId === 'page-login') {
            this.authView = new AuthView();
            this.authController = new AuthController(this.userModel, this.authView);
        } else if (bodyId === 'page-profile') {
            this.protectRoute(); 
            if (this.userModel.isLoggedIn()) { 
                this.profileView = new ProfileView();
                this.profileController = new ProfileController(this.userModel, this.profileView);
            }
        } else if (bodyId === 'page-app') {
             console.log("APP.JS: Initializing App Page modules..."); // ЛОГ
            this.protectRoute();
            if (this.userModel.isLoggedIn()) {
                console.log("APP.JS: User is logged in, creating AppView and AppController."); // ЛОГ
                this.appView = new AppView();
                console.log("APP.JS: AppView instance:", this.appView); // ЛОГ - чи не null?
                this.appController = new AppController(this.wordModel, this.appView);
                console.log("APP.JS: AppController instance:", this.appController); // ЛОГ - чи не null?
            } else {
                console.log("APP.JS: User is NOT logged in for app page (should have been redirected).");
            }
        }
    }

    handleLogout() {
        this.userModel.logout();
        window.location.href = 'login.html';
    }

    protectRoute() {
        if (!this.userModel.isLoggedIn()) {
            window.location.href = 'login.html';
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new App();
});