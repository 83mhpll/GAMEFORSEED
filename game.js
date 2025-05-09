const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;

const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');
const shopButton = document.getElementById('shop-button');
const viewLeaderboardButton = document.getElementById('view-leaderboard-button');
const mainMenu = document.getElementById('main-menu');
const shop = document.getElementById('shop');
const leaderboard = document.getElementById('leaderboard');
const leaderboardList = document.getElementById('leaderboard-list');
const usernameInput = document.getElementById('username');
const snakeSkinSelect = document.getElementById('snake-skin');
const scoreDisplay = document.getElementById('score');
const lengthDisplay = document.getElementById('length');
const levelDisplay = document.getElementById('level');
const personalBestDisplay = document.getElementById('personal-best');
const suprBalanceDisplay = document.getElementById('supr-balance');
const shopSuprBalanceDisplay = document.getElementById('shop-supr-balance');
const btcBalanceDisplay = document.getElementById('btc-balance');
const ethBalanceDisplay = document.getElementById('eth-balance');
const opBalanceDisplay = document.getElementById('op-balance');
const scoreBoard = document.getElementById('score-board');
const gameMessage = document.getElementById('game-message');

// ตรวจสอบว่า Element ทั้งหมดถูกพบหรือไม่
if (!startButton) console.error('Start button not found');
if (!restartButton) console.error('Restart button not found');
if (!shopButton) console.error('Shop button not found');
if (!viewLeaderboardButton) console.error('View leaderboard button not found');
if (!mainMenu) console.error('Main menu not found');
if (!shop) console.error('Shop not found');
if (!leaderboard) console.error('Leaderboard not found');
if (!leaderboardList) console.error('Leaderboard list not found');
if (!usernameInput) console.error('Username input not found');
if (!snakeSkinSelect) console.error('Snake skin select not found');
if (!scoreDisplay) console.error('Score display not found');
if (!lengthDisplay) console.error('Length display not found');
if (!levelDisplay) console.error('Level display not found');
if (!personalBestDisplay) console.error('Personal best display not found');
if (!suprBalanceDisplay) console.error('SUPR balance display not found');
if (!shopSuprBalanceDisplay) console.error('Shop SUPR balance display not found');
if (!btcBalanceDisplay) console.error('BTC balance display not found');
if (!ethBalanceDisplay) console.error('ETH balance display not found');
if (!opBalanceDisplay) console.error('OP balance display not found');
if (!scoreBoard) console.error('Score board not found');
if (!gameMessage) console.error('Game message not found');

const COLORS = {
    BACKGROUND: '#0E273B',
    SNAKE_WHITE: '#ffffff',
    SNAKE_GOLD: '#FFD700',
    SNAKE_BLUE: '#00CED1',
    OBSTACLE: '#ff0000',
    POWERUP_SPEED: '#00FF00',
    POWERUP_CLEAR: '#FFFF00',
    SUPERCOLLATERAL: '#0E273B',
    ENEMY: '#000000'
};

let snakeSkin = 'white';
let snake = [{ x: 400, y: 300 }];
let direction = { x: 0, y: 0 };
let coins = [];
let coinPool = [];
let obstacles = [];
let enemies = [];
let effects = [];
let powerUps = [];
let supercollateral = null;
let score = 0;
let length = 10;
let level = 1;
let personalBest = JSON.parse(localStorage.getItem('personalBest')) || 0;
let suprCoins = JSON.parse(localStorage.getItem('suprCoins')) || 0;
let btc = JSON.parse(localStorage.getItem('btc')) || 0;
let eth = JSON.parse(localStorage.getItem('eth')) || 0;
let op = JSON.parse(localStorage.getItem('op')) || 0;
let zoom = 1;
let currentUsername = '';
let lastTime = 0;
const FPS = 60;
const frameTime = 1000 / FPS;
let speedBoost = 1;
let speedBoostTimer = 0;
let profitMultiplier = 1;
let profitMultiplierTimer = 0;

// กำหนดเงินรางวัลรวมและ SUPR Coins สำหรับรางวัล
const TOTAL_PRIZE_POOL = 34750; // $34,750
const PRIZE_POOL_PERCENTAGE = 0.07; // 7%
const TOTAL_SUPR_REWARD = 10000; // 10,000 SUPR Coins

