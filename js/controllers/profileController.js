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
           
            console.error("ProfileController: Немає поточного користувача для відображення профілю.");
            
            
        }
    }

    
}