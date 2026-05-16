// Include system for pesce-mignon with language support
// Usage: Add <div data-include="path/to/file.html"></div> to your HTML
(function() {
    const lang = localStorage.getItem('lang') || 'en';
    
    function includeHTML() {
        const elements = document.querySelectorAll('[data-include]');
        
        // First pass: load all includes
        Promise.all(Array.from(elements).map(el => {
            const file = el.dataset.include;
            return fetch(file)
                .then(response => response.text())
                .then(html => {
                    el.outerHTML = html;
                })
                .catch(err => console.error('Include error:', err));
        }))
        .then(() => {
            // After includes are loaded, set up language
            setupLanguage();
        });
    }
    
    function setupLanguage() {
        // Set language class on html element
        document.documentElement.classList.remove('en-lang', 'fr-lang');
        document.documentElement.classList.add(lang + '-lang');
        
        // Add language switcher to header
        const header = document.querySelector('header');
        if (header) {
            const switcher = document.createElement('div');
            switcher.className = 'lang-switcher';
            switcher.innerHTML = `
                <a href="#" data-lang="en" class="${lang === 'en' ? 'active' : ''}">EN</a>
                <a href="#" data-lang="fr" class="${lang === 'fr' ? 'active' : ''}">FR</a>
            `;
            header.appendChild(switcher);
            
            switcher.addEventListener('click', function(e) {
                e.preventDefault();
                const target = e.target.closest('a');
                if (target && target.dataset.lang) {
                    setLang(target.dataset.lang);
                }
            });
        }
        
        // Fix home link based on current path
        fixHomeLink();
    }
    
    function setLang(l) {
        localStorage.setItem('lang', l);
        document.documentElement.classList.remove('en-lang', 'fr-lang');
        document.documentElement.classList.add(l + '-lang');
        
        // Update switcher active state
        const links = document.querySelectorAll('.lang-switcher a');
        links.forEach(link => {
            link.classList.toggle('active', link.dataset.lang === l);
        });
    }
    
    function fixHomeLink() {
        const homeLink = document.getElementById('home-link');
        if (!homeLink) return;
        
        const path = window.location.pathname;
        const isRoot = path === '/' || path === '' || path === '/index.html';
        
        if (isRoot) {
            homeLink.href = '.';
        } else {
            const parts = path.split('/').filter(Boolean);
            homeLink.href = '../'.repeat(parts.length);
        }
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', includeHTML);
    } else {
        includeHTML();
    }
    
    // Also run setupLanguage if already loaded (for direct script calls)
    if (document.readyState !== 'loading') {
        setTimeout(setupLanguage, 100);
    }
})();