// เสียงจากโฟลเดอร์ sounds/
const coinSound = new Audio('sounds/coin.mp3');
const hitSound = new Audio('sounds/hit.mp3');
const gameOverSound = new Audio('sounds/gameover.mp3');
const powerUpSound = new Audio('sounds/powerup.mp3');
const startSound = new Audio('sounds/start.mp3');
const levelUpSound = new Audio('sounds/levelup.mp3');
const shopOpenSound = new Audio('sounds/shop-open.mp3');
const buySound = new Audio('sounds/buy.mp3');
const clickSound = new Audio('sounds/click.mp3');

// เพิ่มการจัดการข้อผิดพลาดสำหรับไฟล์เสียง
coinSound.onerror = () => console.error('Failed to load coin.mp3');
hitSound.onerror = () => console.error('Failed to load hit.mp3');
gameOverSound.onerror = () => console.error('Failed to load gameover.mp3');
powerUpSound.onerror = () => console.error('Failed to load powerup.mp3');
startSound.onerror = () => console.error('Failed to load start.mp3');
levelUpSound.onerror = () => console.error('Failed to load levelup.mp3');
shopOpenSound.onerror = () => console.error('Failed to load shop-open.mp3');
buySound.onerror = () => console.error('Failed to load buy.mp3');
clickSound.onerror = () => console.error('Failed to load click.mp3');

// ฟังก์ชันช่วยเล่นเสียงพร้อมจัดการข้อผิดพลาด
function playSound(sound) {
    sound.currentTime = 0;
    sound.play().catch(error => {
        console.error('Error playing sound:', error);
    });
}

// ภาพสำหรับ Power-up ความเร็ว (ใช้ seed.png)
const seedImage = new Image();
seedImage.src = 'images/seed.png';
seedImage.onerror = () => console.error('Failed to load seed.png');

const coinImage = new Image();
coinImage.src = 'images/small.png';
coinImage.onerror = () => console.error('Failed to load small.png');

const supercollateralImage = new Image();
supercollateralImage.src = 'images/circle.png';
supercollateralImage.onerror = () => console.error('Failed to load circle.png');

const clearObstaclesImage = new Image();
clearObstaclesImage.src = 'images/money-bag_10544186.png';
clearObstaclesImage.onerror = () => console.error('Failed to load money-bag_10544186.png');

const suprCoinImage = new Image();
suprCoinImage.src = 'images/superseed1733149132386.png';
suprCoinImage.onerror = () => console.error('Failed to load superseed1733149132386.png');

// Event Listeners
if (startButton) {
    startButton.addEventListener('click', () => {
        console.log('Start button clicked');
        playSound(clickSound);
        startGame();
    });
} else {
    console.error('Cannot add event listener to startButton');
}

if (restartButton) {
    restartButton.addEventListener('click', () => {
        console.log('Restart button clicked');
        playSound(clickSound);
        startGame();
    });
}

if (shopButton) {
    shopButton.addEventListener('click', () => {
        console.log('Shop button clicked');
        playSound(shopOpenSound);
        shop.style.display = 'block';
        updateShop();
    });
}

if (viewLeaderboardButton) {
    viewLeaderboardButton.addEventListener('click', () => {
        console.log('View leaderboard button clicked');
        playSound(clickSound);
        showLeaderboard();
    });
}

if (document.getElementById('close-shop')) {
    document.getElementById('close-shop').addEventListener('click', () => {
        console.log('Close shop button clicked');
        playSound(clickSound);
        shop.style.display = 'none';
    });
}

if (document.getElementById('close-leaderboard')) {
    document.getElementById('close-leaderboard').addEventListener('click', () => {
        console.log('Close leaderboard button clicked');
        playSound(clickSound);
        leaderboard.style.display = 'none';
    });
}

if (document.getElementById('buy-btc')) {
    document.getElementById('buy-btc').addEventListener('click', () => {
        console.log('Buy BTC button clicked');
        playSound(buySound);
        buyCoin('btc');
    });
}

