export default class DecayArray {
    constructor(size, initialValue = 2) {
        for (let i = 0; i < size; i++) {
            this[i] = initialValue;
        }
        this.length = size;
    }

    pop() {
        for (let i = this.length - 1; i >= 0; i--) {
            if (this[i] !== " ") {
                this[i] = this._decrement(this[i]);
                break;
            }
        }
    }

    shift() {
        for (let i = 0; i < this.length; i++) {
            if (this[i] !== " ") {
                this[i] = this._decrement(this[i]);
                break;
            }
        }
    }

    _decrement(value) {
        if (value === 2) return 1;
        if (value === 1) return " ";
        return " ";
    }

    toArray() {
        return Array.from({ length: this.length }, (_, i) =>
            this.hasOwnProperty(i) ? this[i] : undefined
        );
    }
}
