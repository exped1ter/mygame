class MicrobiologyDragDropGame {
    constructor() {
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.gameRunning = false;
        this.matchedPairs = [];
        this.draggedElement = null;
        this.isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        
        // Sound system
        this.sounds = {
            correct: null,
            incorrect: null,
            button: null,
            levelComplete: null,
            gameComplete: null,
            gameOver: null,
            explosion: null,
            hint: null,
            start: null,
            reset: null
        };
        this.soundEnabled = true;
        this.volume = 0.5; // Default volume 50%
        this.audioContext = null;
        
        // Pool system for organisms and their characteristics
        this.organismPool = [];
        this.characteristicPool = [];
        
        // Custom microbiology data with organisms and their characteristics
        this.microbiologyData = [
            {
                organism: "Salmonella sp.",
                icon: "🦠",
                description: "Foodborne pathogen",
                microscopicMorphology: ["Gram-negative bacilli"],
                culturalCharacteristics: [
                    "Atmosphere: 37°C, O₂",
                    "MAC: NLF",
                    "XLD: red with black center"
                ]
            },
            {
                organism: "Shigella sp.",
                icon: "🦠",
                description: "Dysentery causing bacteria",
                microscopicMorphology: ["Gram-negative bacilli"],
                culturalCharacteristics: [
                    "Atmosphere: 37°C, O₂",
                    "MAC: NLF",
                    "XLD: colourless"
                ]
            },
            {
                organism: "E. coli O157:H7",
                icon: "🦠",
                description: "Enterohemorrhagic E. coli",
                microscopicMorphology: ["Gram-negative bacilli"],
                culturalCharacteristics: [
                    "Atmosphere: 37°C, O₂",
                    "MAC: LF",
                    "SMAC: NSF (colourless)"
                ]
            },
            {
                organism: "Yersinia enterocolitica",
                icon: "🦠",
                description: "Foodborne pathogen",
                microscopicMorphology: ["Gram-negative bacilli"],
                culturalCharacteristics: [
                    "Atmosphere: 25–30°C, O₂",
                    "MAC: NLF",
                    "CIN: red \"bull's eye\" colonies"
                ]
            },
            {
                organism: "Aeromonas hydrophila",
                icon: "🦠",
                description: "Aquatic pathogen",
                microscopicMorphology: ["Gram-negative bacilli"],
                culturalCharacteristics: [
                    "Atmosphere: 37°C, O₂",
                    "BA: large, round, β-hemolytic",
                    "MAC: NLF"
                ]
            },
            {
                organism: "Plesiomonas shigelloides",
                icon: "🦠",
                description: "Aquatic bacteria",
                microscopicMorphology: ["Pleomorphic Gram-negative bacilli"],
                culturalCharacteristics: [
                    "Atmosphere: 37°C, O₂",
                    "BA: grey, shiny, nonhemolytic",
                    "MAC: NLF"
                ]
            },
            {
                organism: "Vibrio sp.",
                icon: "🦠",
                description: "Marine bacteria",
                microscopicMorphology: ["Gram-negative bacilli (may be slightly curved)"],
                culturalCharacteristics: [
                    "Atmosphere: 37°C, O₂",
                    "BA: small-large, iridescent with greenish hue"
                ]
            },
            {
                organism: "Campylobacter sp.",
                icon: "🦠",
                description: "Foodborne pathogen",
                microscopicMorphology: ["Small Gram-negative bacilli (seagull or curved shape)"],
                culturalCharacteristics: [
                    "Atmosphere: 42°C, microaerophilic",
                    "Campylobacter agar: greyish-pink mucoid colonies"
                ]
            },
            {
                organism: "Helicobacter pylori",
                icon: "🦠",
                description: "Gastric pathogen",
                microscopicMorphology: ["Gram-negative seagull or curved bacilli"],
                culturalCharacteristics: [
                    "Atmosphere: 37°C, microaerophilic",
                    "Helicobacter agar: small, translucent colonies"
                ]
            },
            {
                organism: "Clostridium difficile",
                icon: "🦠",
                description: "Anaerobic pathogen",
                microscopicMorphology: ["Gram-positive bacilli"],
                culturalCharacteristics: [
                    "Atmosphere: 37°C, anaerobic"
                ]
            }
        ];
        
        this.initializeAudio();
        this.setupEventListeners();
        this.initializeGame();
    }
    
    initializeAudio() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('Audio not supported');
            this.soundEnabled = false;
        }
    }
    
    playSound(type) {
        if (!this.soundEnabled || !this.audioContext) return;
        
        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            // Apply volume control
            const baseVolume = this.getBaseVolume(type);
            const finalVolume = baseVolume * this.volume;
            
            switch (type) {
                case 'correct':
                    // Success sound - ascending notes
                    oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
                    oscillator.frequency.exponentialRampToValueAtTime(1200, this.audioContext.currentTime + 0.1);
                    gainNode.gain.setValueAtTime(finalVolume, this.audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
                    oscillator.start(this.audioContext.currentTime);
                    oscillator.stop(this.audioContext.currentTime + 0.1);
                    
                    // Second note
                    setTimeout(() => {
                        const osc2 = this.audioContext.createOscillator();
                        const gain2 = this.audioContext.createGain();
                        osc2.connect(gain2);
                        gain2.connect(this.audioContext.destination);
                        osc2.frequency.setValueAtTime(1000, this.audioContext.currentTime);
                        osc2.frequency.exponentialRampToValueAtTime(1400, this.audioContext.currentTime + 0.1);
                        gain2.gain.setValueAtTime(finalVolume, this.audioContext.currentTime);
                        gain2.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
                        osc2.start(this.audioContext.currentTime);
                        osc2.stop(this.audioContext.currentTime + 0.1);
                    }, 100);
                    break;
                    
                case 'incorrect':
                    // Error sound - descending notes
                    oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime);
                    oscillator.frequency.exponentialRampToValueAtTime(200, this.audioContext.currentTime + 0.2);
                    gainNode.gain.setValueAtTime(finalVolume, this.audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
                    oscillator.start(this.audioContext.currentTime);
                    oscillator.stop(this.audioContext.currentTime + 0.2);
                    break;
                    
                case 'button':
                    // Button click sound
                    oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime);
                    oscillator.frequency.exponentialRampToValueAtTime(400, this.audioContext.currentTime + 0.05);
                    gainNode.gain.setValueAtTime(finalVolume, this.audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.05);
                    oscillator.start(this.audioContext.currentTime);
                    oscillator.stop(this.audioContext.currentTime + 0.05);
                    break;
                    
                case 'levelComplete':
                    // Level completion - ascending arpeggio
                    const notes = [800, 1000, 1200, 1400];
                    notes.forEach((freq, index) => {
                        setTimeout(() => {
                            const osc = this.audioContext.createOscillator();
                            const gain = this.audioContext.createGain();
                            osc.connect(gain);
                            gain.connect(this.audioContext.destination);
                            osc.frequency.setValueAtTime(freq, this.audioContext.currentTime);
                            gain.gain.setValueAtTime(finalVolume, this.audioContext.currentTime);
                            gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
                            osc.start(this.audioContext.currentTime);
                            osc.stop(this.audioContext.currentTime + 0.1);
                        }, index * 100);
                    });
                    break;
                    
                case 'gameComplete':
                    // Game completion - victory fanfare
                    const victoryNotes = [800, 1000, 1200, 1400, 1600, 1400, 1200, 1000, 800];
                    victoryNotes.forEach((freq, index) => {
                        setTimeout(() => {
                            const osc = this.audioContext.createOscillator();
                            const gain = this.audioContext.createGain();
                            osc.connect(gain);
                            gain.connect(this.audioContext.destination);
                            osc.frequency.setValueAtTime(freq, this.audioContext.currentTime);
                            gain.gain.setValueAtTime(finalVolume, this.audioContext.currentTime);
                            gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
                            osc.start(this.audioContext.currentTime);
                            osc.stop(this.audioContext.currentTime + 0.1);
                        }, index * 80);
                    });
                    break;
                    
                case 'gameOver':
                    // Game over - sad descending notes
                    const gameOverNotes = [600, 500, 400, 300];
                    gameOverNotes.forEach((freq, index) => {
                        setTimeout(() => {
                            const osc = this.audioContext.createOscillator();
                            const gain = this.audioContext.createGain();
                            osc.connect(gain);
                            gain.connect(this.audioContext.destination);
                            osc.frequency.setValueAtTime(freq, this.audioContext.currentTime);
                            gain.gain.setValueAtTime(finalVolume, this.audioContext.currentTime);
                            gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
                            osc.start(this.audioContext.currentTime);
                            osc.stop(this.audioContext.currentTime + 0.2);
                        }, index * 200);
                    });
                    break;
                    
                case 'explosion':
                    // Explosion sound - noise burst
                    oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
                    oscillator.frequency.exponentialRampToValueAtTime(200, this.audioContext.currentTime + 0.1);
                    gainNode.gain.setValueAtTime(finalVolume, this.audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
                    oscillator.start(this.audioContext.currentTime);
                    oscillator.stop(this.audioContext.currentTime + 0.1);
                    break;
                    
                case 'hint':
                    // Hint sound - gentle ping
                    oscillator.frequency.setValueAtTime(700, this.audioContext.currentTime);
                    oscillator.frequency.exponentialRampToValueAtTime(900, this.audioContext.currentTime + 0.1);
                    gainNode.gain.setValueAtTime(finalVolume, this.audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
                    oscillator.start(this.audioContext.currentTime);
                    oscillator.stop(this.audioContext.currentTime + 0.1);
                    break;
                    
                case 'start':
                    // Start game sound
                    oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime);
                    oscillator.frequency.exponentialRampToValueAtTime(800, this.audioContext.currentTime + 0.1);
                    gainNode.gain.setValueAtTime(finalVolume, this.audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
                    oscillator.start(this.audioContext.currentTime);
                    oscillator.stop(this.audioContext.currentTime + 0.1);
                    break;
                    
                case 'reset':
                    // Reset sound
                    oscillator.frequency.setValueAtTime(500, this.audioContext.currentTime);
                    oscillator.frequency.exponentialRampToValueAtTime(300, this.audioContext.currentTime + 0.1);
                    gainNode.gain.setValueAtTime(finalVolume, this.audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
                    oscillator.start(this.audioContext.currentTime);
                    oscillator.stop(this.audioContext.currentTime + 0.1);
                    break;
            }
        } catch (e) {
            console.log('Sound playback error:', e);
        }
    }
    
    getBaseVolume(type) {
        switch (type) {
            case 'correct': return 0.15;
            case 'incorrect': return 0.12;
            case 'button': return 0.08;
            case 'levelComplete': return 0.12;
            case 'gameComplete': return 0.15;
            case 'gameOver': return 0.12;
            case 'explosion': return 0.1;
            case 'hint': return 0.06;
            case 'start': return 0.1;
            case 'reset': return 0.1;
            default: return 0.1;
        }
    }
    
    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        const soundBtn = document.getElementById('soundBtn');
        if (soundBtn) {
            soundBtn.textContent = this.soundEnabled ? '🔊' : '🔇';
            soundBtn.title = this.soundEnabled ? 'Disable Sound' : 'Enable Sound';
        }
        this.playSound('button');
    }
    
    setupEventListeners() {
        document.getElementById('startBtn').addEventListener('click', () => {
            this.playSound('start');
            this.startGame();
        });
        
        document.getElementById('resetBtn').addEventListener('click', () => {
            this.playSound('reset');
            this.resetGame();
        });
        
        document.getElementById('hintBtn').addEventListener('click', () => {
            this.playSound('hint');
            this.showHint();
        });
        
        // Add sound toggle button event listener
        const soundBtn = document.getElementById('soundBtn');
        if (soundBtn) {
            soundBtn.addEventListener('click', () => {
                this.toggleSound();
            });
        }
        
        // Add volume slider event listener
        const volumeSlider = document.getElementById('volumeSlider');
        if (volumeSlider) {
            volumeSlider.addEventListener('input', (e) => {
                this.volume = e.target.value / 100;
                this.playSound('button'); // Play test sound when adjusting volume
            });
        }
    }
    
    initializeGame() {
        this.updateUI();
        this.renderCards();
        this.setGameState(false); // Disable interactions initially
        
        // Update instructions for touch devices
        if (this.isTouchDevice) {
            const instructionsText = document.getElementById('instructions-text');
            if (instructionsText) {
                instructionsText.textContent = 'Touch and drag the characteristic cards from the right and drop them onto the matching organisms on the left!';
            }
        }
    }
    
    initializePools() {
        // Reset pools with all organisms and their characteristics
        this.organismPool = [...this.microbiologyData];
        this.characteristicPool = [];
        
        // Build characteristic pool with organism tracking
        this.organismPool.forEach(organism => {
            organism.microscopicMorphology.forEach(char => {
                this.characteristicPool.push({
                    characteristic: char,
                    organism: organism.organism,
                    type: 'microscopic',
                    matched: false
                });
            });
            organism.culturalCharacteristics.forEach(char => {
                this.characteristicPool.push({
                    characteristic: char,
                    organism: organism.organism,
                    type: 'cultural',
                    matched: false
                });
            });
        });
        
        // Shuffle the characteristic pool
        this.characteristicPool = this.shuffleArray(this.characteristicPool);
    }
    
    setGameState(enabled) {
        const organismCards = document.querySelectorAll('.organism-card');
        const characteristicCards = document.querySelectorAll('.characteristic-card');
        const startBtn = document.getElementById('startBtn');
        const resetBtn = document.getElementById('resetBtn');
        const hintBtn = document.getElementById('hintBtn');
        
        organismCards.forEach(card => {
            if (enabled) {
                card.classList.remove('disabled');
                card.style.pointerEvents = 'auto';
            } else {
                card.classList.add('disabled');
                card.style.pointerEvents = 'none';
            }
        });
        
        characteristicCards.forEach(card => {
            if (enabled) {
                card.classList.remove('disabled');
                card.draggable = true;
                card.style.pointerEvents = 'auto';
            } else {
                card.classList.add('disabled');
                card.draggable = false;
                card.style.pointerEvents = 'none';
            }
        });
        
        // Enable/disable buttons based on game state
        // Start button should only be enabled when game is NOT running
        startBtn.disabled = this.gameRunning;
        resetBtn.disabled = !enabled;
        hintBtn.disabled = !enabled;
    }
    
    startGame() {
        this.gameRunning = true;
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.matchedPairs = [];
        this.initializePools();
        this.updateUI();
        this.renderCards();
        this.setGameState(true); // Enable interactions
        this.showFeedback("Game started! Drag characteristics onto the matching organisms.", "hint");
    }
    
    resetGame() {
        this.gameRunning = false;
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.matchedPairs = [];
        this.initializePools();
        this.updateUI();
        this.renderCards();
        this.setGameState(false); // Disable interactions
        this.showFeedback("Game reset. Click 'Start Game' to begin!", "hint");
    }
    
    renderCards() {
        const organismsContainer = document.getElementById('organismsContainer');
        const characteristicsContainer = document.getElementById('characteristicsContainer');
        
        organismsContainer.innerHTML = '';
        characteristicsContainer.innerHTML = '';
        
        // Show organisms from the pool (up to 4) - fill up to max for new level
        const maxOrganisms = 4;
        const availableOrganisms = this.organismPool.slice(0, maxOrganisms);
        
        // Create organism cards
        availableOrganisms.forEach((data, index) => {
            const organismCard = this.createOrganismCard(data, index);
            organismsContainer.appendChild(organismCard);
        });
        
        // Determine how many characteristics to show based on level
        const characteristicsPerLevel = this.getExpectedCharacteristicsCount();
        
        // Get characteristics that can be matched to the displayed organisms
        const availableCharacteristics = [];
        availableOrganisms.forEach(organism => {
            // Get unmatched characteristics for this organism
            const organismCharacteristics = this.characteristicPool.filter(char => 
                char.organism === organism.organism && !char.matched
            );
            availableCharacteristics.push(...organismCharacteristics);
        });
        
        // Shuffle and select characteristics for this level
        const shuffledCharacteristics = this.shuffleArray(availableCharacteristics);
        const selectedCharacteristics = shuffledCharacteristics.slice(0, Math.min(characteristicsPerLevel, shuffledCharacteristics.length));
        
        selectedCharacteristics.forEach((charData, index) => {
            const characteristicCard = this.createCharacteristicCard(charData, index);
            characteristicsContainer.appendChild(characteristicCard);
        });
    }
    
    createOrganismCard(data, index) {
        const card = document.createElement('div');
        card.className = 'organism-card';
        card.dataset.organism = data.organism;
        card.dataset.index = index;
        
        // Calculate progress for this organism
        const totalCharacteristics = data.microscopicMorphology.length + data.culturalCharacteristics.length;
        const matchedCharacteristics = this.matchedPairs.filter(pair => pair.organism === data.organism).length;
        
        card.innerHTML = `
            <div class="progress-counter">${matchedCharacteristics}/${totalCharacteristics}</div>
            <div class="card-icon">${data.icon}</div>
            <div class="card-text">${data.organism}</div>
            <div class="card-description">${data.description}</div>
        `;
        
        // Add drag and drop event listeners
        let soundPlayed = false;
        card.addEventListener('dragover', (e) => {
            e.preventDefault();
            if (!card.classList.contains('drag-over')) {
                card.classList.add('drag-over');
                if (!soundPlayed) {
                    this.playSound('hint'); // Play gentle sound when hovering over organism
                    soundPlayed = true;
                }
            }
        });
        
        card.addEventListener('dragleave', (e) => {
            e.preventDefault();
            card.classList.remove('drag-over');
            soundPlayed = false; // Reset sound flag when leaving
        });
        
        card.addEventListener('drop', (e) => {
            e.preventDefault();
            card.classList.remove('drag-over');
            soundPlayed = false; // Reset sound flag on drop
            this.handleDrop(card, this.draggedElement);
        });
        
        return card;
    }
    
    createCharacteristicCard(charData, index) {
        const card = document.createElement('div');
        card.className = `characteristic-card ${charData.type}-card`;
        card.dataset.characteristic = charData.characteristic;
        card.dataset.organism = charData.organism;
        card.dataset.type = charData.type;
        card.dataset.index = index;
        card.draggable = true;
        
        card.innerHTML = `
            <div class="card-text">${charData.characteristic}</div>
            <div class="card-type">${charData.type === 'microscopic' ? '🔬' : '🧫'}</div>
        `;
        
        // Add drag event listeners for desktop
        card.addEventListener('dragstart', (e) => {
            this.draggedElement = card;
            card.classList.add('dragging');
            this.playSound('button'); // Play sound when starting to drag
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/html', card.outerHTML);
        });
        
        card.addEventListener('dragend', (e) => {
            card.classList.remove('dragging');
            this.draggedElement = null;
        });
        
        // Add touch event listeners for mobile
        let touchStartX = 0;
        let touchStartY = 0;
        let isDragging = false;
        let ghostElement = null;
        let lastHoveredCard = null; // Track which card we last hovered over
        
        card.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            touchStartX = touch.clientX;
            touchStartY = touch.clientY;
            isDragging = true; // Start dragging immediately
            
            this.draggedElement = card;
            card.classList.add('dragging');
            this.playSound('button'); // Play sound when starting to drag
            
            // Create ghost element
            ghostElement = card.cloneNode(true);
            ghostElement.classList.add('ghost-element');
            ghostElement.style.position = 'fixed';
            ghostElement.style.pointerEvents = 'none';
            ghostElement.style.zIndex = '9999';
            ghostElement.style.opacity = '0.8';
            ghostElement.style.transform = 'scale(1.1)';
            document.body.appendChild(ghostElement);
            
            // Hide original card
            card.style.opacity = '0.3';
        }, { passive: false });
        
        card.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            
            if (isDragging && ghostElement) {
                // Move ghost element with the touch
                ghostElement.style.left = `${touch.clientX - ghostElement.offsetWidth / 2}px`;
                ghostElement.style.top = `${touch.clientY - ghostElement.offsetHeight / 2}px`;
                
                // Check for organism cards under the ghost
                const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
                const organismCard = elementBelow?.closest('.organism-card');
                
                // Remove highlight from all organism cards
                document.querySelectorAll('.organism-card').forEach(org => {
                    org.classList.remove('drag-over');
                });
                
                // Add highlight to organism card under ghost
                if (organismCard && !organismCard.classList.contains('drag-over')) {
                    organismCard.classList.add('drag-over');
                    // Only play sound if we're hovering over a different card
                    if (lastHoveredCard !== organismCard) {
                        this.playSound('hint'); // Play gentle sound when hovering over organism
                        lastHoveredCard = organismCard;
                    }
                }
            }
        }, { passive: false });
        
        card.addEventListener('touchend', (e) => {
            e.preventDefault();
            
            if (isDragging) {
                const touch = e.changedTouches[0];
                const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
                
                // Find the organism card that was dropped on
                const organismCard = elementBelow?.closest('.organism-card');
                
                if (organismCard) {
                    console.log('Touch drop detected:', organismCard.dataset.organism);
                    this.handleDrop(organismCard, card);
                } else {
                    console.log('No organism card found at drop location');
                }
                
                // Remove highlight from all organism cards
                document.querySelectorAll('.organism-card').forEach(org => {
                    org.classList.remove('drag-over');
                });
            }
            
            // Clean up ghost element
            if (ghostElement) {
                ghostElement.remove();
                ghostElement = null;
            }
            
            // Reset original card
            card.style.opacity = '';
            card.classList.remove('dragging');
            this.draggedElement = null;
            isDragging = false;
            lastHoveredCard = null; // Reset hover tracking
        }, { passive: false });
        
        // Handle touch cancel (e.g., when user touches elsewhere)
        card.addEventListener('touchcancel', (e) => {
            e.preventDefault();
            
            // Remove highlight from all organism cards
            document.querySelectorAll('.organism-card').forEach(org => {
                org.classList.remove('drag-over');
            });
            
            // Clean up ghost element
            if (ghostElement) {
                ghostElement.remove();
                ghostElement = null;
            }
            
            // Reset original card
            card.style.opacity = '';
            card.classList.remove('dragging');
            this.draggedElement = null;
            isDragging = false;
            lastHoveredCard = null; // Reset hover tracking
        }, { passive: false });
        
        return card;
    }
    
    handleDrop(organismCard, characteristicCard) {
        if (!this.gameRunning || !characteristicCard || characteristicCard.classList.contains('matched')) {
            return;
        }
        
        const organismName = organismCard.dataset.organism;
        const characteristicText = characteristicCard.dataset.characteristic;
        const characteristicType = characteristicCard.dataset.type;
        const characteristicOrganism = characteristicCard.dataset.organism;
        
        // Check if this characteristic has already been matched to this organism
        const alreadyMatched = this.matchedPairs.some(pair => 
            pair.organism === organismName && pair.characteristic === characteristicText
        );
        
        if (alreadyMatched) {
            // Already matched - show warning but don't lose life
            this.showFeedback(`This characteristic has already been matched to ${organismName}!`, "hint");
            return;
        }
        
        // Check if this organism has this characteristic
        const organismData = this.organismPool.find(data => data.organism === organismName);
        let isCorrectMatch = false;
        
        if (organismData) {
            if (characteristicType === 'microscopic') {
                isCorrectMatch = organismData.microscopicMorphology.includes(characteristicText);
            } else if (characteristicType === 'cultural') {
                isCorrectMatch = organismData.culturalCharacteristics.includes(characteristicText);
            }
        }
        
        if (isCorrectMatch) {
            // Correct match!
            this.score += 10;
            this.playSound('correct');
            
            // Mark this characteristic as matched in the pool
            const poolCharacteristic = this.characteristicPool.find(char => 
                char.characteristic === characteristicText && 
                char.organism === characteristicOrganism &&
                char.type === characteristicType
            );
            if (poolCharacteristic) {
                poolCharacteristic.matched = true;
            }
            
            // Add to matched pairs
            this.matchedPairs.push({
                organism: organismName,
                characteristic: characteristicText,
                type: characteristicType
            });
            
            console.log(`Match made: ${organismName} - ${characteristicText}`);
            console.log(`Total matches for ${organismName}: ${this.matchedPairs.filter(pair => pair.organism === organismName).length}`);
            
            // Update progress counter for this organism
            this.updateOrganismProgress(organismName);
            
            // Check if organism is completely matched BEFORE removing from pool
            this.checkOrganismComplete(organismName);
            
            // Visual feedback for correct match
            organismCard.classList.add('matched');
            characteristicCard.classList.add('matched');
            
            // Remove the characteristic card after animation
            setTimeout(() => {
                characteristicCard.remove();
            }, 300);
            
            // Return organism card to normal after 1 second
            setTimeout(() => {
                organismCard.classList.remove('matched');
            }, 1000);
            
            this.showFeedback(`Correct! ${organismName} matches with ${characteristicText}`, "correct");
            
            // Check if level is complete (all characteristic cards are gone)
            setTimeout(() => {
                this.checkLevelComplete();
            }, 300);
        } else {
            // Wrong match!
            this.lives--;
            this.playSound('incorrect');
            organismCard.classList.add('wrong-drop');
            characteristicCard.classList.add('wrong-drop');
            
            setTimeout(() => {
                organismCard.classList.remove('wrong-drop');
                characteristicCard.classList.remove('wrong-drop');
            }, 1000);
            
            this.showFeedback(`Incorrect! ${characteristicText} does not belong to ${organismName}`, "incorrect");
            
            if (this.lives <= 0) {
                this.gameOver();
            }
        }
        
        this.updateUI();
    }
    
    checkOrganismComplete(organismName) {
        const organism = this.organismPool.find(org => org.organism === organismName);
        if (!organism) {
            console.log(`Organism ${organismName} not found in pool, skipping completion check`);
            return;
        }
        
        // Calculate total characteristics for this organism
        const totalCharacteristics = organism.microscopicMorphology.length + organism.culturalCharacteristics.length;
        
        // Count how many characteristics have been matched for this organism
        const matchedCharacteristics = this.matchedPairs.filter(pair => pair.organism === organismName).length;
        
        // Check if all characteristics have been matched
        const allMatched = matchedCharacteristics >= totalCharacteristics;
        
        console.log(`Checking ${organismName}: ${matchedCharacteristics}/${totalCharacteristics} - All matched: ${allMatched}`);
        
        if (allMatched) {
            console.log(`Removing ${organismName} from pool and display`);
            
            // Remove organism from pool
            this.organismPool = this.organismPool.filter(org => org.organism !== organismName);
            
            // Find and remove the organism card from the display
            const organismCard = document.querySelector(`[data-organism="${organismName}"]`);
            if (organismCard) {
                console.log(`Found organism card for ${organismName}, removing...`);
                
                // Create explosion effect
                this.createExplosionEffect(organismCard);
                
                // Remove the card after explosion animation (NO replacement)
                setTimeout(() => {
                    organismCard.remove();
                    console.log(`Organism card for ${organismName} removed from DOM`);
                    // Don't add new organisms - let them stay removed until next level
                }, 1000); // Increased delay to allow explosion animation to complete
            } else {
                console.log(`Organism card for ${organismName} not found in DOM`);
            }
            
            this.showFeedback(`🎉 ${organismName} completely matched! Removed from display.`, "correct");
        }
    }
    
    checkLevelComplete() {
        // Check if all characteristic cards are gone (right column is empty)
        const characteristicsContainer = document.getElementById('characteristicsContainer');
        const remainingCards = characteristicsContainer.querySelectorAll('.characteristic-card');
        
        if (remainingCards.length === 0) {
            // Level complete! All characteristic cards have been matched
            
            // Check if game is complete (no more organisms or characteristics)
            if (this.organismPool.length === 0 || this.characteristicPool.filter(char => !char.matched).length === 0) {
                // Game completed! All organisms and characteristics matched
                this.gameCompleted();
            } else {
                // Move to next level
                this.level++;
                this.playSound('levelComplete');
                
                // Temporarily disable interactions during level transition
                this.setGameState(false);
                this.updateButtonStates(); // Ensure start button stays disabled
                
                // Show level completion message
                this.showFeedback(`🎉 LEVEL ${this.level - 1} COMPLETE! 🎉`, "correct");
                
                // Show next level message after a delay
                setTimeout(() => {
                    this.showFeedback(`Starting Level ${this.level}...`, "hint");
                }, 1500);
                
                // Start new level after delay
                setTimeout(() => {
                    this.renderCards();
                    this.setGameState(true); // Re-enable interactions
                }, 3000);
            }
        }
    }
    
    gameCompleted() {
        this.gameRunning = false;
        this.setGameState(false); // Disable interactions
        this.playSound('gameComplete');
        this.showFeedback(`🏆 CONGRATULATIONS! 🏆 You've completed all levels! Final Score: ${this.score}`, "correct");
        
        // Add a celebration effect
        setTimeout(() => {
            this.showFeedback("🎊 You're a Microbiology Master! 🎊", "hint");
        }, 3000);
    }
    
    gameOver() {
        this.gameRunning = false;
        this.setGameState(false); // Disable interactions
        this.playSound('gameOver');
        this.showFeedback(`Game Over! Final Score: ${this.score}`, "incorrect");
    }
    
    showHint() {
        if (!this.gameRunning) {
            this.showFeedback("Start the game first!", "hint");
            return;
        }
        
        // Get unmatched organisms from pool
        const unmatchedOrganisms = this.organismPool;
        
        if (unmatchedOrganisms.length > 0) {
            const randomOrganism = unmatchedOrganisms[Math.floor(Math.random() * unmatchedOrganisms.length)];
            const unmatchedCharacteristics = this.characteristicPool.filter(char => 
                char.organism === randomOrganism.organism && !char.matched
            );
            
            if (unmatchedCharacteristics.length > 0) {
                const hint = unmatchedCharacteristics[Math.floor(Math.random() * unmatchedCharacteristics.length)];
                this.showFeedback(`Hint: ${randomOrganism.organism} - ${hint.characteristic}`, "hint");
            } else {
                this.showFeedback(`Hint: ${randomOrganism.organism} is already completely matched!`, "hint");
            }
        }
    }
    
    showFeedback(message, type) {
        const feedback = document.getElementById('feedback');
        feedback.textContent = message;
        feedback.className = `feedback ${type}`;
        
        setTimeout(() => {
            feedback.textContent = '';
            feedback.className = 'feedback';
        }, 3000);
    }
    
    // fillOrganismDisplay method removed - organisms are not replaced during the level
    
    // refreshCharacteristics method removed - characteristics are not refreshed during the level
    
    getExpectedCharacteristicsCount() {
        // Always limit to max 6 characteristics
        return 6;
    }
    
    createExplosionEffect(organismCard) {
        // Add explosion class to the organism card
        organismCard.classList.add('exploding');
        
        // Play explosion sound
        this.playSound('explosion');
        
        // Create explosion particles
        const rect = organismCard.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Create multiple particles
        for (let i = 0; i < 12; i++) {
            const particle = document.createElement('div');
            particle.className = 'explosion-particle';
            
            // Random direction for each particle
            const angle = (i / 12) * 2 * Math.PI;
            const distance = 50 + Math.random() * 50;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;
            
            particle.style.setProperty('--x', `${x}px`);
            particle.style.setProperty('--y', `${y}px`);
            particle.style.left = `${centerX}px`;
            particle.style.top = `${centerY}px`;
            
            document.body.appendChild(particle);
            
            // Remove particle after animation
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 1000);
        }
    }
    
    updateOrganismProgress(organismName) {
        // Find the organism card and update its progress counter
        const organismCard = document.querySelector(`[data-organism="${organismName}"]`);
        if (organismCard) {
            const organismData = this.organismPool.find(org => org.organism === organismName);
            if (organismData) {
                const totalCharacteristics = organismData.microscopicMorphology.length + organismData.culturalCharacteristics.length;
                const matchedCharacteristics = this.matchedPairs.filter(pair => pair.organism === organismName).length;
                
                const progressCounter = organismCard.querySelector('.progress-counter');
                if (progressCounter) {
                    progressCounter.textContent = `${matchedCharacteristics}/${totalCharacteristics}`;
                }
            }
        }
    }
    
    updateUI() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('lives').textContent = this.lives;
        document.getElementById('level').textContent = this.level;
        
        // Update button states
        this.updateButtonStates();
    }
    
    updateButtonStates() {
        const startBtn = document.getElementById('startBtn');
        const resetBtn = document.getElementById('resetBtn');
        const hintBtn = document.getElementById('hintBtn');
        
        // Start button should only be enabled when game is NOT running
        startBtn.disabled = this.gameRunning;
        
        // Reset and hint buttons should be enabled when game is running and interactions are enabled
        const organismCards = document.querySelectorAll('.organism-card');
        const hasActiveCards = organismCards.length > 0 && !organismCards[0].classList.contains('disabled');
        resetBtn.disabled = !this.gameRunning || !hasActiveCards;
        hintBtn.disabled = !this.gameRunning || !hasActiveCards;
    }
    
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
}

// Initialize the game when the page loads
window.addEventListener('load', () => {
    new MicrobiologyDragDropGame();
}); 