
class GuessTheNumber extends HTMLElement {

    connectedCallback() {
        this.bestScore = localStorage.getItem('bestScore') || 'N/A';
        this.form = this.querySelector('form');
        this.hint = this.querySelector('[data-hint]');
        this.resetBtn = this.querySelector('[data-reset]');
        this.initNumbers();
        this.initNumberSlots();
        this.initText();
        this.form.addEventListener('submit', this.handleGuessSubmit.bind(this));
        this.guesses = [];
        this.displayBestScore();
        this.resetBtn.addEventListener('click', this.resetGame.bind(this));
    }

    initNumbers() {
        // Generate 4 random numbers to start the game
        this.numbers = Array.from({ length: 4 }, () => Math.floor(Math.random() * 10));
    }

    initText() {
        this.text = {
            'none': 'None of the numbers are in the right spot. 🙃',
            'one': 'One number is in the right spot. 😐',
            'two': 'Two numbers are in the right spot. 😊',
            'three': 'Three numbers are in the right spot. 😃',
            'win': 'You win! 🥳',
        }
    }

    initNumberSlots() {
        this.numberSlots = this.querySelectorAll('[data-numbers] span');
    }

    handleGuessSubmit(event) {
        event.preventDefault();
        const guess = this.form.querySelector('input').value;
        this.checkGuess(guess);
        this.form.querySelector('input').value = '';
    }

    checkGuess(guess) {
        const numbers = guess.split('');
        let correct = 0;

        numbers.forEach((number, index) => {
            number = parseInt(number);
            if (number === this.numbers[index]) {
                correct++;
            }
        });

        this.guesses.push({
            guess,
            correct
        });

        this.updateGuessList({
            guess,
            correct
        });

        this.updateText(correct);
    }

    updateText(correct) {
        let text = this.text.none;

        if (correct === 1) {
            text = this.text.one;
        } else if (correct === 2) {
            text = this.text.two;
        } else if (correct === 3) {
            text = this.text.three;
        } else if (correct === 4) {
            text = this.text.win;
            text += ` You took ${this.guesses.length} guesses.`;
            this.showNumbers();
            this.saveBestScore(this.guesses.length);
            this.doConfetti();
        }

        this.hint.textContent = text;
    }

    resetGame() {
        window.location.reload();
    }

    updateGuessList(guess) {
        let list = this.querySelector('[data-guesses]');

        let item = document.createElement('li');
        item.textContent = `${guess.guess} (${guess.correct})`;
        list.insertBefore(item, list.firstChild);
    }

    showNumbers() {
        this.numberSlots.forEach((slot, index) => {
            slot.textContent = this.numbers[index];
        });
    }

    saveBestScore(score) {
        if (score < this.bestScore || this.bestScore === 'N/A') {
            this.bestScore = score;
            localStorage.setItem('bestScore', score);
        }
    }

    displayBestScore() {
        let bestScore = this.querySelector('[data-best-score]');
        bestScore.textContent = this.bestScore;
    }

    doConfetti() {
        confetti();
    }

}

customElements.define('guess-the-number', GuessTheNumber);