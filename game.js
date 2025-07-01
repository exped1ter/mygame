class MicrobiologyDragDropGame {
    constructor() {
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.gameRunning = false;
        this.matchedPairs = [];
        this.draggedElement = null;
        this.isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        
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
                    "MAC: LF/NLF",
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
                    "MAC: LF or NLF"
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
                    "MAC: LF or NLF"
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
        
        this.setupEventListeners();
        this.initializeGame();
    }
    
    setupEventListeners() {
        document.getElementById('startBtn').addEventListener('click', () => {
            this.startGame();
        });
        
        document.getElementById('resetBtn').addEventListener('click', () => {
            this.resetGame();
        });
        
        document.getElementById('hintBtn').addEventListener('click', () => {
            this.showHint();
        });
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
        
        // Enable/disable buttons
        startBtn.disabled = enabled;
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
        card.addEventListener('dragover', (e) => {
            e.preventDefault();
            card.classList.add('drag-over');
        });
        
        card.addEventListener('dragleave', (e) => {
            e.preventDefault();
            card.classList.remove('drag-over');
        });
        
        card.addEventListener('drop', (e) => {
            e.preventDefault();
            card.classList.remove('drag-over');
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
        
        card.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            touchStartX = touch.clientX;
            touchStartY = touch.clientY;
            isDragging = true; // Start dragging immediately
            
            this.draggedElement = card;
            card.classList.add('dragging');
        }, { passive: false });
        
        card.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            
            if (isDragging) {
                // Move the card with the touch immediately
                card.style.transform = `translate(${touch.clientX - touchStartX}px, ${touch.clientY - touchStartY}px)`;
                card.style.zIndex = '9999';
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
                
                // Reset card position
                card.style.transform = '';
                card.style.zIndex = '';
            }
            
            card.classList.remove('dragging');
            this.draggedElement = null;
            isDragging = false;
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
                
                // Temporarily disable interactions during level transition
                this.setGameState(false);
                
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
        this.showFeedback(`🏆 CONGRATULATIONS! 🏆 You've completed all levels! Final Score: ${this.score}`, "correct");
        
        // Add a celebration effect
        setTimeout(() => {
            this.showFeedback("🎊 You're a Microbiology Master! 🎊", "hint");
        }, 3000);
    }
    
    gameOver() {
        this.gameRunning = false;
        this.setGameState(false); // Disable interactions
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
        
        // Add sound effect (optional - browser compatibility)
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.1);
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
        } catch (e) {
            // Sound not supported, continue without it
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