if (document.getElementById('buy-eth')) {
    document.getElementById('buy-eth').addEventListener('click', () => {
        console.log('Buy ETH button clicked');
        playSound(buySound);
        buyCoin('eth');
    });
}

if (document.getElementById('buy-op')) {
    document.getElementById('buy-op').addEventListener('click', () => {
        console.log('Buy OP button clicked');
        playSound(buySound);
        buyCoin('op');
    });
}

canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) / zoom;
    const mouseY = (e.clientY - rect.top) / zoom;
    const angle = Math.atan2(mouseY - snake[0].y, mouseX - snake[0].x);
    const baseSpeed = (3 + Math.floor(score / 1000) * 0.1) * (1 + level * 0.05);
    direction.x = Math.cos(angle) * baseSpeed * speedBoost;
    direction.y = Math.sin(angle) * baseSpeed * speedBoost;
});

document.addEventListener('keydown', (e) => {
    if (e.key === '+') zoom = Math.min(zoom + 0.1, 2);
    if (e.key === '-') zoom = Math.max(zoom - 0.1, 0.5);
});

// ฟังก์ชันคำนวณรางวัลสำหรับผู้เล่น 5 อันดับแรก
function calculateRewards() {
    const leaderboardData = JSON.parse(localStorage.getItem('leaderboard')) || [];
    const top5 = leaderboardData.slice(0, 5);
    if (top5.length === 0) return [];

    // คำนวณคะแนนรวมของ 5 อันดับแรก
    const totalTop5Score = top5.reduce((sum, entry) => sum + entry.score, 0);
    if (totalTop5Score === 0) return top5.map(entry => ({ ...entry, cashReward: 0, suprReward: 0 }));

    // คำนวณเงินรางวัล 7% จาก $34,750
    const totalCashPrize = TOTAL_PRIZE_POOL * PRIZE_POOL_PERCENTAGE; // $2,432.50
    const totalSuprPrize = TOTAL_SUPR_REWARD; // 10,000 SUPR Coins

    // คำนวณส่วนแบ่งของแต่ละคน
    return top5.map(entry => {
        const cashReward = totalTop5Score > 0 ? (entry.score / totalTop5Score) * totalCashPrize : 0;
        const suprReward = totalTop5Score > 0 ? (entry.score / totalTop5Score) * totalSuprPrize : 0;
        return {
            ...entry,
            cashReward: Math.round(cashReward * 100) / 100, // ปัดเป็นทศนิยม 2 ตำแหน่ง
            suprReward: Math.round(suprReward) // ปัดเป็นจำนวนเต็ม
        };
    });
}

function startGame() {
    console.log('startGame function called');
    currentUsername = usernameInput.value.trim() || 'Anonymous';
    snakeSkin = snakeSkinSelect.value;
    mainMenu.style.display = 'none';
    canvas.style.display = 'block';
    scoreBoard.style.display = 'flex';
    startButton.style.display = 'none';
    restartButton.style.display = 'none';
    shop.style.display = 'none';
    leaderboard.style.display = 'none';
    gameMessage.style.display = 'none';
    playSound(startSound);
    initGame();
}

function initGame() {
    coins = [];
    obstacles = [];
    enemies = [];
    powerUps = [];
    supercollateral = null;
    snake = [{ x: 400, y: 300 }];
    direction = { x: 0, y: 0 };
    score = 0;
    length = 10;
    level = 1;
    speedBoost = 1;
    speedBoostTimer = 0;
    profitMultiplier = 1;
    profitMultiplierTimer = 0;
    spawnCoins();
    spawnEnemies();
    spawnObstacles(getObstacleLevel(score));
    updatePersonalBest();
    updateSuprBalance();
    gameLoop(performance.now());
}

function spawnCoins() {
    for (let i = 0; i < 20; i++) {
        let coin = coinPool.pop() || {};
        coin.x = Math.random() * canvas.width;
        coin.y = Math.random() * canvas.height;
        coin.size = Math.random() * 30 + (score > 5000 ? 20 : 20);
        coins.push(coin);
    }
}

function recycleCoin(coin) {
    coinPool.push(coin);
}

