import { colors } from "../modules/Colors.js";

class Preview {
    constructor(data) {
        Object.assign(this, data);

        this.isHover = false;

        this.padding = {
            x: 20,
            y: 10,
        };

        this.init();
    }

    init() {
        this.previewEl = this.render();
    }

    get() {
        return this.previewEl;
    }

    resize() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
    }

    render() {
        const preview = document.createElement("div");
        preview.classList.add("preview");

        this.canvas = document.createElement("canvas");
        this.canvas.addEventListener("mousemove", this.handleMove.bind(this));
        preview.appendChild(this.canvas);

        this.context = this.canvas.getContext("2d", { willReadFrequently: true });

        this.observer = new MutationObserver(this.rerender.bind(this));
        this.observer.observe(document.body, { childList: true });
        
        return preview;
    }

    rerender() {
        this.clear();
        this.resize();
        this.mask();
        this.fill();
    }

    mask() {
        const w = this.canvas.width - this.padding.x * 2;
        const h = this.canvas.height - this.padding.y * 2;

        const x = this.canvas.width / 2;
        const y = this.canvas.height / 2;

        const radius = (w + h) / 2 / 2;

        const tileWidth = w / 6;
        const tileHeight = h / 6;

        const pattern = this.context.createPattern(this.tile(tileWidth, tileHeight), "repeat");

        this.context.imageSmoothingEnabled = true;
        this.context.arc(x, y, radius, 0, 2 * Math.PI, true);
        this.context.fillStyle = pattern;
        this.context.fill();
    }

    tile(width, height) {
        const canvas = document.createElement("canvas");

        canvas.width = width * 2;
        canvas.height = height * 2;

        const context = canvas.getContext("2d", { willReadFrequently: true });

        context.fillStyle = "#fff";
        context.fillRect(0, 0, width, height);

        context.fillStyle = "#eee";
        context.fillRect(width, 0, width, height);
        context.fillRect(0, height, width, height);

        return canvas;
    }

    fill() {
        const px = this.padding.x;
        const py = this.padding.y;

        const w = this.canvas.width - px * 2;
        const h = this.canvas.height - py * 2;

        const x = this.canvas.width / 2;
        const y = this.canvas.height / 2;

        const radius = (w + h) / 2 / 2;

        this.context.arc(x, y, radius, 0, 2 * Math.PI, true);
        this.context.fillStyle = `hsla(${this.hsla.h}, ${this.hsla.s}%, ${this.hsla.l}% , ${this.hsla.a})`;
        this.context.fill();
    }

    hover() {
        const x = this.canvas.width / 2;
        const y = this.canvas.height / 2;

        let p = new Path2D(
            "M13 0H6a2 2 0 0 0-2 2 2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2 2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm0 13V4a2 2 0 0 0-2-2H5a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1zM3 4a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4z"
        );
        this.context.save();
        this.context.translate(x - 15, y - 15);
        this.context.scale(1.8, 1.8);
        const rgba = colors.hslaToRgba(this.hsla);
        const rgb = colors.rgbaToRgbMerge(rgba);
        this.context.fillStyle = colors.luminance(rgb) ? "#333" : "#fff";
        this.context.fill(p);
        this.context.restore();
    }

    check() {
        const x = this.canvas.width / 2;
        const y = this.canvas.height / 2;

        let p = new Path2D(
            "M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"
        );
        this.context.save();
        this.context.translate(x - 16, y - 16);
        this.context.scale(2, 2);
        const rgba = colors.hslaToRgba(this.hsla);
        const rgb = colors.rgbaToRgbMerge(rgba);
        this.context.fillStyle = colors.luminance(rgb) ? "#333" : "#fff";
        this.context.fill(p);
        this.context.restore();
    }

    handleMove(e) {
        const x = e.offsetX;
        const y = e.offsetY;

        const dx = x - this.canvas.width / 2;
        const dy = y - this.canvas.height / 2;

        const radius = this.canvas.width / 2 - this.padding.x;

        if (dx * dx + dy * dy <= radius * radius) {
            if (this.isHover) {
                return;
            }

            this.isHover = true;
            this.canvas.style.cursor = "pointer";
            this.click = this.handleClick.bind(this);
            this.canvas.addEventListener("click", this.click);

            this.rerender();
            this.hover();
        } else {
            this.isHover = false;
            this.canvas.removeAttribute("style");
            this.canvas.removeEventListener("click", this.click);

            this.rerender();
        }
    }

    handleClick() {
        this.rerender();
        this.check();
        this.onClick();
    }

    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    destroy() {
        this.observer.disconnect();
        this.previewEl.remove();
        delete this;
    }
}

export default Preview;
