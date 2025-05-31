export class AuthView {
    constructor() {
        // Елементи для сторінки реєстрації
        this.registerPage = document.getElementById('page-register');
        if (this.registerPage) {
            this.registerForm = this.registerPage.querySelector('form');
            this.nameInput = this.registerPage.querySelector('#name');
            this.registerEmailInput = this.registerPage.querySelector('#email');
            this.genderInput = this.registerPage.querySelector('#gender');
            this.dobInput = this.registerPage.querySelector('#dob');
            this.registerPasswordInput = this.registerPage.querySelector('#password');
            this.confirmPasswordInput = this.registerPage.querySelector('#confirm_password');
            this.registerErrorEl = this.registerPage.querySelector('#register-error');
        }

        // Елементи для сторінки входу
        this.loginPage = document.getElementById('page-login');
        if (this.loginPage) {
            this.loginForm = this.loginPage.querySelector('form');
            this.loginEmailInput = this.loginPage.querySelector('#email');
            this.loginPasswordInput = this.loginPage.querySelector('#password');
            this.loginErrorEl = this.loginPage.querySelector('#login-error');
        }
    }

    getRegisterFormData() {
        if (!this.registerForm) return null;
        return {
            name: this.nameInput.value.trim(),
            email: this.registerEmailInput.value.trim(),
            gender: this.genderInput.value,
            dob: this.dobInput.value,
            password: this.registerPasswordInput.value,
            confirmPassword: this.confirmPasswordInput.value
        };
    }

    getLoginFormData() {
        if (!this.loginForm) return null;
        return {
            email: this.loginEmailInput.value.trim(),
            password: this.loginPasswordInput.value
        };
    }

    displayRegisterError(message) {
        if (this.registerErrorEl) {
            this.registerErrorEl.textContent = message;
        }
    }

    displayLoginError(message) {
        if (this.loginErrorEl) {
            this.loginErrorEl.textContent = message;
        }
    }

    clearRegisterErrors() {
        if (this.registerErrorEl) this.registerErrorEl.textContent = '';
    }

    clearLoginErrors() {
        if (this.loginErrorEl) this.loginErrorEl.textContent = '';
    }


    bindRegister(handler) {
        if (this.registerForm) {
            this.registerForm.addEventListener('submit', event => {
                event.preventDefault();
                handler(this.getRegisterFormData());
            });
        }
    }

    bindLogin(handler) {
        if (this.loginForm) {
            this.loginForm.addEventListener('submit', event => {
                event.preventDefault();
                handler(this.getLoginFormData());
            });
        }
    }
}