import { colors } from "../modules/Colors.js";
class Palette {
    constructor(data) {
        Object.assign(this, data);

        this.colors = [
            { h: 0, s: 84, l: 60, a: 1 },
            { h: 25, s: 95, l: 53, a: 1 },
            { h: 48, s: 96, l: 53, a: 1 },
            { h: 142, s: 69, l: 58, a: 1 },
            { h: 172, s: 66, l: 50, a: 1 },
            { h: 217, s: 91, l: 60, a: 1 },
            { h: 239, s: 84, l: 67, a: 1 },
            { h: 330, s: 81, l: 60, a: 1 },
            { h: 350, s: 89, l: 60, a: 1 },
            { h: 292, s: 84, l: 61, a: 1 },
            { h: 258, s: 90, l: 66, a: 1 },
            { h: 199, s: 89, l: 48, a: 1 },
            { h: 160, s: 84, l: 39, a: 1 },
            { h: 84, s: 81, l: 44, a: 1 },
        ];

        this.color = null;

        this.init();
    }

    init() {
        this.paletteEl = document.createElement("div");
        this.paletteEl.classList.add("palette");

        this.render();
    }

    get() {
        return this.paletteEl;
    }

    render() {
        this.colors.forEach((color) => {
            const colorEl = document.createElement("div");
            colorEl.classList.add("color");
            if (this.color === color) {
                colorEl.classList.add("active");
            }
            colorEl.style.backgroundColor = colors.hslaToString(color);
            colorEl.addEventListener("click", () => {
                this.selectColor(color);
                this.rerender();
            });

            this.paletteEl.appendChild(colorEl);
        });
    }

    selectColor(color) {
        this.color = color;

        this.hsla.h = color.h;
        this.hsla.s = color.s;
        this.hsla.l = color.l;
        this.hsla.a = color.a;

        this.onSelect(this.hsla);
    }

    rerender() {
        this.cleanHTML();
        this.render();
    }

    cleanHTML() {
        while (this.paletteEl.firstChild) {
            this.paletteEl.removeChild(this.paletteEl.firstChild);
        }
    }

    reset() {
        if (!this.color) {
            return;
        }
        this.color = null;
        this.rerender();
    }

    destroy() {
        this.paletteEl.remove();
        delete this;
    }
}

export default Palette;
