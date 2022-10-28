class Picker {
    constructor(data) {
        Object.assign(this, data);

        this.isMove = false;
        this.isHover = false;

        this.pos = {
            x: 0,
            y: 0,
        };

        this.padding = {
            x: 20,
            y: 20,
        };

        this.init();
    }

    init() {
        this.pickerEl = this.render();
    }

    get() {
        return this.pickerEl;
    }

    resize() {
        this.canvas.width = document.querySelector('.picker').offsetWidth;
        this.canvas.height = document.querySelector('.picker').offsetHeight;
    }

    setPos() {
        const s = this.hsla.s;
        const l = this.hsla.l / 100;

        const px = this.padding.x;
        const py = this.padding.y;

        const w = this.canvas.width - px * 2;
        const h = this.canvas.height - py * 2;

        if (s === 0 && l === 0) {
            this.pos.x = 0 + px;
            this.pos.y = h + py;
            return;
        }

        if (s === 0 && l > 0) {
            this.pos.x = 0 + px;
            this.pos.y = h - h * l + py;
            return;
        }

        const y = -(h * (s - s * Math.abs(2 * l - 1) + 200 * l - 200)) / 200;
        const x = -(2 * w * (l * h - h + y)) / (h - y);

        this.pos.x = x + px;
        this.pos.y = y + py;
    }

    render() {
        const picker = document.createElement("div");
        picker.classList.add("picker");

        this.canvas = document.createElement("canvas");
        this.canvas.addEventListener("mousemove", this.handleHover.bind(this));
        this.start = this.handleStart.bind(this);
        this.canvas.addEventListener("mousedown", this.start);
        this.canvas.addEventListener("touchstart", this.start, { passive: true });
        picker.appendChild(this.canvas);

        this.context = this.canvas.getContext("2d", { willReadFrequently: true });

        this.observer = new MutationObserver(this.rerender.bind(this));
        this.observer.observe(document.body, { childList: true });

        return picker;
    }

    rerender() {
        this.clear();
        this.resize();
        if (!this.isMove) {
            this.setPos();
        }
        this.gradient();
        this.pointer();
    }

    pointer() {
        const x = this.pos.x;
        const y = this.pos.y;

        this.context.save();
        this.context.beginPath();
        this.context.arc(x, y, 16, 0, 2 * Math.PI, true);
        this.context.fillStyle = "#fff";
        this.context.shadowColor = "rgba(0, 0, 0, 0.3)";
        this.context.shadowBlur = 4;
        this.context.fill();
        this.context.restore();

        this.context.beginPath();
        this.context.arc(x, y, 12, 0, 2 * Math.PI, true);
        this.context.fillStyle = `hsla(${this.hsla.h},  ${this.hsla.s}%, ${this.hsla.l}%, 1)`;
        this.context.fill();
    }

    gradient() {
        const px = this.padding.x;
        const py = this.padding.y;

        const w = this.canvas.width - px * 2;
        const h = this.canvas.height - py * 2;

        this.context.save();
        this.context.globalCompositeOperation = "multiply";

        const gradB = this.context.createLinearGradient(px, py, px, this.canvas.height - py);
        gradB.addColorStop(0, "white");
        gradB.addColorStop(1, "black");

        const gradC = this.context.createLinearGradient(px, py, this.canvas.width - px, py);
        gradC.addColorStop(0, `hsla(${this.hsla.h}, 100%, 50%, 0)`);
        gradC.addColorStop(1, `hsla(${this.hsla.h}, 100%, 50%, 1)`);

        const pathB = new Path2D();
        pathB.roundRect(px, py, w, h, 6);
        this.context.fillStyle = gradB;
        this.context.fill(pathB);

        const pathC = new Path2D();
        pathC.roundRect(px, py, w, h, 6);
        this.context.fillStyle = gradC;
        this.context.fill(pathC);

        this.context.restore();
    }

    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    handleStart(e) {
        this.isMove = true;

        this.move = this.handleMove.bind(this);
        this.end = this.handleEnd.bind(this);

        document.addEventListener("mousemove", this.move);
        document.addEventListener("touchmove", this.move, { passive: true });
        document.addEventListener("mouseup", this.end);
        document.addEventListener("touchend", this.end, { passive: true });

        this.canvas.style.cursor = "move";

        this.position(e);
        this.rerender();
        this.onChange(this.hsla);
    }

    handleMove(e) {
        if (!this.isMove) {
            return;
        }
        

        this.position(e);
        this.rerender();
        this.onChange(this.hsla);
    }

    handleEnd() {
        if (!this.isMove) {
            return;
        }
        this.isMove = false;

        document.removeEventListener("mousemove", this.move);
        document.removeEventListener("touchmove", this.move);
        document.removeEventListener("mouseup", this.end);
        document.removeEventListener("touchend", this.end);
    }

    handleHover(e) {
        const x = e.offsetX;
        const y = e.offsetY;

        const dx = Math.abs(x - this.pos.x);
        const dy = Math.abs(y - this.pos.y);

        const radius = 16;

        if (dx * dx + dy * dy < radius * radius) {
            if (this.isHover) {
                return;
            }

            this.isHover = true;
            this.canvas.style.cursor = "move";
        } else {
            this.isHover = false;
            this.canvas.removeAttribute("style");
        }
    }

    position(e) {
        const rect = this.canvas.getBoundingClientRect();

        const px = this.padding.x;
        const py = this.padding.y;

        const left = rect.left + px;
        const top = rect.top + py;

        let x = e.clientX ?? e.touches[0].clientX;
        let y = e.clientY ?? e.touches[0].clientY;

        x = x - left;
        y = y - top;

        const w = this.canvas.width - this.padding.x * 2;
        const h = this.canvas.height - this.padding.y * 2;

        if (x < 0) x = 0;
        if (y < 0) y = 0;

        if (x > w) x = w;
        if (y > h) y = h;

        this.pos.x = x + px;
        this.pos.y = y + py;

        const l = ((h - y) * (2 * w - x)) / (2 * w * h);
        const s = (100 * x * (h - y)) / (h * w * (1 - Math.abs(2 * l - 1))) || 0;

        this.hsla.s = s;
        this.hsla.l = l * 100;
    }

    destroy() {
        this.observer.disconnect();
        this.pickerEl.remove();
        delete this;
    }
}

export default Picker;
