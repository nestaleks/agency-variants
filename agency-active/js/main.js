// Main script for Estate Company Website

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize language based on stored preference or default to English
    const storedLang = localStorage.getItem('language') || 'en';
    changeLang(storedLang);
    
    // Setup language selector
    setupLanguageSelector();
    
    // Setup mobile menu
    setupMobileMenu();

    // Load gallery items for about page
    loadGalleryItems();
    
    // Load news items for about page
    loadNewsItems();
});

// Setup language selector functionality
function setupLanguageSelector() {
    const langLinks = document.querySelectorAll('.language-dropdown a');
    const languageSelector = document.querySelector('.language-selector');
    
    langLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const lang = this.getAttribute('data-lang');
            
            // Update active class
            langLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Update current language display
            const currentLangElement = document.querySelector('.current-lang');
            if (currentLangElement) {
                currentLangElement.textContent = lang.toUpperCase();
            }
            
            // Change language
            changeLang(lang);
            
            // Close language dropdown and mobile menu if open
            if (languageSelector) {
                languageSelector.classList.remove('active');
            }
            const menu = document.querySelector('.menu');
            if (menu) {
                menu.classList.remove('active');
            }
        });
    });
    
    // Toggle language dropdown
    if (languageSelector) {
        languageSelector.addEventListener('click', function(e) {
            // Only toggle if clicking on the selector itself, not the dropdown links
            if (e.target.closest('.language-dropdown a')) return;
            this.classList.toggle('active');
        });
    }
    
    // Close language dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.language-selector')) {
            languageSelector?.classList.remove('active');
        }
    });
    
    // Set initial language state
    const storedLang = localStorage.getItem('language') || 'en';
    const activeLink = document.querySelector(`.language-dropdown a[data-lang="${storedLang}"]`);
    if (activeLink) {
        langLinks.forEach(l => l.classList.remove('active'));
        activeLink.classList.add('active');
        const currentLangElement = document.querySelector('.current-lang');
        if (currentLangElement) {
            currentLangElement.textContent = storedLang.toUpperCase();
        }
    }
}

// Setup mobile menu functionality
function setupMobileMenu() {
    const menuBtn = document.querySelector('.menu__btn');
    const menu = document.querySelector('.menu__list');
    const menuCloseBtn = document.querySelector('.menu__close-btn');
    
    if (menuBtn && menu) {
        menuBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            menu.classList.add('active');
        });
    }
    
    if (menuCloseBtn && menu) {
        menuCloseBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            menu.classList.remove('active');
        });
    }
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (menu?.classList.contains('active') && !e.target.closest('.menu__list') && !e.target.closest('.menu__btn')) {
            menu.classList.remove('active');
        }
    });
}

// Change language functionality
function changeLang(lang) {
    if (!window.translations) {
        console.error('Translations not loaded');
        return;
    }
    
    // Store language preference
    localStorage.setItem('language', lang);
    
    // Update all translatable elements
    const elements = document.querySelectorAll('[data-key]');
    
    elements.forEach(element => {
        const key = element.getAttribute('data-key');
        
        // Check if we have this translation
        if (window.translations[key] && window.translations[key][lang]) {
            const translation = window.translations[key][lang];
            
            // Handle different element types
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                if (element.getAttribute('placeholder')) {
                    element.setAttribute('placeholder', translation);
                } else {
                    element.value = translation;
                }
            } else {
                element.textContent = translation;
            }
        }
    });
    
    // Dispatch event for other scripts that might need to know about language change
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));
}

// Smooth scrolling for anchor links
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (this.getAttribute('href') === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                const mainNav = document.querySelector('.main-nav');
                if (mainNav) {
                    mainNav.classList.remove('active');
                }
            }
        });
    });
});

// Accordion functionality
function toggleAccordion() {
    const accordion = document.getElementById("accordion");
    accordion.classList.toggle("open");
}

//кнопка Наверх
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        document.getElementById("upBtn").style.display = "block";
    } else {
        document.getElementById("upBtn").style.display = "none";
    }
};

