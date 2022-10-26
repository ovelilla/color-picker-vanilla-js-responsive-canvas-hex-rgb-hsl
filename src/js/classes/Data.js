import InputText from "./InputText.js";
import InputNumber from "./InputNumber.js";
import Select from "./Select.js";
import { colors } from "../modules/Colors.js";

class Data {
    constructor(data) {
        Object.assign(this, data);

        this.values = {};

        this.options = [
            { value: "hex", text: "Hex" },
            { value: "rgb", text: "RGB" },
            { value: "hsl", text: "HSL" },
        ];
        this.option = this.options.find((option) => option.value === colors.getColorType(this.value));

        this.init();
    }

    init() {
        this.setValues();

        this.data = document.createElement("div");
        this.data.classList.add("data");

        this.render();
    }

    get() {
        return this.data;
    }

    getString() {
        let string = "";

        if (this.option.value === "hex" && colors.validateHex(this.values.hex)) {
            string = this.values.hex;
        }
        if (this.option.value === "hex" && colors.validateHexa(this.values.hex)) {
            string = this.values.hex;
        }
        if (this.option.value === "rgb" && (this.values.rgba.a === 1 || this.values.rgba.a === 0)) {
            string = colors.rgbToString(this.values.rgba);
        }
        if (this.option.value === "rgb" && (this.values.rgba.a > 0 && this.values.rgba.a < 1)) {
            string = colors.rgbaToString(this.values.rgba);
        }
        if (this.option.value === "hsl" && (this.values.hsla.a === 1 || this.values.hsla.a === 0)) {
            string = colors.hslToString(this.values.hsla);
        }
        if (this.option.value === "hsl" && (this.values.hsla.a > 0 && this.values.hsla.a < 1)) {
            string = colors.hslaToString(this.values.hsla);
        }

        return string;
    }

    setValues() {
        this.values.hsla = { ...this.hsla };

        if (this.hsla.s === 0) {
            this.values.hsla.h = 0;
        }

        this.values.rgba = colors.hslaToRgba(this.values.hsla);

        if (this.values.hsla.a < 1) {
            this.values.hex = colors.hslaToHexa(this.values.hsla);
        } else {
            this.values.hex = colors.hslaToHex(this.values.hsla);
        }
    }

    setInputs() {
        if (this.option.value === "hex") {
            this.hexInput.setValue(this.values.hex);
        }
        if (this.option.value === "rgb") {
            for (const key in this.values.rgba) {
                this[`rgbaInput${key.toUpperCase()}`].setValue(this.values.rgba[key]);
            }
        }
        if (this.option.value === "hsl") {
            for (const key in this.values.hsla) {
                this[`hslaInput${key.toUpperCase()}`].setValue(this.values.hsla[key]);
            }
        }
    }

    render() {
        this.form = document.createElement("form");
        this.data.appendChild(this.form);

        const select = new Select({
            label: {
                text: "Colors",
                for: "colors",
            },
            select: {
                name: "colors",
                id: "colos",
            },
            option: {
                value: "value",
                text: "text",
            },
            options: this.options,
            selected: this.option,
            onSelect: async (option) => {
                this.option = option;
                this.form.remove();
                this.render();
            },
        });
        this.form.appendChild(select.get());

        const field = document.createElement("div");
        field.classList.add("field");
        this.form.appendChild(field);

        if (this.option.value === "hex") {
            const hexEl = this.renderHex();
            field.appendChild(hexEl);
        }

        if (this.option.value === "rgb") {
            const rgbaEl = this.renderRgba();
            field.appendChild(rgbaEl);
        }

        if (this.option.value === "hsl") {
            const hslaEl = this.renderHsla();
            field.appendChild(hslaEl);
        }
    }

    renderHex() {
        const fragment = document.createDocumentFragment();

        this.hexInput = new InputText({
            label: {
                text: "HEX",
                for: "hex",
            },
            input: {
                name: "hex",
                id: "hex",
                maxLength: 9,
                value: this.values.hex,
            },
            onInput: async (value) => {
                if (!colors.validateHex(value) && !colors.validateHexa(value)) {
                    return;
                }

                this.values.hex = value;

                const hsla = colors.validateHex(value) ? colors.hexToHsla(value, 1) : colors.hexaToHsla(value);

                for (const key in hsla) {
                    this.hsla[key] = hsla[key];
                }

                this.onChange(this.hsla);
                this.setValues();
            },
        });
        fragment.appendChild(this.hexInput.get());

        return fragment;
    }

    renderRgba() {
        const fragment = document.createDocumentFragment();

        const max = { r: 255, g: 255, b: 255, a: 1 };
        const step = { r: 1, g: 1, b: 1, a: 0.01 };

        for (const key in this.values.rgba) {
            this[`rgbaInput${key.toUpperCase()}`] = new InputNumber({
                label: {
                    text: key.toUpperCase(),
                    for: key,
                },
                input: {
                    name: key,
                    id: key,
                    step: step[key],
                    min: 0,
                    max: max[key],
                    maxLength: 5,
                    value: this.values.rgba[key],
                },
                onInput: async (value) => {
                    this.values.rgba[key] = value;

                    const hsla = colors.rgbaToHsla(this.values.rgba);

                    for (const key in hsla) {
                        this.hsla[key] = hsla[key];
                    }

                    this.onChange(this.hsla);
                    this.setValues();
                },
            });
            fragment.appendChild(this[`rgbaInput${key.toUpperCase()}`].get());
        }

        return fragment;
    }

    renderHsla() {
        const fragment = document.createDocumentFragment();

        const max = { h: 360, s: 100, l: 100, a: 1 };
        const step = { h: 1, s: 1, l: 1, a: 0.01 };

        for (const key in this.values.hsla) {
            this[`hslaInput${key.toUpperCase()}`] = new InputNumber({
                label: {
                    text: key.toUpperCase(),
                    for: key,
                },
                input: {
                    name: key,
                    id: key,
                    step: step[key],
                    min: 0,
                    max: max[key],
                    maxLength: 5,
                    value: this.values.hsla[key],
                },
                onInput: async (value) => {
                    this.hsla[key] = value;
                    this.onChange(this.hsla);
                    this.setValues();
                },
            });
            fragment.appendChild(this[`hslaInput${key.toUpperCase()}`].get());
        }

        return fragment;
    }

    rerender() {
        this.setValues();
        this.setInputs();
    }

    destroy() {
        this.data.remove();
        delete this;
    }
}

export default Data;
