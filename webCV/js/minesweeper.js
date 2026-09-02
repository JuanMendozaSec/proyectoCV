// ========================================
// MINE SWEEPER - HACKER EDITION
// ========================================
let ROWS = 8;
let COLS = 8;
let TOTAL_MINES = 10;
let board = [];
let revealed = [];
let flagged = [];
let gameOver = false;
let firstClick = true;
let timer = 0;
let timerInterval = null;
let flagCount = 0;
let revealedCount = 0;

// ---- INIT ----
function initGame() {
    board = Array(ROWS).fill(null).map(() => Array(COLS).fill(0));
    revealed = Array(ROWS).fill(null).map(() => Array(COLS).fill(false));
    flagged = Array(ROWS).fill(null).map(() => Array(COLS).fill(false));
    gameOver = false;
    firstClick = true;
    flagCount = 0;
    revealedCount = 0;
    timer = 0;
    clearInterval(timerInterval);
    timerInterval = null;

    document.getElementById('mines').textContent = TOTAL_MINES;
    document.getElementById('flags').textContent = 0;
    document.getElementById('timer').textContent = 0;
    document.getElementById('total-cells').textContent = ROWS * COLS - TOTAL_MINES;
    document.getElementById('cell-count').textContent = 0;
    document.getElementById('message').textContent = '';
    document.getElementById('message').style.color = '';

    renderBoard();
    addLog('System ready. Click to scan grid.', 'cyan');
}

// ---- PLACE MINES ----
function placeMines(safeR, safeC) {
    let placed = 0;
    while (placed < TOTAL_MINES) {
        const r = Math.floor(Math.random() * ROWS);
        const c = Math.floor(Math.random() * COLS);
        // Safe zone around first click
        if (Math.abs(r - safeR) <= 1 && Math.abs(c - safeC) <= 1) continue;
        if (board[r][c] === -1) continue;
        board[r][c] = -1;
        placed++;
    }
    // Calculate numbers
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (board[r][c] === -1) continue;
            let count = 0;
            for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                    const nr = r + dr;
                    const nc = c + dc;
                    if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && board[nr][nc] === -1) {
                        count++;
                    }
                }
            }
            board[r][c] = count;
        }
    }
}

// ---- RENDER ----
function renderBoard() {
    const boardEl = document.getElementById('board');
    boardEl.style.gridTemplateColumns = `repeat(${COLS}, 30px)`;
    boardEl.innerHTML = '';

    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.row = r;
            cell.dataset.col = c;

            cell.addEventListener('click', () => handleClick(r, c));
            cell.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                handleRightClick(r, c);
            });

            boardEl.appendChild(cell);
        }
    }
}

// ---- UPDATE CELL ----
function updateCell(r, c) {
    const boardEl = document.getElementById('board');
    const index = r * COLS + c;
    const cell = boardEl.children[index];

    cell.className = 'cell';

    if (flagged[r][c]) {
        cell.classList.add('flagged');
        cell.textContent = '🚩';
        return;
    }

    if (!revealed[r][c]) {
        cell.textContent = '';
        return;
    }

    cell.classList.add('revealed');

    if (board[r][c] === -1) {
        cell.classList.add('mine');
        cell.textContent = '💣';
        return;
    }

    if (board[r][c] > 0) {
        cell.textContent = board[r][c];
        cell.classList.add('n' + board[r][c]);
    } else {
        cell.textContent = '';
    }
}

// ---- CLICK ----
function handleClick(r, c) {
    if (gameOver || flagged[r][c] || revealed[r][c]) return;

    if (firstClick) {
        firstClick = false;
        placeMines(r, c);
        timerInterval = setInterval(() => {
            timer++;
            document.getElementById('timer').textContent = timer;
        }, 1000);
        addLog('Grid scanned. Mines placed.', 'green');
    }

    if (board[r][c] === -1) {
        // Game over
        revealAllMines();
        gameOver = true;
        clearInterval(timerInterval);
        document.getElementById('message').textContent = '💥 SYSTEM EXPLODED — GAME OVER';
        document.getElementById('message').style.color = '#ff3333';
        addLog(`BOOM! Mine hit at [${r},${c}] | Time: ${timer}s`, 'red');
        return;
    }

    revealCell(r, c);
    checkWin();
}

// ---- REVEAL ----
function revealCell(r, c) {
    if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return;
    if (revealed[r][c] || flagged[r][c]) return;

    revealed[r][c] = true;
    revealedCount++;
    updateCell(r, c);

    document.getElementById('cell-count').textContent = revealedCount;

    // Flood fill for empty cells
    if (board[r][c] === 0) {
        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                revealCell(r + dr, c + dc);
            }
        }
    }
}

// ---- RIGHT CLICK ----
function handleRightClick(r, c) {
    if (gameOver || revealed[r][c]) return;

    flagged[r][c] = !flagged[r][c];
    flagCount += flagged[r][c] ? 1 : -1;
    document.getElementById('flags').textContent = flagCount;
    updateCell(r, c);

    if (flagged[r][c]) {
        addLog(`Flag placed at [${r},${c}]`, 'yellow');
    } else {
        addLog(`Flag removed at [${r},${c}]`, 'yellow');
    }
}

// ---- REVEAL ALL MINES ----
function revealAllMines() {
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (board[r][c] === -1) {
                revealed[r][c] = true;
                updateCell(r, c);
            }
        }
    }
}

// ---- CHECK WIN ----
function checkWin() {
    if (revealedCount === ROWS * COLS - TOTAL_MINES) {
        gameOver = true;
        clearInterval(timerInterval);
        document.getElementById('message').textContent = `✅ SYSTEM SECURED — YOU WIN! Time: ${timer}s`;
        document.getElementById('message').style.color = '#00ff41';
        addLog(`VICTORY! All mines cleared in ${timer}s`, 'green');

        // Flag remaining mines
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                if (board[r][c] === -1 && !flagged[r][c]) {
                    flagged[r][c] = true;
                    updateCell(r, c);
                }
            }
        }
        document.getElementById('flags').textContent = TOTAL_MINES;
    }
}

// ---- DIFFICULTY ----
function setDifficulty(size, mines) {
    ROWS = size;
    COLS = size;
    TOTAL_MINES = mines;

    document.querySelectorAll('#difficulty button').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');

    addLog(`Difficulty set: ${size}x${size} | ${mines} mines`, 'cyan');
    initGame();
}

// ---- RESTART ----
function restartGame() {
    addLog('System rebooted.', 'cyan');
    initGame();
}

// ---- TERMINAL LOG ----
function addLog(msg, cls) {
    const terminal = document.getElementById('terminal-output');
    const p = document.createElement('p');
    p.className = 'log-' + cls;
    p.textContent = '> ' + msg;
    terminal.appendChild(p);
    terminal.scrollTop = terminal.scrollHeight;
}

// ---- START ----
initGame();

