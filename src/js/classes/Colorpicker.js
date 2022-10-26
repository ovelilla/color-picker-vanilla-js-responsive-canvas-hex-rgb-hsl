import InputColor from "./InputColor.js";
import Panel from "./Panel.js";
import { colors } from "../modules/Colors.js";

class Colorpicker {
    constructor(data) {
        Object.assign(this, data);

        this.init();
    }

    init() {
        this.checkValue();

        this.inputColor = new InputColor({
            hsla: this.hsla,
            label: {
                text: this.label.text,
                for: this.label.for,
            },
            input: {
                name: this.input.name,
                id: this.input.id,
                value: this.input.value,
                readOnly: this.input.readOnly,
            },
            error: this.error,
            message: this.message,
            onFocus: this.open.bind(this),
            onBlur: () => {},
        });
    }

    checkValue() {
        if (!this.input.value) {
            this.hsla =  { h: 0, s: 0, l: 0, a: 0 };
            this.input.value = "#000000";
        }

        this.hsla = colors.getHslaFromString(this.input.value);
    }

    open() {
        this.hsla = colors.getHslaFromString(this.input.value);

        this.panel = new Panel({
            hsla: this.hsla,
            input: this.inputColor,
            value: this.input.value,
            onOpen: () => {
                this.inputColor.isOpen = true;
                this.inputColor.blur();
            },
            onClose: () => {
                this.inputColor.isOpen = false;
                this.inputColor.handleBlur();
            },
            onAccept: () => {
                const string = this.panel.data.getString();

                this.inputColor.setValue(string);
                this.inputColor.setColor(string);
                this.inputColor.removeError();

                this.input.value = string;

                this.onSelect(string);
            },
            onCancel: () => {},
        });

        this.panel.open();
    }

    get() {
        return this.inputColor.get();
    }

    getValue() {
        return this.input.value;
    }

    setValue(value) {
        this.input.value = value;
        this.inputColor.setValue(value);
        this.inputColor.setColor(value);
    }
}

export default Colorpicker;
