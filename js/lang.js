// Language switcher for pesce-mignon
(function() {
    const lang = localStorage.getItem('lang') || 'en';
    document.documentElement.classList.add(lang + '-lang');
    
    function setLang(l) {
        document.documentElement.classList.remove('en-lang', 'fr-lang');
        document.documentElement.classList.add(l + '-lang');
        localStorage.setItem('lang', l);
        updateLangLinks();
    }
    
    function updateLangLinks() {
        const current = localStorage.getItem('lang') || 'en';
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
        switcher.innerHTML = `
            <a href="#" data-lang="en">EN</a>
            <a href="#" data-lang="fr">FR</a>
        `;
        header.appendChild(switcher);
        
        switcher.addEventListener('click', function(e) {
            e.preventDefault();
            const target = e.target.closest('a');
            if (target && target.dataset.lang) {
                setLang(target.dataset.lang);
            }
        });
        
        updateLangLinks();
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createSwitcher);
    } else {
        createSwitcher();
    }
})();
