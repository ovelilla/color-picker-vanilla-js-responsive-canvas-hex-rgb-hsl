import Form from "./Form.js";
import IconButton from "./IconButton.js";
import { icons } from "../modules/Icons.js";
import { colors } from "../modules/Colors.js";

class InputColor extends Form {
    constructor(data) {
        super(data);

        Object.assign(this, data);

        this.isOpen = false;

        this.create();
    }

    create() {
        this.field = this.createField();

        this.wrapper = this.createWrapper();
        this.field.appendChild(this.wrapper);

        this.label = this.createLabel();
        this.wrapper.appendChild(this.label);

        this.input = this.createInput();
        this.wrapper.appendChild(this.input);

        if (this.message && !this.manualErrorHandling) {
            this.field.appendChild(this.createMessage());
        }

        this.colorIcon = document.createElement("div");
        this.colorIcon.classList.add("mio-color");
        this.colorIcon.style.backgroundColor = colors.hslaToString(this.hsla);

        const iconButtonColor = new IconButton({
            type: "button",
            ariaLabel: "Icono vista previa color",
            buttonSize: "medium",
            svgSize: "medium",
            icon: this.colorIcon,
            onClick: () => {
                this.input.focus();
            },
        });

        const adornmentLeft = iconButtonColor.get();
        this.wrapper.appendChild(this.createAdornment(adornmentLeft, "left"));

        const iconButtonPalette = new IconButton({
            type: "button",
            ariaLabel: "Icono paleta de colores",
            buttonSize: "medium",
            svgSize: "medium",
            icon: icons.get("palette"),
            onClick: () => {
                this.input.focus();
            },
        });

        const adornmentRight = iconButtonPalette.get();
        this.wrapper.appendChild(this.createAdornment(adornmentRight, "right"));
    }

    createInput() {
        const input = document.createElement("input");
        input.classList.add("mio-input");
        input.type = "text";
        input.name = this.input.name;
        input.id = this.input.id;
        input.value = this.input.value;
        if (this.input.placeholder) {
            input.placeholder = this.input.placeholder;
        }
        if (this.input.readOnly) {
            input.readOnly = true;
        }
        if (this.input.maxLength) {
            input.maxLength = this.input.maxLength;
        }

        input.addEventListener("focus", this.handleFocus.bind(this));
        input.addEventListener("blur", this.handleBlur.bind(this));
        input.addEventListener("input", this.handleInput.bind(this));

        return input;
    }

    handleFocus() {
        this.field.classList.add("active");
        this.field.classList.add("focus");

        if (this.onFocus) {
            this.onFocus(this.input.value);
        }
    }

    handleBlur() {
        if (this.isOpen) {
            return;
        }

        if (!this.input.value) {
            this.field.classList.remove("active");
        }

        this.field.classList.remove("focus");

        if (this.onBlur) {
            this.onBlur(this.input.value);
        }
    }

    setValue(value) {
        this.input.value = value;
    }

    setColor(color) {
        this.colorIcon.style.backgroundColor = color;
    }
}

export default InputColor;