function spawnEnemies() {
    const enemyCount = Math.floor(score / 300) + 1 + level;
    while (enemies.length < enemyCount) {
        enemies.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            speedX: (Math.random() - 0.5) * (3 + level * 0.2),
            speedY: (Math.random() - 0.5) * (3 + level * 0.2)
        });
    }
}

function getObstacleLevel(score) {
    return Math.floor(score / 500) + 1 + Math.floor(score / 2000);
}

function spawnObstacles(obstacleCount) {
    obstacles = [];
    for (let i = 0; i < obstacleCount; i++) {
        obstacles.push({
            x: Math.random() * (canvas.width - 50),
            y: Math.random() * (canvas.height - 50),
            width: 40,
            height: 40
        });
    }
}

function spawnPowerUps() {
    if (Math.random() < 0.015) {
        powerUps.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            type: 'speed'
        });
    }
    if (Math.random() < 0.001) {
        powerUps.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            type: 'clear'
        });
    }
    if (!supercollateral && Math.random() < 0.03) {
        supercollateral = {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height
        };
    }
}

function showMessage(text, duration = 2000) {
    gameMessage.textContent = text;
    gameMessage.style.display = 'block';
    gameMessage.style.opacity = '1';
    setTimeout(() => {
        gameMessage.style.opacity = '0';
        setTimeout(() => {
            gameMessage.style.display = 'none';
        }, 500);
    }, duration);
}

