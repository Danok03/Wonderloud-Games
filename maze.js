const mazeElement = document.getElementById('maze');
const resetButton = document.getElementById('resetButton');
const newMazeButton = document.getElementById('new-maze-btn');

const mazeSize = 10;
const maze = [];  
let playerPosition = { x: 0, y: 0 }; 

function generateMaze() {
    for (let y = 0; y < mazeSize; y++) {
        maze[y] = [];
        for (let x = 0; x < mazeSize; x++) {
            maze[y][x] = 1; 
        }
    }

    function carvePath(x, y) {
        const directions = [
            { dx: 1, dy: 0 }, 
            { dx: -1, dy: 0 }, 
            { dx: 0, dy: 1 }, 
            { dx: 0, dy: -1 },
        ];

        directions.sort(() => Math.random() - 0.5);

        for (const dir of directions) {
            const newX = x + dir.dx * 2;
            const newY = y + dir.dy * 2;

            if (newX >= 0 && newX < mazeSize && newY >= 0 && newY < mazeSize && maze[newY][newX] === 1) {
                maze[y + dir.dy][x + dir.dx] = 0; 
                maze[newY][newX] = 0; 
                carvePath(newX, newY);
            }
        }
    }

    maze[0][0] = 0; 
    carvePath(0, 0); 

    maze[mazeSize - 1][mazeSize - 1] = 2; 
    ensureExitAccess(); 
}

function ensureExitAccess() {
    const exitX = mazeSize - 1;
    const exitY = mazeSize - 1;

    if (maze[exitY - 1][exitX] !== 0 && maze[exitY][exitX - 1] !== 0) {
        if (exitY - 1 >= 0) {
            maze[exitY - 1][exitX] = 0;
        } else if (exitX - 1 >= 0) {
            maze[exitY][exitX - 1] = 0;
        }
    }
}

function renderMaze() {
    mazeElement.innerHTML = ''; 
    for (let y = 0; y < mazeSize; y++) {
        for (let x = 0; x < mazeSize; x++) {
            const cell = document.createElement('div');
            cell.classList.add('cell'); 

            if (maze[y][x] === 1) {
                cell.classList.add('wall');
            } else if (maze[y][x] === 2) {
                cell.classList.add('exit'); 
            }

            if (x === playerPosition.x && y === playerPosition.y) {
                cell.classList.add('player'); 
            }

            mazeElement.appendChild(cell); 
        }
    }
}

function movePlayer(dx, dy) {
    const newX = playerPosition.x + dx;
    const newY = playerPosition.y + dy;

    if (newX >= 0 && newX < mazeSize && newY >= 0 && newY < mazeSize && maze[newY][newX] !== 1) {
        playerPosition.x = newX; 
        playerPosition.y = newY;

        if (maze[newY][newX] === 2) {
            alert('Congratulations! You have completed the maze!');
            resetGame(); 
        }
        
        renderMaze(); 
    }
}

function resetGame() {
    playerPosition = { x: 0, y: 0 }; 
    generateMaze();
    renderMaze(); 
}

document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            movePlayer(0, -1); 
            break;
        case 'ArrowDown':
            movePlayer(0, 1); 
            break;
        case 'ArrowLeft':
            movePlayer(-1, 0); 
            break;
        case 'ArrowRight':
            movePlayer(1, 0); 
            break;
    }
});

resetButton.addEventListener('click', resetGame);

generateMaze();
renderMaze();

newMazeButton.addEventListener('click', () => {
    resetGame(); 
});
