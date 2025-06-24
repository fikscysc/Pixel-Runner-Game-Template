const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score-display');
const gameOverMessage = document.getElementById('game-over-message');
const nameModal = document.getElementById('name-modal');
const nameInput = document.getElementById('player-name-input');
const startButton = document.getElementById('start-game-button');
const mainContent = document.getElementById('main-content');
const playerNameDisplay = document.getElementById('player-name-display');
const leaderboardList = document.getElementById('leaderboard-list');
const finalScoreDisplay = document.getElementById('final-score');
const restartButton = document.getElementById('restart-button');

const jumpSound = new Audio('jump.wav');
const failSound = new Audio('gameover.mp3');
const backgroundMusic = new Audio('utama.wav');
backgroundMusic.loop = true;
backgroundMusic.volume = 0.3;

let scoreAnimationInterval = null;

const SCRIPT_URL = "/api/submit-score"; 

let playerName = "";
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;
const groundHeight = 50;
const timeCycles = [ { sky: { top: '#69D2E7', bottom: '#E0E4CC' }, ground: { base: '#8B4513', detail: '#713A10' }, celestialColor: 'rgba(255, 240, 150, 0.9)', text: '#FFFFFF' }, { sky: { top: '#F38630', bottom: '#E0E4CC' }, ground: { base: '#7B3F11', detail: '#61320E' }, celestialColor: 'rgba(255, 150, 80, 0.8)', text: '#FFFFFF' }, { sky: { top: '#0B486B', bottom: '#79BD9A' }, ground: { base: '#4A2508', detail: '#301805' }, celestialColor: 'rgba(255, 255, 240, 0.9)', stars: true, text: '#FFFFFF' }, { sky: { top: '#4682B4', bottom: '#A7DBD8' }, ground: { base: '#6B350F', detail: '#51280B' }, celestialColor: 'rgba(255, 240, 190, 0.7)', text: '#FFFFFF' } ];
const player = { x: 50, y: canvasHeight - groundHeight - 40, width: 40, height: 40, velocityY: 0, jumpPower: -18, gravity: 0.8, isJumping: false };
let obstacles = [], score = 0, frameCount = 0, gameSpeed = 5, gameOver = false, obstacleTimer = 0, clouds = [], scoreSent = false;

