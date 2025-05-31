export class ProfileController {
    constructor(userModel, profileView) {
        this.userModel = userModel;
        this.profileView = profileView;

        this.loadProfileData();

 
    }

    loadProfileData() {
        const currentUser = this.userModel.getCurrentUser();
        if (currentUser) {
            this.profileView.displayUserProfile(currentUser);
        } else {
            // Це не повинно статися, якщо protectRoute в app.js працює
            console.error("ProfileController: Немає поточного користувача для відображення профілю.");
            // Можна перенаправити на логін для безпеки
            // window.location.href = 'login.html';
        }
    }

    
}