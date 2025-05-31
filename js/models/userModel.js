export class UserModel {
    constructor() {
        this._users = JSON.parse(localStorage.getItem('users')) || [];
        this._currentUserEmail = localStorage.getItem('currentUserEmail');
        this.onAuthChangedCallbacks = [];
    }

    // Система підписки на подію зміни статусу аутентифікації
    subscribeAuthChange(callback) {
        this.onAuthChangedCallbacks.push(callback);
    }

    _notifyAuthChange() {
        this.onAuthChangedCallbacks.forEach(callback => callback(this.isLoggedIn()));
    }

    getUsers() {
        return [...this._users]; // Повертаємо копію
    }

    _saveUsers() {
        localStorage.setItem('users', JSON.stringify(this._users));
    }

    getCurrentUser() {
        if (!this._currentUserEmail) return null;
        return this._users.find(user => user.email === this._currentUserEmail);
    }

    setCurrentUserEmail(email) {
        const previousLoginState = this.isLoggedIn();
        this._currentUserEmail = email;
        if (email) {
            localStorage.setItem('currentUserEmail', email);
        } else {
            localStorage.removeItem('currentUserEmail');
        }
        // Сповіщаємо, тільки якщо статус дійсно змінився
        if (previousLoginState !== this.isLoggedIn()) {
            this._notifyAuthChange();
        }
    }

    addUser(userData) {
        if (!userData.name || !userData.email || !userData.password) {
            return { success: false, message: "Будь ласка, заповніть усі обов'язкові поля." };
        }
        if (userData.password.length < 6) {
            return { success: false, message: 'Пароль має містити щонайменше 6 символів.' };
        }
        if (this._users.find(user => user.email === userData.email.toLowerCase())) {
            return { success: false, message: "Користувач з таким email вже існує." };
        }

        const newUser = {
            name: userData.name,
            email: userData.email.toLowerCase(),
            gender: userData.gender,
            dob: userData.dob,
            password: userData.password, // ПАРОЛЬ ВІДКРИТИЙ! НЕБЕЗПЕЧНО!
            registrationDate: new Date().toISOString().split('T')[0],
            learnedWords: [] // Для майбутнього
        };
        this._users.push(newUser);
        this._saveUsers();
        return { success: true, message: "Реєстрація успішна!" };
    }

    authenticateUser(email, password) {
        const user = this._users.find(u => u.email === email.toLowerCase());
        if (user && user.password === password) {
            this.setCurrentUserEmail(user.email);
            return { success: true, user };
        }
        return { success: false, message: "Неправильний email або пароль." };
    }

    isLoggedIn() {
        return !!this._currentUserEmail;
    }

    logout() {
        this.setCurrentUserEmail(null);
    }
}