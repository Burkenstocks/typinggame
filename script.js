class TypingGame {
    constructor() {
        window.typingGame = this;  // Store the instance globally
        
        this.poemText = document.getElementById('poem-text');
        this.userInput = document.getElementById('user-input');
        this.garden = document.getElementById('flower-garden');
        this.accuracyDisplay = document.getElementById('accuracy');
        this.wpmDisplay = document.getElementById('wpm');
        
        this.currentPoem = null;
        this.startTime = null;
        this.flowerColors = ['🌸', '🌹', '🌺', '🌻', '🌼', '🌷'];
        this.scaryEmojis = ['🧟', '🧟‍♂️', '🧟‍♀️', '💀', '☠️'];  // Add scary emojis
        
        this.submitBtn = document.getElementById('submit-btn');
        
        // Create modal elements
        this.createModal();
        
        this.init();
    }

    init() {
        this.selectRandomPoem();
        this.userInput.addEventListener('input', () => this.handleInput());
        this.submitBtn.addEventListener('click', () => this.handleSubmit());
    }

    selectRandomPoem() {
        this.currentPoem = poems[Math.floor(Math.random() * poems.length)];
        document.getElementById('poem-title').textContent = `${this.currentPoem.title} by ${this.currentPoem.author}`;
        this.poemText.textContent = this.currentPoem.text;
    }

    handleInput() {
        if (!this.startTime) {
            this.startTime = new Date();
        }

        const userText = this.userInput.value;
        const poemText = this.currentPoem.text;
        
        // Check only the last character typed
        if (userText.length > 0) {
            const lastCharIndex = userText.length - 1;
            const isCorrect = userText[lastCharIndex] === poemText[lastCharIndex];
            this.createFlower(isCorrect);
        }
        
        // Calculate accuracy
        let correct = 0;
        for (let i = 0; i < userText.length; i++) {
            if (userText[i] === poemText[i]) {
                correct++;
            }
        }
        
        const accuracy = Math.round((correct / userText.length) * 100) || 100;
        this.accuracyDisplay.textContent = accuracy;

        // Calculate WPM
        const timeElapsed = (new Date() - this.startTime) / 1000 / 60; // in minutes
        const wordsTyped = userText.length / 5; // assume average word length of 5
        const wpm = Math.round(wordsTyped / timeElapsed) || 0;
        this.wpmDisplay.textContent = wpm;
    }

    createFlower(isCorrect) {
        const emoji = document.createElement('div');
        emoji.className = 'flower';
        
        // Choose emoji based on whether the character was correct
        if (isCorrect) {
            emoji.textContent = this.flowerColors[Math.floor(Math.random() * this.flowerColors.length)];
        } else {
            emoji.textContent = this.scaryEmojis[Math.floor(Math.random() * this.scaryEmojis.length)];
        }
        
        // Random position
        const left = Math.random() * (this.garden.offsetWidth - 30);
        const bottom = Math.random() * (this.garden.offsetHeight - 30);
        
        emoji.style.left = `${left}px`;
        emoji.style.bottom = `${bottom}px`;
        
        this.garden.appendChild(emoji);
    }

    createModal() {
        // Create modal elements
        const modal = document.createElement('div');
        modal.className = 'modal';
        
        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';
        
        modalContent.innerHTML = `
            <h2>Results</h2>
            <p>Time: <span id="time-taken"></span></p>
            <p>Accuracy: <span id="final-accuracy"></span>%</p>
            <p>Words per minute: <span id="final-wpm"></span></p>
            <button onclick="window.typingGame.startNewPoem(); this.closest('.modal').style.display='none';">
                Try Another Poem
            </button>
        `;
        
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
        this.modal = modal;
    }

    handleSubmit() {
        const userText = this.userInput.value;
        const poemText = this.currentPoem.text;
        
        // Calculate final statistics
        const timeElapsed = (new Date() - this.startTime) / 1000; // in seconds
        const minutes = timeElapsed / 60;
        const wordsTyped = userText.length / 5;
        const wpm = Math.round(wordsTyped / minutes);
        
        let correct = 0;
        for (let i = 0; i < userText.length; i++) {
            if (userText[i] === poemText[i]) {
                correct++;
            }
        }
        const accuracy = Math.round((correct / userText.length) * 100) || 100;

        // Update modal content
        document.getElementById('time-taken').textContent = `${Math.round(timeElapsed)} seconds`;
        document.getElementById('final-accuracy').textContent = accuracy;
        document.getElementById('final-wpm').textContent = wpm;
        
        // Show modal
        this.modal.style.display = 'block';
    }

    startNewPoem() {
        this.selectRandomPoem();
        this.userInput.value = '';
        this.garden.innerHTML = '';
        this.startTime = null;
        this.accuracyDisplay.textContent = '100';
        this.wpmDisplay.textContent = '0';
    }
}

// Initialize the game
document.addEventListener('DOMContentLoaded', () => {
    new TypingGame();
}); 