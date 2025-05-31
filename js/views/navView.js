export class NavView {
    constructor() {
        this.navLoggedIn = document.getElementById('nav-loggedIn');
        this.navLoggedOut = document.getElementById('nav-loggedOut');
        this.logoutLink = document.getElementById('logout-link');
        this.allNavLi = document.querySelectorAll('header nav ul li'); // Для .current
    }

    updateNav(isLoggedIn) {
        if (this.navLoggedIn && this.navLoggedOut) {
            this.navLoggedIn.style.display = isLoggedIn ? 'contents' : 'none';
            this.navLoggedOut.style.display = isLoggedIn ? 'none' : 'contents';
        }
        this.setCurrentPageClass(); // Оновлюємо клас .current при зміні статусу логіну
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
        if (this.navLoggedIn.style.display !== 'none') { // Шукаємо в видимій частині
            activeLink = this.navLoggedIn.querySelector(`a[href="${currentPageFile}"]`);
        }
        if (!activeLink && this.navLoggedOut.style.display !== 'none') { // Шукаємо в іншій видимій частині
            activeLink = this.navLoggedOut.querySelector(`a[href="${currentPageFile}"]`);
        }
        // Для загальних посилань, які не в navLoggedIn/navLoggedOut (якщо такі є)
        if (!activeLink) {
             activeLink = document.querySelector(`header nav ul > li > a[href="${currentPageFile}"]`);
        }


        if (activeLink && activeLink.parentElement.tagName === 'LI') {
            activeLink.parentElement.classList.add('current');
        }
    }
}