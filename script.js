
class GuessTheNumber extends HTMLElement {

    connectedCallback() {
        this.form = this.querySelector('form');
        this.hint = this.querySelector('[data-hint]');
        this.initNumbers();
        this.initNumberSlots();
        this.initText();
        this.form.addEventListener('submit', this.handleGuessSubmit.bind(this));
        this.guesses = [];
    }

    initNumbers() {
        // Generate 4 random numbers to start the game
        this.numbers = Array.from({ length: 4 }, () => Math.floor(Math.random() * 10));
        console.log(`Numbers: ${this.numbers.join('')}`);
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
        console.log(`Guess: ${guess}`);
        this.checkGuess(guess);
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

        console.log(`Correct: ${correct}`);

        this.guesses.push({
            guess,
            correct
        });

        this.updateGuessList();

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
        }

        this.hint.textContent = text;
    }

    resetGame() {
        this.initNumbers();
        this.initNumberSlots();
        this.guesses = [];
        this.hint.textContent = '';
    }

    updateGuessList() {
        let list = this.querySelector('[data-guesses]');

        if (this.guesses.length > 0) {
            list.innerHTML = '';
            this.guesses.forEach(guess => {
                let item = document.createElement('li');
                item.textContent = `${guess.guess} (${guess.correct})`;
                list.appendChild(item);
            });
        }
    }

    showNumbers() {
        this.numberSlots.forEach((slot, index) => {
            slot.textContent = this.numbers[index];
        });
    }

}

customElements.define('guess-the-number', GuessTheNumber);