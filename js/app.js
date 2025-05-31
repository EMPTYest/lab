import { UserModel } from './models/userModel.js';
import { WordModel } from './models/wordModel.js'; // РОЗКОМЕНТУЄМО ПІЗНІШЕ
import { NavView } from './views/navView.js';
import { AuthView } from './views/authView.js';
import { AuthController } from './controllers/authController.js';
import { ProfileView } from './views/profileView.js';
import { ProfileController } from './controllers/profileController.js';
import { AppView } from './views/appView.js';             // РОЗКОМЕНТУЄМО ПІЗНІШЕ
import { AppController } from './controllers/appController.js'; // РОЗКОМЕНТУЄМО ПІЗНІШЕ


const defaultWordSet = [ // Визначимо тут, щоб WordModel міг його отримати
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
        this.wordModel = new WordModel(defaultWordSet); // Створюємо екземпляр WordModel
        
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
            if (this.userModel.isLoggedIn()) { 
                this.profileView = new ProfileView();
                this.profileController = new ProfileController(this.userModel, this.profileView);
            }
        } else if (bodyId === 'page-app') {
            this.protectRoute();
            if (this.userModel.isLoggedIn()) {
                this.appView = new AppView(); // Створюємо AppView
                // Передаємо WordModel та AppView до AppController.
                // UserModel може бути потрібен, якщо AppController буде зберігати прогрес слів для користувача.
                this.appController = new AppController(this.wordModel, this.appView /*, this.userModel */); 
            }
        }
        // Можна додати обробку для page-index, якщо там потрібен якийсь динамічний контент
        // else if (bodyId === 'page-index') {
        //     // ...
        // }
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