async function fetchLeaderboard() { try { const response = await fetch(SCRIPT_URL); if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`); const data = await response.json(); displayLeaderboard(data); } catch (error) { console.error("Gagal memperbarui leaderboard:", error); } }
function displayLeaderboard(data) { leaderboardList.innerHTML = ''; const totalSlots = 10; let dataCount = 0; if (data && data.length > 0) { data.forEach(player => { const listItem = document.createElement('li'); listItem.innerHTML = `<span>${player.name}</span><span>${player.score}</span>`; leaderboardList.appendChild(listItem); }); dataCount = data.length; } const remainingSlots = totalSlots - dataCount; for (let i = 0; i < remainingSlots; i++) { const listItem = document.createElement('li'); listItem.classList.add('empty-slot'); listItem.innerHTML = `<span>-</span><span>-</span>`; leaderboardList.appendChild(listItem); } }
async function sendScore(name, scoreValue) { try { const payload = { name: name, score: Math.floor(scoreValue) }; await fetch(SCRIPT_URL, { method: 'POST', headers: { 'Content-Type': 'application/json', }, body: JSON.stringify(payload) }); console.log(`Skor berhasil dikirim ke server.`); } catch (error) { console.error("Gagal mengirim data ke server:", error); } }
function startScoreAnimation(finalScore) { if (scoreAnimationInterval) clearInterval(scoreAnimationInterval); scoreAnimationInterval = setInterval(() => { const randomScore = Math.floor(Math.random() * (finalScore + 51)); finalScoreDisplay.textContent = randomScore; }, 50); }
function showFinalScore(finalScore) { clearInterval(scoreAnimationInterval); scoreAnimationInterval = null; finalScoreDisplay.textContent = Math.floor(finalScore); finalScoreDisplay.classList.add('score-revealed'); setTimeout(() => { finalScoreDisplay.classList.remove('score-revealed'); }, 500); }
function checkCollision() { for (let obstacle of obstacles) { if (player.x < obstacle.x + obstacle.width && player.x + player.width > obstacle.x && player.y < obstacle.y + obstacle.height && player.y + player.height > obstacle.y) { gameOver = true; backgroundMusic.pause(); failSound.play(); finalScoreDisplay.textContent = ""; gameOverMessage.classList.remove('hidden'); startScoreAnimation(score); setTimeout(() => { if (gameOver) { showFinalScore(score); } }, 1300); if (!scoreSent) { sendScore(playerName, score).then(() => fetchLeaderboard()); scoreSent = true; } } } }
function spawnCloud() { if (clouds.length < 5) { const y = Math.random() * (canvasHeight / 2 - 50); const totalWidth = Math.random() * 100 + 50; let cloudParts = []; for (let i = 0; i < 5; i++) { cloudParts.push({ offsetX: (Math.random() - 0.5) * totalWidth, offsetY: (Math.random() - 0.5) * 20, radius: Math.random() * 20 + 15 }); } clouds.push({ x: canvasWidth + totalWidth, y: y, parts: cloudParts }); } }
function updateAndDrawClouds() { for (let i = clouds.length - 1; i >= 0; i--) { let cloud = clouds[i]; cloud.x -= gameSpeed * 0.3; ctx.fillStyle = 'rgba(255, 255, 255, 0.85)'; cloud.parts.forEach(part => { ctx.beginPath(); ctx.arc(cloud.x + part.offsetX, cloud.y + part.offsetY, part.radius, 0, Math.PI * 2); ctx.fill(); }); if (cloud.x < -150) { clouds.splice(i, 1); } } }
function drawRealisticSky(sky, celestialColor, addStars = false) { const gradient = ctx.createLinearGradient(0, 0, 0, canvasHeight - groundHeight); gradient.addColorStop(0, sky.top); gradient.addColorStop(1, sky.bottom); ctx.fillStyle = gradient; ctx.fillRect(0, 0, canvasWidth, canvasHeight - groundHeight); ctx.fillStyle = celestialColor; ctx.shadowColor = celestialColor; ctx.shadowBlur = 30; ctx.beginPath(); ctx.arc(120, 100, 30, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0; if (addStars) { ctx.fillStyle = '#FFFFFF'; for (let i = 0; i < 100; i++) { const x = (Math.random() * canvasWidth * 3 + frameCount * 0.1) % canvasWidth; const y = Math.random() * (canvasHeight - groundHeight - 50); const size = Math.random() * 2; ctx.fillRect(x, y, size, size); } } }
function drawRealisticGround(groundColors) { ctx.fillStyle = groundColors.base; ctx.fillRect(0, canvasHeight - groundHeight, canvasWidth, groundHeight); ctx.fillStyle = groundColors.detail; for (let i = 0; i < 400; i++) { const x = Math.random() * canvasWidth; const y = (canvasHeight - groundHeight) + Math.random() * groundHeight; ctx.fillRect(x, y, 3, 3); } }
function drawPlayer() { const p = player; const pX = p.x + p.width / 4, pY = p.y + p.height / 4, bW = p.width / 2, bH = p.height / 2, sw = Math.sin(frameCount * 0.4) * 5; ctx.fillStyle = '#d2b48c'; ctx.fillRect(pX - 4, pY, 4, bH - sw); ctx.fillStyle = '#00008b'; ctx.fillRect(pX, pY + bH, bW, 10 + sw); ctx.fillStyle = '#87CEEB'; ctx.fillRect(pX, pY, bW, bH); ctx.fillStyle = '#d2b48c'; ctx.fillRect(pX, p.y, bW, p.height / 4); ctx.fillStyle = '#000000'; ctx.fillRect(pX + bW - 4, p.y + 5, 2, 2); ctx.fillStyle = '#d2b48c'; ctx.fillRect(pX + bW, pY, 4, bH + sw); ctx.fillStyle = '#0000CD'; ctx.fillRect(pX, pY + bH, bW, 10 - sw); }
function drawTree(o) { const tW = o.width, tH = o.height, tX = o.x, tY = o.y; ctx.fillStyle = '#8B4513'; ctx.fillRect(tX, tY, tW, tH); const lS = tW * 2, lY = tY - lS * 0.75, lX = tX - lS / 4; ctx.fillStyle = '#228B22'; ctx.fillRect(lX, lY, lS, lS); ctx.fillStyle = '#006400'; ctx.fillRect(lX + 5, lY + 5, lS - 10, lS - 10); }
function drawObstacles() { obstacles.forEach(o => drawTree(o)); }
function updatePlayer() { if (player.isJumping) { player.velocityY += player.gravity; player.y += player.velocityY; } if (player.y > canvasHeight - groundHeight - player.height) { player.y = canvasHeight - groundHeight - player.height; player.velocityY = 0; player.isJumping = false; } }
function updateObstacles() { const base = 95, min = 40; let interval = base - ((gameSpeed - 5) * 5); if (interval < min) interval = min; obstacleTimer++; if (obstacleTimer > interval) { obstacleTimer = 0; const oH = Math.floor(Math.random() * 50) + 20; const oW = 20 + Math.floor((gameSpeed - 5) / 2); obstacles.push({ x: canvasWidth, y: canvasHeight - groundHeight - oH, width: oW, height: oH }); } obstacles.forEach(o => o.x -= gameSpeed); obstacles = obstacles.filter(o => o.x + o.width > 0); }
function resetGame() { if (scoreAnimationInterval) clearInterval(scoreAnimationInterval); player.y = canvasHeight - groundHeight - player.height; player.velocityY = 0; player.isJumping = false; obstacles = []; score = 0; gameSpeed = 5; frameCount = 0; gameOver = false; obstacleTimer = 0; clouds = []; scoreSent = false; gameOverMessage.classList.add('hidden'); backgroundMusic.currentTime = 0; backgroundMusic.play(); gameLoop(); }
function gameLoop() { if (gameOver) { ctx.fillStyle = "rgba(0, 0, 0, 0.5)"; ctx.fillRect(0, 0, canvasWidth, canvasHeight); return; } frameCount++; score++; gameSpeed += 0.002; if (frameCount % 150 === 0) spawnCloud(); updatePlayer(); updateObstacles(); checkCollision(); const timeIndex = Math.floor(score / 1000) % timeCycles.length; const currentCycle = timeCycles[timeIndex]; drawRealisticSky(currentCycle.sky, currentCycle.celestialColor, currentCycle.stars); updateAndDrawClouds(); drawRealisticGround(currentCycle.ground); drawPlayer(); drawObstacles(); scoreDisplay.textContent = `Skor: ${Math.floor(score)}`; playerNameDisplay.textContent = playerName; requestAnimationFrame(gameLoop); }

startButton.addEventListener('click', () => {
    playerName = nameInput.value.trim();
    if (playerName === "") { alert("Nama tidak boleh kosong!"); return; }
    nameModal.style.display = 'none';
    mainContent.classList.remove('hidden-game');
    mainContent.style.display = 'flex';
    fetchLeaderboard();
    backgroundMusic.play();
    resetGame();
});

restartButton.addEventListener('click', resetGame);

function handleInteraction(event) {
    event.preventDefault();
    if (gameOver) return;
    if (!player.isJumping) {
        jumpSound.play();
        player.isJumping = true;
        player.velocityY = player.jumpPower;
    }
}
canvas.addEventListener('mousedown', handleInteraction);
canvas.addEventListener('touchstart', handleInteraction);

document.addEventListener('keydown', (e) => {
    if ((e.code === 'Space' || e.code === 'ArrowUp')) {
        e.preventDefault();
        if (!gameOver && !player.isJumping) {
            jumpSound.play();
            player.isJumping = true;
            player.velocityY = player.jumpPower;
        }
    }
});

document.addEventListener('keyup', (e) => {
    if ((e.code === 'Space' || e.code === 'ArrowUp')) {
        e.preventDefault();
        if (gameOver) {
            resetGame();
        }
    }
});