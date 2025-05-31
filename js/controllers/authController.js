export class AuthController {
    constructor(userModel, authView) {
        this.userModel = userModel;
        this.authView = authView;

        // Прив'язка обробників з View до методів контролера
        if (this.authView.registerForm) {
            this.authView.bindRegister(this.handleRegister.bind(this));
        }
        if (this.authView.loginForm) {
            this.authView.bindLogin(this.handleLogin.bind(this));
        }
    }

    handleRegister(formData) {
        this.authView.clearRegisterErrors();
        if (formData.password !== formData.confirmPassword) {
            this.authView.displayRegisterError('Паролі не співпадають.');
            return;
        }
        
        const result = this.userModel.addUser(formData);

        if (result.success) {
            alert(result.message); // Або краще повідомлення через View
            window.location.href = 'login.html';
        } else {
            this.authView.displayRegisterError(result.message);
        }
    }

    handleLogin(formData) {
        this.authView.clearLoginErrors();
        if (!formData.email || !formData.password) {
            this.authView.displayLoginError("Будь ласка, введіть email та пароль.");
            return;
        }

        const result = this.userModel.authenticateUser(formData.email, formData.password);

        if (result.success) {
            // Сповіщення про успішний вхід вже обробляється в UserModel через setCurrentUserEmail,
            // і App.js підписаний на ці зміни для оновлення NavView та перенаправлення.
            window.location.href = 'profile.html'; // Або app.html
        } else {
            this.authView.displayLoginError(result.message);
        }
    }
}