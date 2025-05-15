document.addEventListener('DOMContentLoaded', function() {
    const boardElement = document.getElementById('tic-tac-toe-board');
    const statusElement = document.getElementById('tic-tac-toe-status');
    const difficultyBtns = document.querySelectorAll('#tic-tac-toe-window .difficulty-btn');
    
    let boardSize = 3;
    let board = [];
    let currentPlayer = 'X';
    let gameOver = false;
    
    function createBoard() {
        boardElement.innerHTML = '';
        boardElement.style.gridTemplateColumns = `repeat(${boardSize}, 1fr)`;
        
        board = Array(boardSize).fill().map(() => Array(boardSize).fill(''));
        
        for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j < boardSize; j++) {
                const cell = document.createElement('div');
                cell.classList.add('tic-tac-toe-cell');
                cell.dataset.row = i;
                cell.dataset.col = j;
                cell.addEventListener('click', handleCellClick);
                boardElement.appendChild(cell);
            }
        }
        
        statusElement.textContent = `Your move (${currentPlayer})`;
        gameOver = false;
    }
    
    function handleCellClick() {
        if (gameOver) return;
        
        const row = parseInt(this.dataset.row);
        const col = parseInt(this.dataset.col);
        
        if (board[row][col] !== '') return;
        
        board[row][col] = currentPlayer;
        this.textContent = currentPlayer;
        this.classList.add(currentPlayer.toLowerCase());
        
        if (checkWin(currentPlayer)) {
            statusElement.textContent = `Player ${currentPlayer} won!`;
            gameOver = true;
            return;
        }
        
        if (checkDraw()) {
            statusElement.textContent = 'A draw!';
            gameOver = true;
            return;
        }
        
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        statusElement.textContent = `Your move (${currentPlayer})`;
    }
    
    function checkWin(player) {
        for (let i = 0; i < boardSize; i++) {
            if (board[i].every(cell => cell === player)) return true;
        }
        
        for (let j = 0; j < boardSize; j++) {
            let columnWin = true;
            for (let i = 0; i < boardSize; i++) {
                if (board[i][j] !== player) {
                    columnWin = false;
                    break;
                }
            }
            if (columnWin) return true;
        }
        
        let diagonal1Win = true;
        let diagonal2Win = true;
        for (let i = 0; i < boardSize; i++) {
            if (board[i][i] !== player) diagonal1Win = false;
            if (board[i][boardSize - 1 - i] !== player) diagonal2Win = false;
        }
        
        return diagonal1Win || diagonal2Win;
    }
    
    function checkDraw() {
        return board.flat().every(cell => cell !== '');
    }
    
    difficultyBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            difficultyBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            boardSize = parseInt(this.dataset.size);
            createBoard();
        });
    });
    
    difficultyBtns[0].click();
});
