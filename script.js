document.addEventListener('DOMContentLoaded', () => {

    // 1. Controle do Preloader Avançado
    const preloader = document.querySelector('.preloader');
    window.addEventListener('load', () => {
        dismissPreloader();
    });

    // Fallback de proteção do preloader caso recursos externos atrasem
    setTimeout(() => {
        dismissPreloader();
    }, 2500);

    function dismissPreloader() {
        if (preloader && preloader.style.display !== 'none') {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }
    }

    // 2. Menu de Navegação Mobile
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileMenu && navMenu) {
        mobileMenu.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // 3. Sistema de Abas Estratégico com Proteção contra Cliques Rápidos
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');
    let isTabThrottled = false;

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (isTabThrottled || button.classList.contains('active')) return;
            isTabThrottled = true;

            const targetTab = button.getAttribute('data-tab');

            // Gerenciamento de classes dos botões
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Transição suave e controlada dos painéis
            tabPanels.forEach(panel => {
                if (panel.classList.contains('active')) {
                    panel.style.opacity = '0';
                    setTimeout(() => {
                        panel.classList.remove('active');
                        
                        const newPanel = document.getElementById(targetTab);
                        if (newPanel) {
                            newPanel.classList.add('active');
                            // Força a renderização do motor antes de animar opacidade
                            newPanel.offsetHeight; 
                            newPanel.style.opacity = '1';
                        }
                        isTabThrottled = false;
                    }, 400);
                }
            });
        });
    });

    // 4. Mecanismo de Filtro Tático da Galeria
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    let isFilterThrottled = false;

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (isFilterThrottled || button.classList.contains('active')) return;
            isFilterThrottled = true;

            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            galleryItems.forEach(item => {
                const isMatch = filterValue === 'all' || item.getAttribute('data-category') === filterValue;
                
                if (isMatch) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 40);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.85)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 350);
                }
            });

            setTimeout(() => {
                isFilterThrottled = false;
            }, 400);
        });
    });

    // 5. Janela Modal Lightbox para o Acervo Real
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.querySelector('.lightbox-close');

    if (lightbox && lightboxImg && lightboxClose) {
        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                const imgElement = item.querySelector('img');
                const titleElement = item.querySelector('h4');
                const pElement = item.querySelector('p');

                if (imgElement) {
                    lightboxImg.setAttribute('src', imgElement.getAttribute('src'));
                    lightboxCaption.innerHTML = `<strong>${titleElement ? titleElement.innerText : ''}</strong> — ${pElement ? pElement.innerText : ''}`;
                    lightbox.style.display = 'block';
                }
            });
        });

        lightboxClose.addEventListener('click', () => {
            lightbox.style.display = 'none';
        });

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.style.display = 'none';
            }
        });
    }

    // 6. Monitoramento de Scroll para Links de Navegação Ativos
    const navSections = document.querySelectorAll('section, header');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;

        navSections.forEach(section => {
            const sectionTop = section.offsetTop - 160;
            if (scrollPosition >= sectionTop) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (currentSectionId && link.getAttribute('href').includes(currentSectionId)) {
                link.classList.add('active');
            }
        });
    });
});
