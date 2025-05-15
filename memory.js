document.addEventListener('DOMContentLoaded', function() {
    const memoryBoard = document.getElementById('memory-board');
    const timerDisplay = document.querySelector('.memory-timer');
    const difficultyBtns = document.querySelectorAll('#memory-game-window .difficulty-btn');
    const gameResult = document.querySelector('.game-result'); 

    let cards = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];
    let flippedCards = [];
    let matchedCards = [];
    let timer;
    let timeLeft = 60;
    let gameActive = false;
    
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    
    function createBoard() {
        memoryBoard.innerHTML = '';
        flippedCards = [];
        matchedCards = [];
        
        const shuffledCards = shuffleArray([...cards, ...cards]);
        
        shuffledCards.forEach((card, index) => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('memory-card');
            cardElement.dataset.index = index;
            cardElement.dataset.value = card;
            cardElement.addEventListener('click', flipCard);
            memoryBoard.appendChild(cardElement);
        });
    }
    
    function flipCard() {
        if (!gameActive) return;
        
        const card = this;
        
        if (flippedCards.length === 2 || card.classList.contains('flipped') || card.classList.contains('matched')) {
            return;
        }
        
        card.classList.add('flipped');
        card.textContent = card.dataset.value;
        flippedCards.push(card);
        
        if (flippedCards.length === 2) {
            const [firstCard, secondCard] = flippedCards;
            
            if (firstCard.dataset.value === secondCard.dataset.value) {
                firstCard.classList.add('matched');
                secondCard.classList.add('matched');
                matchedCards.push(firstCard, secondCard);
                flippedCards = [];
                
                if (matchedCards.length === cards.length * 2) {
                    clearInterval(timer);
                    setTimeout(() => {
                        showGameResult('Поздравляем! Вы выиграли!');
                    }, 500);
                }
            } else {
                setTimeout(() => {
                    firstCard.classList.remove('flipped');
                    secondCard.classList.remove('flipped');
                    firstCard.textContent = '';
                    secondCard.textContent = '';
                    flippedCards = [];
                }, 1000);
            }
        }
    }
    
    function startTimer() {
        clearInterval(timer);
        timerDisplay.textContent = `Time: ${timeLeft}`;
        
        timer = setInterval(() => {
            timeLeft--;
            timerDisplay.textContent = `Time: ${timeLeft}`;
            
            if (timeLeft <= 0) {
                clearInterval(timer);
                gameActive = false;
                showGameResult("Time's up! Try again.");
            }
        }, 1000);
    }
    
    function showGameResult(message) {
        gameResult.textContent = message;  
        gameResult.style.display = 'block';
    }
    
    function startGame(difficulty) {
        if (difficulty === 'easy') timeLeft = 60;
        else if (difficulty === 'medium') timeLeft = 40;
        else if (difficulty === 'hard') timeLeft = 20;
        
        createBoard();
        startTimer();
        gameActive = true;
        gameResult.style.display = 'none'; 
    }
    
    difficultyBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            difficultyBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            startGame(this.dataset.difficulty);
        });
    });
    
    difficultyBtns[0].click(); 
});