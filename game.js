class MicrobiologyGame {
    constructor() {
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.gameRunning = false;
        this.selectedOrganism = null;
        this.selectedCharacteristic = null;
        this.matchedPairs = [];
        
        // Microbiology data - organisms and their characteristics
        this.microbiologyData = [
            {
                organism: "Bacteria",
                icon: "🦠",
                description: "Single-celled prokaryotes",
                characteristics: [
                    "No nucleus",
                    "Cell wall made of peptidoglycan",
                    "Reproduce by binary fission",
                    "Can be beneficial or harmful"
                ]
            },
            {
                organism: "Virus",
                icon: "🦠",
                description: "Non-living infectious agent",
                characteristics: [
                    "Requires host cell to reproduce",
                    "Contains DNA or RNA",
                    "Cannot survive without host",
                    "Causes many diseases"
                ]
            },
            {
                organism: "Fungi",
                icon: "🍄",
                description: "Eukaryotic organisms",
                characteristics: [
                    "Have cell walls made of chitin",
                    "Decompose organic matter",
                    "Can be unicellular or multicellular",
                    "Reproduce by spores"
                ]
            },
            {
                organism: "Protozoa",
                icon: "🦠",
                description: "Single-celled eukaryotes",
                characteristics: [
                    "Have a nucleus",
                    "Move using cilia, flagella, or pseudopods",
                    "Live in water or moist environments",
                    "Some cause diseases like malaria"
                ]
            },
            {
                organism: "Algae",
                icon: "🌿",
                description: "Photosynthetic organisms",
                characteristics: [
                    "Produce oxygen through photosynthesis",
                    "Found in aquatic environments",
                    "Can be unicellular or multicellular",
                    "Base of many food chains"
                ]
            },
            {
                organism: "Archaea",
                icon: "🦠",
                description: "Ancient prokaryotes",
                characteristics: [
                    "Live in extreme environments",
                    "Cell wall different from bacteria",
                    "No nucleus",
                    "Some produce methane"
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
        this.selectedOrganism = null;
        this.selectedCharacteristic = null;
        this.updateUI();
        this.renderCards();
        this.showFeedback("Game started! Match the microorganisms with their characteristics.", "hint");
    }
    
    resetGame() {
        this.gameRunning = false;
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.matchedPairs = [];
        this.selectedOrganism = null;
        this.selectedCharacteristic = null;
        this.updateUI();
        this.renderCards();
        this.showFeedback("Game reset. Click 'Start Game' to begin!", "hint");
    }
    
    renderCards() {
        const organismsContainer = document.getElementById('organismsContainer');
        const characteristicsContainer = document.getElementById('characteristicsContainer');
        
        organismsContainer.innerHTML = '';
        characteristicsContainer.innerHTML = '';
        
        // Get current level data (show more organisms as level increases)
        const currentLevelData = this.microbiologyData.slice(0, Math.min(this.level + 2, this.microbiologyData.length));
        
        // Create organism cards
        currentLevelData.forEach((data, index) => {
            if (!this.matchedPairs.includes(data.organism)) {
                const organismCard = this.createCard(
                    data.organism,
                    data.icon,
                    data.description,
                    'organism',
                    index
                );
                organismsContainer.appendChild(organismCard);
            }
        });
        
        // Create characteristic cards (shuffled)
        const allCharacteristics = [];
        currentLevelData.forEach(data => {
            data.characteristics.forEach(char => {
                allCharacteristics.push({
                    characteristic: char,
                    organism: data.organism
                });
            });
        });
        
        // Shuffle characteristics
        const shuffledCharacteristics = this.shuffleArray(allCharacteristics);
        
        shuffledCharacteristics.forEach((charData, index) => {
            if (!this.matchedPairs.includes(charData.characteristic)) {
                const characteristicCard = this.createCard(
                    charData.characteristic,
                    "🔬",
                    "",
                    'characteristic',
                    index,
                    charData.organism
                );
                characteristicsContainer.appendChild(characteristicCard);
            }
        });
    }
    
    createCard(text, icon, description, type, index, correctOrganism = null) {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.type = type;
        card.dataset.index = index;
        if (correctOrganism) {
            card.dataset.correctOrganism = correctOrganism;
        }
        
        card.innerHTML = `
            <div class="card-icon">${icon}</div>
            <div class="card-text">${text}</div>
            ${description ? `<div class="card-description">${description}</div>` : ''}
        `;
        
        card.addEventListener('click', () => {
            this.handleCardClick(card, type, text, correctOrganism);
        });
        
        return card;
    }
    
    handleCardClick(card, type, text, correctOrganism) {
        if (!this.gameRunning || card.classList.contains('matched')) {
            return;
        }
        
        // Clear previous selections
        document.querySelectorAll('.card.selected').forEach(c => {
            c.classList.remove('selected');
        });
        
        if (type === 'organism') {
            this.selectedOrganism = text;
            this.selectedCharacteristic = null;
            card.classList.add('selected');
            this.showFeedback(`Selected: ${text}`, "hint");
        } else if (type === 'characteristic') {
            this.selectedCharacteristic = text;
            card.classList.add('selected');
            
            if (this.selectedOrganism) {
                this.checkMatch();
            } else {
                this.showFeedback("Please select an organism first!", "incorrect");
                card.classList.remove('selected');
            }
        }
    }
    
    checkMatch() {
        const organismCard = document.querySelector('.card.selected[data-type="organism"]');
        const characteristicCard = document.querySelector('.card.selected[data-type="characteristic"]');
        
        if (!organismCard || !characteristicCard) return;
        
        const selectedOrganism = this.selectedOrganism;
        const selectedCharacteristic = this.selectedCharacteristic;
        const correctOrganism = characteristicCard.dataset.correctOrganism;
        
        if (selectedOrganism === correctOrganism) {
            // Correct match!
            this.score += 10;
            this.matchedPairs.push(selectedOrganism);
            this.matchedPairs.push(selectedCharacteristic);
            
            organismCard.classList.remove('selected');
            organismCard.classList.add('matched');
            characteristicCard.classList.remove('selected');
            characteristicCard.classList.add('matched');
            
            this.showFeedback(`Correct! ${selectedOrganism} matches with ${selectedCharacteristic}`, "correct");
            
            // Check if level is complete
            this.checkLevelComplete();
        } else {
            // Wrong match!
            this.lives--;
            organismCard.classList.add('wrong');
            characteristicCard.classList.add('wrong');
            
            setTimeout(() => {
                organismCard.classList.remove('selected', 'wrong');
                characteristicCard.classList.remove('selected', 'wrong');
            }, 1000);
            
            this.showFeedback(`Incorrect! ${selectedCharacteristic} does not belong to ${selectedOrganism}`, "incorrect");
            
            if (this.lives <= 0) {
                this.gameOver();
            }
        }
        
        this.selectedOrganism = null;
        this.selectedCharacteristic = null;
        this.updateUI();
    }
    
    checkLevelComplete() {
        const currentLevelData = this.microbiologyData.slice(0, Math.min(this.level + 2, this.microbiologyData.length));
        const totalPairs = currentLevelData.length;
        const matchedPairs = this.matchedPairs.filter(item => 
            currentLevelData.some(data => data.organism === item)
        ).length;
        
        if (matchedPairs >= totalPairs) {
            this.level++;
            this.showFeedback(`Level ${this.level - 1} complete! Starting level ${this.level}`, "correct");
            setTimeout(() => {
                this.renderCards();
            }, 2000);
        }
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
        
        const currentLevelData = this.microbiologyData.slice(0, Math.min(this.level + 2, this.microbiologyData.length));
        const unmatchedOrganisms = currentLevelData.filter(data => 
            !this.matchedPairs.includes(data.organism)
        );
        
        if (unmatchedOrganisms.length > 0) {
            const randomOrganism = unmatchedOrganisms[Math.floor(Math.random() * unmatchedOrganisms.length)];
            const hint = randomOrganism.characteristics[Math.floor(Math.random() * randomOrganism.characteristics.length)];
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
    new MicrobiologyGame();
}); 