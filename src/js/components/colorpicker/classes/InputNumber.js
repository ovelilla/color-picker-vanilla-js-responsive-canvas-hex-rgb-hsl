class InputNumber {
    constructor(data) {
        Object.assign(this, data);

        this.init();
    }

    init() {
        this.inputEl = this.createInput();
    }

    get() {
        return this.inputEl;
    }

    createInput() {
        const input = document.createElement("input");
        input.classList.add("input");

        input.type = "number";
        input.name = this.input.name;
        input.id = this.input.id;

        if (this.input.step === 0.01  && this.input.value % 1 !== 0) {
            input.value = this.input.value.toFixed(2);
        }
        if (this.input.step === 0.01  && this.input.value % 1 === 0) {
            input.value = this.input.value;
        }
        if (this.input.step === 1) {
            input.value = Math.round(this.input.value);
        }   
        
        if (this.input.min) {
            input.min = this.input.min;
        }
        if (this.input.max) {
            input.max = this.input.max;
        }
        if (this.input.step) {
            input.step = this.input.step;
        }
        if (this.input.placeholder) {
            input.placeholder = this.input.placeholder;
        }
        if (this.input.maxLength) {
            input.maxLength = this.input.maxLength;
        }

        this.previousValue = input.value;

        input.addEventListener("input", this.handleInput.bind(this));
        input.addEventListener("keypress", this.handleKeypress.bind(this));
        input.addEventListener("focus", this.handleFocus.bind(this));
        input.addEventListener("blur", this.handleBlur.bind(this));

        return input;
    }

    handleInput(e) {
        let value = e.target.value;
        const min = this.input.min;
        const max = this.input.max;

        if (!value) {
            return;
        }

        if (value.includes(".")) {
            const decimal = value.split(".")[1];
            if (decimal.length > 2) {
                value = value.slice(0, -1);
                e.target.value = value;
            }
        }

        if (value < min) {
            value = min;
        }

        if (value > max) {
            value = max;
        }

        this.previousValue = value;
        e.target.value = value;

        if (this.onInput) {
            this.onInput(value);
        }
    }

    handleKeypress(e) {
        const charCode = e.keyCode;

        if (charCode !== 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
            e.preventDefault();
        }
    }

    handleFocus() {
        this.inputEl.parentElement.classList.add("focus");
    }

    handleBlur(e) {
        const value = e.target.value;

        if (!value) {
            e.target.value = this.previousValue;
        }

        if (value.startsWith("0")) {
            e.target.value = parseFloat(value);
        }

        this.inputEl.parentElement.classList.remove("focus");
    }

    setValue(value) {
        
        if (this.input.step === 0.01  && value % 1 !== 0) {
            this.inputEl.value = value.toFixed(2);
        }
        if (this.input.step === 0.01  && value % 1 === 0) {
            this.inputEl.value = value;
        }
        if (this.input.step === 1) {
            this.inputEl.value = Math.round(value);
        }
    }
}

export default InputNumber;
