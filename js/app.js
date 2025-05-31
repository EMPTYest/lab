import { UserModel } from './models/userModel.js';
// import { WordModel } from './models/wordModel.js'; // Розкоментуємо, коли буде готовий
import { NavView } from './views/navView.js';
import { AuthView } from './views/authView.js';
import { AuthController } from './controllers/authController.js';
// import { ProfileView } from './views/profileView.js';
// import { ProfileController } from './controllers/profileController.js';
// import { AppView } from './views/appView.js';
// import { AppController } from './controllers/appController.js';


// const defaultWordSet = [ /* ... ваш масив слів, якщо він потрібен тут ... */ ];

class App {
    constructor() {
        this.userModel = new UserModel();
        // this.wordModel = new WordModel(defaultWordSet);
        
        this.navView = new NavView();
        
        // Підписка NavView на зміни статусу аутентифікації з UserModel
        this.userModel.subscribeAuthChange((isLoggedIn) => {
            this.navView.updateNav(isLoggedIn);
        });
        
        // Ініціалізація NavView початковим станом
        this.navView.updateNav(this.userModel.isLoggedIn());
        this.navView.bindLogout(this.handleLogout.bind(this));
        this.navView.setCurrentPageClass(); // Встановлюємо .current для поточної сторінки


        const bodyId = document.body.id;

        // Ініціалізація View та Controller залежно від сторінки
        if (bodyId === 'page-register' || bodyId === 'page-login') {
            this.authView = new AuthView();
            this.authController = new AuthController(this.userModel, this.authView);
        } else if (bodyId === 'page-profile') {
            this.protectRoute();
            // this.profileView = new ProfileView(this.userModel.getCurrentUser()); // Передаємо дані користувача
            // this.profileController = new ProfileController(this.userModel, this.profileView);
        } else if (bodyId === 'page-app') {
            this.protectRoute();
            // this.appView = new AppView();
            // this.appController = new AppController(this.wordModel, this.appView);
        }
    }

    handleLogout() {
        this.userModel.logout();
        // NavView оновиться автоматично через підписку
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