// Обработка модальных окон
$(document).ready(function() {
    // Открытие модального окна
    $('.listing__item').on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        const modalId = $(this).data('modal-trigger');
        $(`#${modalId}`).addClass('active');
        $('body').addClass('modal-open');
    });

    // Закрытие модального окна
    $('.modal__close').on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        $(this).closest('.modal').removeClass('active');
        $('body').removeClass('modal-open');
    });

    $('.modal').on('click', function(e) {
        if ($(e.target).hasClass('modal')) {
            e.preventDefault();
            e.stopPropagation();
            $(this).removeClass('active');
            $('body').removeClass('modal-open');
        }
    });

    // Закрытие по Escape
    $(document).on('keydown', function(e) {
        if (e.key === 'Escape') {
            $('.modal.active').removeClass('active');
            $('body').removeClass('modal-open');
        }
    });
});

// Инициализация галереи проекта
$(document).ready(function() {
    $('.popup-gallery').magnificPopup({
        delegate: 'img',
        type: 'image',
        mainClass: 'mfp-with-zoom',
        removalDelay: 300,
        gallery: {
            enabled: true,
            navigateByImgClick: true,
            preload: [1, 1]
        },
        image: {
            verticalFit: true,
            titleSrc: function(item) {
                return item.el.attr('alt');
            }
        },
        callbacks: {
            open: function() {
                var self = this;
                
                // Обработчик клика по фону — только если клик пришёл прямо по обёртке (не по стрелкам/контенту)
                $('.mfp-wrap').off('click.mfpWrap').on('click.mfpWrap', function(e) {
                    if (e.target === this) {
                        $.magnificPopup.close();
                    }
                });

                // Принудительное центрирование
                this.container.css({
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                });

                this.contentContainer.css({
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '100%'
                });
            }
        },
        closeOnBgClick: true,
        fixedContentPos: true
    });
});

// Функция для загрузки элементов галереи
function loadGalleryItems() {
    const galleryItems = document.querySelector('.gallery__items');
    const isAboutPage = window.location.pathname.includes('about.html');
    
    if (galleryItems) {
        fetch('./gallery.html')
            .then(response => response.text())
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const items = Array.from(doc.querySelectorAll('.gallery__items .gallery__item'));
                
                // Очищаем текущее содержимое
                galleryItems.innerHTML = '';
                
                // На странице about показываем только первые 3 элемента
                const itemsToShow = isAboutPage ? items.slice(0, 3) : items;
                
                itemsToShow.forEach(item => {
                    const newItem = item.cloneNode(true);
                    
                    // Исправляем пути к изображениям
                    const img = newItem.querySelector('img');
                    if (img && img.src) {
                        const srcParts = img.src.split('/gallery/');
                        if (srcParts.length > 1) {
                            img.src = `./images/gallery/${srcParts[1]}`;
                        }
                    }
                    
                    galleryItems.appendChild(newItem);
                });
                
                // Инициализируем Magnific Popup для галереи
                if (!isAboutPage) {
                    $('.popup-gallery').magnificPopup({
                        delegate: 'a',
                        type: 'image',
                        gallery: {
                            enabled: true
                        }
                    });
                }
            })
            .catch(error => console.error('Ошибка загрузки галереи:', error));
    }
}

// Функция для загрузки элементов новостей
function loadNewsItems() {
    const newsItems = document.querySelector('.news__items');
    const isAboutPage = window.location.pathname.includes('about.html');
    
    if (newsItems) {
        fetch('./news.html')
            .then(response => response.text())
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const items = Array.from(doc.querySelectorAll('.news__items .news__item'));
                
                // Очищаем текущее содержимое
                newsItems.innerHTML = '';
                
                // На странице about показываем только первые 3 элемента
                const itemsToShow = isAboutPage ? items.slice(0, 3) : items;
                
                itemsToShow.forEach(item => {
                    const newItem = item.cloneNode(true);
                    
                    // Исправляем пути к изображениям
                    const img = newItem.querySelector('img');
                    if (img && img.src) {
                        const srcParts = img.src.split('/news/');
                        if (srcParts.length > 1) {
                            img.src = `./images/news/${srcParts[1]}`;
                        }
                    }
                    
                    // Исправляем пути к ссылкам
                    const link = newItem.getAttribute('href');
                    if (link && link.startsWith('./')) {
                        newItem.setAttribute('href', link.replace('./', './news/'));
                    }
                    
                    newsItems.appendChild(newItem);
                });
            })
            .catch(error => console.error('Ошибка загрузки новостей:', error));
    }
}


//кнопка Наверх

window.onscroll = function() {scrollFunction()};

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        document.getElementById("upBtn").style.display = "block";
    } else {
        document.getElementById("upBtn").style.display = "none";
    }
};

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
};