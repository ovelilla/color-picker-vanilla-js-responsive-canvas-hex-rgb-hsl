class InputText {
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

        input.type = "text";
        input.name = this.input.name;
        input.id = this.input.id;
        input.value = this.input.value;

        if (this.input.placeholder) {
            input.placeholder = this.input.placeholder;
        }
        if (this.input.maxLength) {
            input.maxLength = this.input.maxLength;
        }

        input.addEventListener("input", this.handleInput.bind(this));
        input.addEventListener("focus", this.handleFocus.bind(this));
        input.addEventListener("blur", this.handleBlur.bind(this));

        return input;
    }

    handleInput(e) {
        let value = e.target.value;;

        if (this.onInput) {
            this.onInput(value);
        }
    }

    handleFocus() {
        this.inputEl.parentElement.classList.add("focus");
    }

    handleBlur() {
        this.inputEl.parentElement.classList.remove("focus");
    }

    setValue(value) {
        this.inputEl.value = value;
    }
}

export default InputText;
