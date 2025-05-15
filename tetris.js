document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('tetris-board');
    const ctx = canvas.getContext('2d');
    const nextPieceCanvas = document.getElementById('tetris-next-piece');
    const nextPieceCtx = nextPieceCanvas.getContext('2d');
    const scoreElement = document.getElementById('tetris-score');
    
    const blockSize = 30;
    const cols = canvas.width / blockSize;
    const rows = canvas.height / blockSize;
    
    let board = Array(rows).fill().map(() => Array(cols).fill(0));
    let currentPiece = null;
    let nextPiece = null;
    let score = 0;
    let gameInterval;
    let dropSpeed = 1000;
    
    const pieces = [
        [[1, 1, 1, 1]], // I
        [[1, 1], [1, 1]], // O
        [[0, 1, 0], [1, 1, 1]], // T
        [[1, 0, 0], [1, 1, 1]], // L
        [[0, 0, 1], [1, 1, 1]], // J
        [[0, 1, 1], [1, 1, 0]], // S
        [[1, 1, 0], [0, 1, 1]]  // Z
    ];
    
    const colors = [
        '#FF6B6B', '#4ECDC4', '#FFE66D', '#A58BFF', '#FFB347', '#7AE7B9', '#FF85A2'
    ];
    
    function createPiece() {
        const piece = pieces[Math.floor(Math.random() * pieces.length)];
        const color = colors[pieces.indexOf(piece)];
        
        return {
            shape: piece,
            color: color,
            x: Math.floor(cols / 2) - Math.floor(piece[0].length / 2),
            y: 0
        };
    }
    
    function drawBoard() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                if (board[y][x]) {
                    ctx.fillStyle = board[y][x];
                    ctx.fillRect(x * blockSize, y * blockSize, blockSize, blockSize);
                    ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
                    ctx.strokeRect(x * blockSize, y * blockSize, blockSize, blockSize);
                }
            }
        }
        
        if (currentPiece) {
            drawPiece(currentPiece, ctx);
        }
    }
    
    function drawNextPiece() {
        nextPieceCtx.clearRect(0, 0, nextPieceCanvas.width, nextPieceCanvas.height);
        
        if (nextPiece) {
            const offsetX = (nextPieceCanvas.width / blockSize - nextPiece.shape[0].length) / 2;
            const offsetY = (nextPieceCanvas.height / blockSize - nextPiece.shape.length) / 2;
            
            drawPiece({
                shape: nextPiece.shape,
                color: nextPiece.color,
                x: offsetX,
                y: offsetY
            }, nextPieceCtx);
        }
    }
    
    function drawPiece(piece, context) {
        for (let y = 0; y < piece.shape.length; y++) {
            for (let x = 0; x < piece.shape[y].length; x++) {
                if (piece.shape[y][x]) {
                    context.fillStyle = piece.color;
                    context.fillRect(
                        (piece.x + x) * blockSize, 
                        (piece.y + y) * blockSize, 
                        blockSize, 
                        blockSize
                    );
                    context.strokeStyle = 'rgba(0, 0, 0, 0.1)';
                    context.strokeRect(
                        (piece.x + x) * blockSize, 
                        (piece.y + y) * blockSize, 
                        blockSize, 
                        blockSize
                    );
                }
            }
        }
    }
    
    function isValidMove(piece, newX, newY) {
        for (let y = 0; y < piece.shape.length; y++) {
            for (let x = 0; x < piece.shape[y].length; x++) {
                if (piece.shape[y][x]) {
                    const cellY = newY + y;
                    const cellX = newX + x;
                    
                    if (
                        cellX < 0 || 
                        cellX >= cols || 
                        cellY >= rows || 
                        (cellY >= 0 && board[cellY][cellX])
                    ) {
                        return false;
                    }
                }
            }
        }
        return true;
    }
    
    function rotatePiece() {
        if (!currentPiece) return;
        
        const newShape = currentPiece.shape[0].map((_, i) => 
            currentPiece.shape.map(row => row[i]).reverse()
        );
        
        const oldShape = currentPiece.shape;
        currentPiece.shape = newShape;
        
        if (!isValidMove(currentPiece, currentPiece.x, currentPiece.y)) {
            currentPiece.shape = oldShape;
        }
    }
    
    function movePiece(dx, dy) {
        if (!currentPiece) return false;
        
        if (isValidMove(currentPiece, currentPiece.x + dx, currentPiece.y + dy)) {
            currentPiece.x += dx;
            currentPiece.y += dy;
            return true;
        }
        return false;
    }
    
    function mergePiece() {
        if (!currentPiece) return;
        
        for (let y = 0; y < currentPiece.shape.length; y++) {
            for (let x = 0; x < currentPiece.shape[y].length; x++) {
                if (currentPiece.shape[y][x]) {
                    const cellY = currentPiece.y + y;
                    const cellX = currentPiece.x + x;
                    
                    if (cellY >= 0) {
                        board[cellY][cellX] = currentPiece.color;
                    }
                }
            }
        }
    }
    
    function clearLines() {
        let linesCleared = 0;
        
        for (let y = rows - 1; y >= 0; y--) {
            if (board[y].every(cell => cell)) {
                board.splice(y, 1);
                board.unshift(Array(cols).fill(0));
                linesCleared++;
                y++; 
            }
        }
        
        if (linesCleared > 0) {
            score += linesCleared * 100;
            scoreElement.textContent = score;
            
            dropSpeed = Math.max(200, dropSpeed - 50);
            clearInterval(gameInterval);
            gameInterval = setInterval(dropPiece, dropSpeed);
        }
    }
    
    function dropPiece() {
        if (!movePiece(0, 1)) {
            mergePiece();
            clearLines();
            
            if (currentPiece.y <= 0) {
                gameOver();
                return;
            }
            
            currentPiece = nextPiece;
            nextPiece = createPiece();
            drawNextPiece();
        }
        
        drawBoard();
    }
    
    function gameOver() {
        clearInterval(gameInterval);
        alert(`Game over, your score: ${score}`);
        resetGame();
    }
    
    function resetGame() {
        board = Array(rows).fill().map(() => Array(cols).fill(0));
        score = 0;
        scoreElement.textContent = score;
        dropSpeed = 1000;
        
        currentPiece = createPiece();
        nextPiece = createPiece();
        drawNextPiece();
        
        clearInterval(gameInterval);
        gameInterval = setInterval(dropPiece, dropSpeed);
        
        drawBoard();
    }
    
    document.getElementById('tetris-left').addEventListener('click', () => {
        movePiece(-1, 0);
        drawBoard();
    });
    
    document.getElementById('tetris-right').addEventListener('click', () => {
        movePiece(1, 0);
        drawBoard();
    });
    
    document.getElementById('tetris-down').addEventListener('click', () => {
        movePiece(0, 1);
        drawBoard();
    });
    
    document.getElementById('tetris-rotate').addEventListener('click', () => {
        rotatePiece();
        drawBoard();
    });
    
    document.addEventListener('keydown', function(e) {
        switch(e.key) {
            case 'ArrowLeft': movePiece(-1, 0); break;
            case 'ArrowRight': movePiece(1, 0); break;
            case 'ArrowDown': movePiece(0, 1); break;
            case 'ArrowUp': rotatePiece(); break;
        }
        drawBoard();
    });
    
    resetGame();
});