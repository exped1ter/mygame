class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.score = 0;
        this.lives = 3;
        this.gameRunning = false;
        this.gamePaused = false;
        
        // Player properties
        this.player = {
            x: this.canvas.width / 2,
            y: this.canvas.height / 2,
            size: 20,
            speed: 5,
            color: '#4CAF50'
        };
        
        // Collectibles
        this.collectibles = [];
        this.maxCollectibles = 5;
        
        // Input handling
        this.keys = {};
        this.setupEventListeners();
        
        // Start the game loop
        this.gameLoop();
    }
    
    setupEventListeners() {
        // Keyboard events
        document.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });
        
        // Button events
        document.getElementById('startBtn').addEventListener('click', () => {
            this.startGame();
        });
        
        document.getElementById('pauseBtn').addEventListener('click', () => {
            this.togglePause();
        });
    }
    
    startGame() {
        this.gameRunning = true;
        this.gamePaused = false;
        this.score = 0;
        this.lives = 3;
        this.collectibles = [];
        this.updateUI();
        this.spawnCollectibles();
    }
    
    togglePause() {
        if (this.gameRunning) {
            this.gamePaused = !this.gamePaused;
        }
    }
    
    spawnCollectibles() {
        if (this.collectibles.length < this.maxCollectibles) {
            const collectible = {
                x: Math.random() * (this.canvas.width - 20),
                y: Math.random() * (this.canvas.height - 20),
                size: 15,
                color: `hsl(${Math.random() * 360}, 70%, 60%)`,
                speed: 1 + Math.random() * 2
            };
            this.collectibles.push(collectible);
        }
    }
    
    updatePlayer() {
        // Handle player movement
        if (this.keys['ArrowUp'] || this.keys['w']) {
            this.player.y = Math.max(this.player.size, this.player.y - this.player.speed);
        }
        if (this.keys['ArrowDown'] || this.keys['s']) {
            this.player.y = Math.min(this.canvas.height - this.player.size, this.player.y + this.player.speed);
        }
        if (this.keys['ArrowLeft'] || this.keys['a']) {
            this.player.x = Math.max(this.player.size, this.player.x - this.player.speed);
        }
        if (this.keys['ArrowRight'] || this.keys['d']) {
            this.player.x = Math.min(this.canvas.width - this.player.size, this.player.x + this.player.speed);
        }
    }
    
    updateCollectibles() {
        // Move collectibles
        this.collectibles.forEach(collectible => {
            collectible.y += collectible.speed;
            
            // Remove collectibles that fall off screen
            if (collectible.y > this.canvas.height) {
                const index = this.collectibles.indexOf(collectible);
                if (index > -1) {
                    this.collectibles.splice(index, 1);
                    this.lives--;
                    this.updateUI();
                }
            }
        });
        
        // Check collisions
        this.collectibles.forEach((collectible, index) => {
            const distance = Math.sqrt(
                Math.pow(this.player.x - collectible.x, 2) + 
                Math.pow(this.player.y - collectible.y, 2)
            );
            
            if (distance < this.player.size + collectible.size) {
                this.collectibles.splice(index, 1);
                this.score += 10;
                this.updateUI();
            }
        });
        
        // Spawn new collectibles
        if (Math.random() < 0.02) {
            this.spawnCollectibles();
        }
    }
    
    updateUI() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('lives').textContent = this.lives;
        
        // Check game over
        if (this.lives <= 0) {
            this.gameRunning = false;
            alert(`Game Over! Final Score: ${this.score}`);
        }
    }
    
    draw() {
        // Clear canvas
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw player
        this.ctx.fillStyle = this.player.color;
        this.ctx.beginPath();
        this.ctx.arc(this.player.x, this.player.y, this.player.size, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Add player glow effect
        this.ctx.shadowColor = this.player.color;
        this.ctx.shadowBlur = 10;
        this.ctx.fill();
        this.ctx.shadowBlur = 0;
        
        // Draw collectibles
        this.collectibles.forEach(collectible => {
            this.ctx.fillStyle = collectible.color;
            this.ctx.beginPath();
            this.ctx.arc(collectible.x, collectible.y, collectible.size, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Add collectible glow effect
            this.ctx.shadowColor = collectible.color;
            this.ctx.shadowBlur = 8;
            this.ctx.fill();
            this.ctx.shadowBlur = 0;
        });
        
        // Draw pause overlay
        if (this.gamePaused) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = 'white';
            this.ctx.font = '48px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('PAUSED', this.canvas.width / 2, this.canvas.height / 2);
        }
    }
    
    gameLoop() {
        if (this.gameRunning && !this.gamePaused) {
            this.updatePlayer();
            this.updateCollectibles();
        }
        
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }
}

// Initialize the game when the page loads
window.addEventListener('load', () => {
    new Game();
}); 