function drawSnake(timestamp) {
    snake.forEach((segment, index) => {
        const animationOffset = Math.sin(timestamp / 200 + index) * 2;
        ctx.fillStyle = snakeSkin === 'white' ? COLORS.SNAKE_WHITE : snakeSkin === 'gold' ? COLORS.SNAKE_GOLD : COLORS.SNAKE_BLUE;
        if (index === 0) {
            ctx.beginPath();
            ctx.arc(segment.x, segment.y, 12, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#000';
            ctx.beginPath();
            ctx.arc(segment.x - 4, segment.y - 4, 2, 0, Math.PI * 2);
            ctx.arc(segment.x + 4, segment.y - 4, 2, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ctx.beginPath();
            ctx.arc(segment.x, segment.y, 10, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#00000033';
            ctx.fillRect(segment.x - 5 + animationOffset, segment.y - 2, 10, 4);
        }
    });
}

function drawObstacles() {
    obstacles.forEach(obstacle => {
        ctx.fillStyle = COLORS.OBSTACLE;
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
}

function drawEnemies() {
    enemies.forEach(enemy => {
        enemy.x += enemy.speedX;
        enemy.y += enemy.speedY;
        if (enemy.x < 0 || enemy.x > canvas.width) enemy.speedX *= -1;
        if (enemy.y < 0 || enemy.y > canvas.height) enemy.speedY *= -1;

        ctx.fillStyle = COLORS.ENEMY;
        ctx.beginPath();
        ctx.arc(enemy.x, enemy.y, 15, 0, Math.PI * 2);
        ctx.fill();
    });
}

function drawPowerUps() {
    powerUps.forEach((pu, index) => {
        if (pu.type === 'speed') {
            ctx.drawImage(seedImage, pu.x - 10, pu.y - 10, 20, 20);
        } else if (pu.type === 'clear') {
            ctx.drawImage(clearObstaclesImage, pu.x - 15, pu.y - 15, 30, 30);
        }
        const collisionDistance = pu.type === 'speed' ? 22 : 27;
        if (Math.hypot(pu.x - snake[0].x, pu.y - snake[0].y) < collisionDistance) {
            playSound(powerUpSound);
            powerUps.splice(index, 1);
            if (pu.type === 'speed') {
                speedBoost = 1.5;
                speedBoostTimer = 300;
                showMessage("Speed Boost!");
            } else if (pu.type === 'clear') {
                obstacles = [];
                showMessage("Obstacles Cleared!");
            }
        }
    });
    if (supercollateral) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(supercollateral.x, supercollateral.y, 15, 0, Math.PI * 2);
        ctx.fillStyle = COLORS.SUPERCOLLATERAL;
        ctx.fill();
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 12px "Coming Soon"';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('SUPR', supercollateral.x, supercollateral.y);
        ctx.restore();

        if (Math.hypot(supercollateral.x - snake[0].x, supercollateral.y - snake[0].y) < 27) {
            playSound(powerUpSound);
            supercollateral = null;
            profitMultiplier = 2;
            profitMultiplierTimer = 600;
            suprCoins += 50;
            updateSuprBalance();
            showMessage("Profit Multiplier x2!", 1500);
            for (let i = 0; i < 10; i++) {
                addEffect(snake[0].x, snake[0].y);
            }
        }
    }
}

function addEffect(x, y) {
    effects.push({ x, y, radius: 5, alpha: 1 });
}

function drawEffects() {
    effects.forEach((effect, index) => {
        ctx.beginPath();
        ctx.arc(effect.x, effect.y, effect.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 215, 0, ${effect.alpha})`;
        ctx.fill();
        effect.radius += 1;
        effect.alpha -= 0.05;
        if (effect.alpha <= 0) effects.splice(index, 1);
    });
}

function gameLoop(timestamp) {
    if (timestamp - lastTime < frameTime) {
        requestAnimationFrame(gameLoop);
        return;
    }
    lastTime = timestamp;

    ctx.fillStyle = COLORS.BACKGROUND;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    snake.unshift(head);
    if (snake.length > length) snake.pop();

    if (speedBoostTimer > 0) {
        speedBoostTimer--;
        if (speedBoostTimer === 0) speedBoost = 1;
    }

    if (profitMultiplierTimer > 0) {
        profitMultiplierTimer--;
        if (profitMultiplierTimer === 0) profitMultiplier = 1;
    }

    const newLevel = Math.floor(score / 1000) + 1;
    const newObstacleLevel = getObstacleLevel(score);
    if (newLevel > level) {
        level = newLevel;
        showMessage(`Level ${level} - Proof of Repayment!`);
        playSound(levelUpSound);
        suprCoins += level * 10;
        updateSuprBalance();
    }
    if (obstacles.length < newObstacleLevel) {
        spawnObstacles(newObstacleLevel);
    }
    spawnEnemies();

    spawnPowerUps();
    drawSnake(timestamp);
    drawObstacles();
    drawEnemies();
    drawPowerUps();

    coins.forEach((coin, index) => {
        ctx.drawImage(coinImage, coin.x - coin.size / 2, coin.y - coin.size / 2, coin.size, coin.size);
        if (Math.hypot(coin.x - head.x, coin.y - head.y) < coin.size / 2 + 12) {
            playSound(coinSound);
            addEffect(coin.x, coin.y);
            coins.splice(index, 1);
            score += Math.floor(coin.size / 2) * profitMultiplier;
            length += 1;
            recycleCoin(coin);
            coins.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 30 + (score > 5000 ? 20 : 20)
            });
        }
    });

    drawEffects();

    for (let obstacle of obstacles) {
        if (head.x < obstacle.x + obstacle.width &&
            head.x + 12 > obstacle.x &&
            head.y < obstacle.y + obstacle.height &&
            head.y + 12 > obstacle.y) {
            playSound(hitSound);
            endGame();
            return;
        }
    }

    for (let enemy of enemies) {
        if (Math.hypot(enemy.x - head.x, enemy.y - head.y) < 27) {
            playSound(hitSound);
            endGame();
            return;
        }
    }

    scoreDisplay.textContent = score;
    lengthDisplay.textContent = length;
    levelDisplay.textContent = level;

    if (head.x < 0 || head.x > canvas.width || head.y < 0 || head.y > canvas.height) {
        playSound(gameOverSound);
        endGame();
        return;
    }

    requestAnimationFrame(gameLoop);
}

function endGame() {
    suprCoins += Math.floor(score / 1000) * 10;
    localStorage.setItem('suprCoins', JSON.stringify(suprCoins));
    if (score > personalBest) {
        personalBest = score;
        localStorage.setItem('personalBest', JSON.stringify(personalBest));
    }
    updateLeaderboard(currentUsername, score);

    // ตรวจสอบว่าผู้เล่นอยู่ใน 5 อันดับแรกหรือไม่
    const leaderboardData = JSON.parse(localStorage.getItem('leaderboard')) || [];
    const top5 = leaderboardData.slice(0, 5);
    const playerRank = top5.findIndex(entry => entry.username === currentUsername && entry.score === score);
    if (playerRank !== -1) {
        const rewards = calculateRewards();
        const playerReward = rewards[playerRank];
        showMessage(`Congratulations! You are in the Top 5! Your estimated reward: $${playerReward.cashReward} + ${playerReward.suprReward} SUPR`, 3000);
    }

    canvas.style.display = 'none';
    scoreBoard.style.display = 'none';
    mainMenu.style.display = 'block';
    startButton.style.display = 'none';
    restartButton.style.display = 'inline-block';
    updatePersonalBest();
    updateSuprBalance();
}

function updatePersonalBest() {
    personalBestDisplay.textContent = personalBest;
}

function updateSuprBalance() {
    suprBalanceDisplay.textContent = suprCoins;
    shopSuprBalanceDisplay.innerHTML = `<img src="${suprCoinImage.src}" alt="SUPR" style="width: 30px; height: 30px; margin-right: 10px;"> ${suprCoins}`;
}

function updateShop() {
    shopSuprBalanceDisplay.innerHTML = `<img src="${suprCoinImage.src}" alt="SUPR" style="width: 30px; height: 30px; margin-right: 10px;"> ${suprCoins}`;
    btcBalanceDisplay.textContent = btc;
    ethBalanceDisplay.textContent = eth;
    opBalanceDisplay.textContent = op;
}

function buyCoin(type) {
    if (suprCoins >= 100) {
        suprCoins -= 100;
        if (type === 'btc') btc += 1;
        else if (type === 'eth') eth += 1;
        else if (type === 'op') op += 1;
        localStorage.setItem('suprCoins', JSON.stringify(suprCoins));
        localStorage.setItem('btc', JSON.stringify(btc));
        localStorage.setItem('eth', JSON.stringify(eth));
        localStorage.setItem('op', JSON.stringify(op));
        updateShop();
    } else {
        alert('Not enough SUPR Coins!');
    }
}

function updateLeaderboard(username, score) {
    let leaderboardData = JSON.parse(localStorage.getItem('leaderboard')) || [];
    leaderboardData.push({ username, score });
    leaderboardData.sort((a, b) => b.score - a.score);
    leaderboardData = leaderboardData.slice(0, 5);
    localStorage.setItem('leaderboard', JSON.stringify(leaderboardData));
}

function showLeaderboard() {
    leaderboard.style.display = 'block';
    leaderboardList.innerHTML = '';

    // เพิ่มข้อความแจ้งเตือนเกี่ยวกับรางวัล
    const totalCashPrize = TOTAL_PRIZE_POOL * PRIZE_POOL_PERCENTAGE;
    const rewardMessage = document.createElement('p');
    rewardMessage.style.color = '#FFD700';
    rewardMessage.style.fontWeight = 'bold';
    rewardMessage.style.marginBottom = '10px';
    rewardMessage.textContent = `Top 5 players will share 7% of the $${TOTAL_PRIZE_POOL} prize pool ($${totalCashPrize.toFixed(2)}) + ${TOTAL_SUPR_REWARD} SUPR Coins!`;
    leaderboardList.appendChild(rewardMessage);

    // คำนวณรางวัล
    const leaderboardData = calculateRewards();

    // แสดงผลผู้เล่น 5 อันดับแรกพร้อมรางวัล
    leaderboardData.forEach((entry, index) => {
        const div = document.createElement('div');
        div.className = 'leaderboard-entry';
        div.innerHTML = `<span>${index + 1}</span><span>${entry.username}</span><span>${entry.score}</span><span>$${entry.cashReward} + ${entry.suprReward} SUPR</span>`;
        leaderboardList.appendChild(div);
    });

    if (leaderboardData.length === 0) {
        leaderboardList.innerHTML += '<p>No scores yet!</p>';
    }
}

updatePersonalBest();
updateSuprBalance();