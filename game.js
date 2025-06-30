class MicrobiologyDragDropGame {
    constructor() {
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.gameRunning = false;
        this.matchedPairs = [];
        this.draggedElement = null;
        
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
        
        // Show organisms from the pool (up to 4)
        const displayedOrganisms = this.organismPool.slice(0, 4);
        
        // Create organism cards
        displayedOrganisms.forEach((data, index) => {
            const organismCard = this.createOrganismCard(data, index);
            organismsContainer.appendChild(organismCard);
        });
        
        // Determine how many characteristics to show based on level
        const characteristicsPerLevel = this.getExpectedCharacteristicsCount();
        
        // Get characteristics that can be matched to the displayed organisms
        const availableCharacteristics = [];
        displayedOrganisms.forEach(organism => {
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
        
        // Add drag event listeners
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
                organismCard.classList.add('matched');
                setTimeout(() => {
                    organismCard.remove();
                    console.log(`Organism card for ${organismName} removed from DOM`);
                    // After removing the card, check if we need to add a new organism to fill the display
                    this.fillOrganismDisplay();
                }, 500);
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
    
    fillOrganismDisplay() {
        const organismsContainer = document.getElementById('organismsContainer');
        const currentOrganismCards = organismsContainer.querySelectorAll('.organism-card');
        const maxOrganisms = 4; // Maximum organisms to display
        
        // If we have fewer than max organisms displayed and there are organisms in the pool
        if (currentOrganismCards.length < maxOrganisms && this.organismPool.length > 0) {
            const organismsToAdd = maxOrganisms - currentOrganismCards.length;
            const availableOrganisms = this.organismPool.filter(org => 
                !Array.from(currentOrganismCards).some(card => card.dataset.organism === org.organism)
            );
            
            // Add new organisms to fill the display
            for (let i = 0; i < Math.min(organismsToAdd, availableOrganisms.length); i++) {
                const organismData = availableOrganisms[i];
                const organismCard = this.createOrganismCard(organismData, currentOrganismCards.length + i);
                organismsContainer.appendChild(organismCard);
            }
            
            // After adding new organisms, refresh the characteristics to include new matches
            this.refreshCharacteristics();
        }
    }
    
    refreshCharacteristics() {
        const characteristicsContainer = document.getElementById('characteristicsContainer');
        const currentCharacteristics = characteristicsContainer.querySelectorAll('.characteristic-card');
        
        // Get all currently displayed organisms
        const displayedOrganisms = Array.from(document.querySelectorAll('.organism-card')).map(card => 
            card.dataset.organism
        );
        
        // Get characteristics that can be matched to the displayed organisms
        const availableCharacteristics = [];
        displayedOrganisms.forEach(organismName => {
            const organismCharacteristics = this.characteristicPool.filter(char => 
                char.organism === organismName && !char.matched
            );
            availableCharacteristics.push(...organismCharacteristics);
        });
        
        // If we have fewer characteristics than expected for the level, add more
        const expectedCharacteristics = this.getExpectedCharacteristicsCount();
        if (currentCharacteristics.length < expectedCharacteristics && availableCharacteristics.length > 0) {
            const characteristicsToAdd = expectedCharacteristics - currentCharacteristics.length;
            const shuffledCharacteristics = this.shuffleArray(availableCharacteristics);
            
            for (let i = 0; i < Math.min(characteristicsToAdd, shuffledCharacteristics.length); i++) {
                const charData = shuffledCharacteristics[i];
                const characteristicCard = this.createCharacteristicCard(charData, currentCharacteristics.length + i);
                characteristicsContainer.appendChild(characteristicCard);
            }
        }
    }
    
    getExpectedCharacteristicsCount() {
        if (this.level === 1) return 4;
        else if (this.level === 2) return 6;
        else if (this.level === 3) return 8;
        else if (this.level === 4) return 10;
        else return 12;
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