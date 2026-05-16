// Language switcher for pesce-mignon - path-based
// /fr/... = French, /en/... or / = English
(function() {
    function getLangFromPath() {
        const path = window.location.pathname;
        if (path.startsWith('/fr/') || path === '/fr') return 'fr';
        if (path.startsWith('/en/') || path === '/en') return 'en';
        return 'en'; // default
    }
    
    function getLang() {
        // Priority: URL path > localStorage > default
        const pathLang = getLangFromPath();
        if (pathLang !== 'en') return pathLang;
        return localStorage.getItem('lang') || 'en';
    }
    
    const lang = getLang();
    document.documentElement.classList.add(lang + '-lang');
    
    function setLang(l) {
        document.documentElement.classList.remove('en-lang', 'fr-lang');
        document.documentElement.classList.add(l + '-lang');
        localStorage.setItem('lang', l);
        updateLangLinks();
    }
    
    function updateLangLinks() {
        const current = getLang();
        const links = document.querySelectorAll('.lang-switcher a');
        links.forEach(link => {
            link.classList.toggle('active', link.dataset.lang === current);
        });
    }
    
    function createSwitcher() {
        const header = document.querySelector('header');
        if (!header) return;
        
        const existing = header.querySelector('.lang-switcher');
        if (existing) return;
        
        const switcher = document.createElement('div');
        switcher.className = 'lang-switcher';
        const current = getLang();
        switcher.innerHTML = `
            <a href="#" data-lang="en" class="${current === 'en' ? 'active' : ''}">EN</a>
            <span class="lang-sep">/</span>
            <a href="#" data-lang="fr" class="${current === 'fr' ? 'active' : ''}">FR</a>
        `;
        header.appendChild(switcher);
        
        switcher.addEventListener('click', function(e) {
            e.preventDefault();
            const target = e.target.closest('a');
            if (target && target.dataset.lang) {
                changeLanguage(target.dataset.lang);
            }
        });
        
        updateLangLinks();
    }
    
    function changeLanguage(l) {
        const currentPath = window.location.pathname;
        const currentLang = getLangFromPath();
        
        let newPath;
        if (l === 'en') {
            // Remove /fr/ prefix if present
            newPath = currentPath.replace(/^\/fr\//, '/').replace(/^\/fr$/, '/');
        } else {
            // Add /fr/ prefix if not present
            if (currentPath.startsWith('/fr/')) {
                newPath = currentPath;
            } else if (currentPath === '/') {
                newPath = '/fr/';
            } else if (currentPath.startsWith('/en/')) {
                newPath = currentPath.replace(/^\/en\//, '/fr/').replace(/^\/en$/, '/fr');
            } else {
                newPath = '/fr' + currentPath;
            }
        }
        
        // Preserve hash and query
        const hash = window.location.hash;
        const query = window.location.search;
        
        window.location.href = newPath + query + hash;
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createSwitcher);
    } else {
        createSwitcher();
    }
})();
