document.addEventListener('DOMContentLoaded', function() {
    // Навигация
    const homeLink = document.getElementById('home-link');
    const aboutLink = document.getElementById('about-link');
    const contactLink = document.getElementById('contact-link');
    const aboutPage = document.getElementById('about-page');
    const mainContent = document.getElementById('main-content');
    
    homeLink.addEventListener('click', function(e) {
        e.preventDefault();
        aboutPage.style.display = 'none';
        mainContent.style.display = 'block';
        window.scrollTo(0, 0);
    });
    
    aboutLink.addEventListener('click', function(e) {
        e.preventDefault();
        mainContent.style.display = 'none';
        aboutPage.style.display = 'block';
        window.scrollTo(0, 0);
    });
    
    contactLink.addEventListener('click', function(e) {
        e.preventDefault();
        document.getElementById('contact-modal').style.display = 'flex';
    });
    
    // Модальное окно контактов
    const contactModal = document.getElementById('contact-modal');
    const closeModalBtn = contactModal.querySelector('.close-btn');
    
    closeModalBtn.addEventListener('click', function() {
        contactModal.style.display = 'none';
    });
    
    window.addEventListener('click', function(e) {
        if (e.target === contactModal) {
            contactModal.style.display = 'none';
        }
    });
    
    // Игровые карточки
    const gameCards = document.querySelectorAll('.game-card');
    const gameWindows = document.querySelectorAll('.game-window');
    const closeGameBtns = document.querySelectorAll('.close-game');
    
    const gameLoaders = {
        'memory-game-window': {
            loaded: false,
            init: () => {
                if (!gameLoaders['memory-game-window'].loaded) {
                    initMemoryGame(); // Функция внутри memory.js
                    gameLoaders['memory-game-window'].loaded = true;
                }
            },
            reset: () => {
                // Сбрасываем игру для повторного запуска
                gameLoaders['memory-game-window'].loaded = false;
                document.getElementById('memory-board').innerHTML = ''; // Очистим доску
            }
        },
        'tetris-window': {
            loaded: false,
            init: () => {
                if (!gameLoaders['tetris-window'].loaded) {
                    initTetrisGame(); // Функция внутри tetris.js
                    gameLoaders['tetris-window'].loaded = true;
                }
            },
            reset: () => {
                // Сбрасываем игру для повторного запуска
                gameLoaders['tetris-window'].loaded = false;
                document.getElementById('tetris-board').getContext('2d').clearRect(0, 0, 300, 600); // Очистим игровое поле
                document.getElementById('tetris-next-piece').getContext('2d').clearRect(0, 0, 100, 100); // Очистим следующую фигуру
            }
        }
    };

    gameCards.forEach(card => {
        card.querySelector('.play-btn').addEventListener('click', function(e) {
            e.stopPropagation(); // Чтобы не срабатывал клик на всю карточку
            const gameId = card.id.replace('-card', '-window');
            const gameWindow = document.getElementById(gameId);
            
            gameWindow.classList.add('active');
            
            // Сброс состояния перед инициализацией
            if (gameLoaders[gameId]) {
                gameLoaders[gameId].reset();
                gameLoaders[gameId].init(); // запуск игры
            }
        });
    });
    
    closeGameBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const gameWindow = this.closest('.game-window');
            gameWindow.classList.remove('active');
            
            // Разблокируем кнопку "Play"
            const gameCardId = gameWindow.id.replace('-window', '-card');
            const playButton = document.querySelector(`#${gameCardId} .play-btn`);
            playButton.disabled = false; // Разблокируем кнопку
        });
    });
    
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('game-window')) {
            e.target.style.display = 'none';
        }
    });
});