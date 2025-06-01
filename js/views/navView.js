export class NavView {
    constructor() {
        this.navLoggedIn = document.getElementById('nav-loggedIn');
        this.navLoggedOut = document.getElementById('nav-loggedOut');
        this.logoutLink = document.getElementById('logout-link');
        this.allNavLi = document.querySelectorAll('header nav ul li'); 
    }

    updateNav(isLoggedIn) {
        if (this.navLoggedIn && this.navLoggedOut) {
            this.navLoggedIn.style.display = isLoggedIn ? 'contents' : 'none';
            this.navLoggedOut.style.display = isLoggedIn ? 'none' : 'contents';
        }
        this.setCurrentPageClass(); 
    }

    bindLogout(handler) {
        if (this.logoutLink) {
            this.logoutLink.addEventListener('click', (event) => {
                event.preventDefault();
                handler();
            });
        }
    }

    setCurrentPageClass() {
        const currentPageFile = window.location.pathname.split('/').pop() || 'index.html';
        this.allNavLi.forEach(li => li.classList.remove('current'));

        let activeLink;
        if (this.navLoggedIn.style.display !== 'none') { 
            activeLink = this.navLoggedIn.querySelector(`a[href="${currentPageFile}"]`);
        }
        if (!activeLink && this.navLoggedOut.style.display !== 'none') { 
            activeLink = this.navLoggedOut.querySelector(`a[href="${currentPageFile}"]`);
        }
      
        if (!activeLink) {
             activeLink = document.querySelector(`header nav ul > li > a[href="${currentPageFile}"]`);
        }


        if (activeLink && activeLink.parentElement.tagName === 'LI') {
            activeLink.parentElement.classList.add('current');
        }
    }
}