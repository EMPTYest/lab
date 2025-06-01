export class ProfileView {
    constructor() {
        this.profilePage = document.getElementById('page-profile');
        if (this.profilePage) {
            this.profileTableBody = this.profilePage.querySelector('.profile-table tbody'); 

            this.editProfileButton = this.profilePage.querySelector('.button[href="#"]'); 
            this.deleteAccountButton = this.profilePage.querySelector('.button[style*="dc3545"]'); 
        }
    }

    displayUserProfile(userData) {
        if (!this.profileTableBody || !userData) {
            if (this.profileTableBody) { 
                 this.profileTableBody.innerHTML = '<tr><td colspan="2">Не вдалося завантажити дані профілю.</td></tr>';
            }
            console.error("ProfileView: Неможливо відобразити профіль. Елемент таблиці або дані користувача відсутні.");
            return;
        }

        // Очищуємо попередні дані, якщо вони були
        this.profileTableBody.innerHTML = '';

        // Додаємо рядки з даними
        this.profileTableBody.innerHTML = `
            <tr>
                <td>Ім’я:</td>
                <td>${userData.name || 'Не вказано'}</td>
            </tr>
            <tr>
                <td>Email:</td>
                <td>${userData.email || 'Не вказано'}</td>
            </tr>
            <tr>
                <td>Стать:</td>
                <td>${userData.gender ? (userData.gender === 'male' ? 'Чоловіча' : userData.gender === 'female' ? 'Жіноча' : 'Інша') : 'Не вказано'}</td>
            </tr>
            <tr>
                <td>Дата народження:</td>
                <td>${userData.dob || 'Не вказано'}</td>
            </tr>
            <tr>
                <td>Дата реєстрації:</td>
                <td>${userData.registrationDate || 'Невідомо'}</td>
            </tr>
            <tr>
                <td>Вивчено слів:</td>
                <td>${userData.learnedWords ? userData.learnedWords.length : 0}</td>
            </tr>
            <tr>
                <td>Останній вхід:</td>
                <td>[Зараз]</td> <!-- Це статично, для реального потрібен бекенд або складніша логіка -->
            </tr>
        `;
    }

}