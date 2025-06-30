class MicrobiologyDragDropGame {
    constructor() {
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.gameRunning = false;
        this.matchedPairs = [];
        this.draggedElement = null;
        
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
    }
    
    startGame() {
        this.gameRunning = true;
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.matchedPairs = [];
        this.updateUI();
        this.renderCards();
        this.showFeedback("Game started! Drag characteristics onto the matching organisms.", "hint");
    }
    
    resetGame() {
        this.gameRunning = false;
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.matchedPairs = [];
        this.updateUI();
        this.renderCards();
        this.showFeedback("Game reset. Click 'Start Game' to begin!", "hint");
    }
    
    renderCards() {
        const organismsContainer = document.getElementById('organismsContainer');
        const characteristicsContainer = document.getElementById('characteristicsContainer');
        
        organismsContainer.innerHTML = '';
        characteristicsContainer.innerHTML = '';
        
        // Level progression: Specific number of characteristics per level
        let characteristicsPerLevel;
        if (this.level === 1) {
            characteristicsPerLevel = 4; // Level 1: 4 characteristics
        } else if (this.level === 2) {
            characteristicsPerLevel = 6; // Level 2: 6 characteristics
        } else if (this.level === 3) {
            characteristicsPerLevel = 8; // Level 3: 8 characteristics
        } else if (this.level === 4) {
            characteristicsPerLevel = 10; // Level 4: 10 characteristics
        } else if (this.level === 5) {
            characteristicsPerLevel = 12; // Level 5: 12 characteristics (max level)
        } else {
            characteristicsPerLevel = 12; // Beyond level 5: stay at max
        }
        
        // Show only 4 organisms on the left (2x2 grid)
        const displayedOrganisms = this.microbiologyData.slice(0, 4);
        
        // Create organism cards (show only 4 organisms in 2x2 grid)
        displayedOrganisms.forEach((data, index) => {
            const organismCard = this.createOrganismCard(data, index);
            organismsContainer.appendChild(organismCard);
        });
        
        // Get all characteristics that can be matched to the displayed organisms
        const availableCharacteristics = [];
        displayedOrganisms.forEach(data => {
            // Add microscopic morphology characteristics
            data.microscopicMorphology.forEach(char => {
                availableCharacteristics.push({
                    characteristic: char,
                    organism: data.organism,
                    type: 'microscopic'
                });
            });
            // Add cultural characteristics
            data.culturalCharacteristics.forEach(char => {
                availableCharacteristics.push({
                    characteristic: char,
                    organism: data.organism,
                    type: 'cultural'
                });
            });
        });
        
        // Shuffle and select only the required number for this level
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
        
        card.innerHTML = `
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
        
        // Check if this organism has this characteristic
        const organismData = this.microbiologyData.find(data => data.organism === organismName);
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
            this.matchedPairs.push(organismName);
            this.matchedPairs.push(characteristicText);
            
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
            this.checkLevelComplete();
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
    
    checkLevelComplete() {
        // Check if all characteristic cards are gone (right column is empty)
        const characteristicsContainer = document.getElementById('characteristicsContainer');
        const remainingCards = characteristicsContainer.querySelectorAll('.characteristic-card');
        
        if (remainingCards.length === 0) {
            // Level complete! All characteristic cards have been matched
            
            if (this.level >= 5) {
                // Game completed! All 5 levels finished
                this.gameCompleted();
            } else {
                // Move to next level
                this.level++;
                this.showFeedback(`🎉 Level ${this.level - 1} Complete! 🎉 Starting Level ${this.level}`, "correct");
                setTimeout(() => {
                    this.renderCards();
                }, 2000);
            }
        }
    }
    
    gameCompleted() {
        this.gameRunning = false;
        this.showFeedback(`🏆 CONGRATULATIONS! 🏆 You've completed all 5 levels! Final Score: ${this.score}`, "correct");
        
        // Add a celebration effect
        setTimeout(() => {
            this.showFeedback("🎊 You're a Microbiology Master! 🎊", "hint");
        }, 3000);
    }
    
    gameOver() {
        this.gameRunning = false;
        this.showFeedback(`Game Over! Final Score: ${this.score}`, "incorrect");
    }
    
    showHint() {
        if (!this.gameRunning) {
            this.showFeedback("Start the game first!", "hint");
            return;
        }
        
        // Get all organisms for hints
        const allOrganisms = this.microbiologyData;
        const unmatchedOrganisms = allOrganisms.filter(data => 
            !this.matchedPairs.includes(data.organism)
        );
        
        if (unmatchedOrganisms.length > 0) {
            const randomOrganism = unmatchedOrganisms[Math.floor(Math.random() * unmatchedOrganisms.length)];
            const allCharacteristics = [
                ...randomOrganism.microscopicMorphology,
                ...randomOrganism.culturalCharacteristics
            ];
            const hint = allCharacteristics[Math.floor(Math.random() * allCharacteristics.length)];
            this.showFeedback(`Hint: ${randomOrganism.organism} - ${hint}`, "hint");
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