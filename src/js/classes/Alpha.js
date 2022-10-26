class Alpha {
    constructor(data) {
        Object.assign(this, data);

        this.isMove = false;
        this.isHover = false;

        this.padding = {
            x: 20,
            y: 10,
        };

        this.pos = {
            x: 0,
            y: 0,
        };

        this.init();
    }

    init() {
        this.alphaEl = this.render();
    }

    get() {
        return this.alphaEl;
    }

    setPos() {
        const width = this.canvas.width - this.padding.x * 2;
        
        this.pos.x = this.hsla.a * width + this.padding.x;
        this.pos.y = this.canvas.height / 2;
    }

    resize() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
    }

    render() {
        const alpha = document.createElement("div");
        alpha.classList.add("alpha");

        this.canvas = document.createElement("canvas");
        this.canvas.addEventListener("mousemove", this.handleHover.bind(this));
        this.start = this.handleStart.bind(this);
        this.canvas.addEventListener("mousedown", this.start);
        this.canvas.addEventListener("touchstart", this.start, { passive: true });
        alpha.appendChild(this.canvas);

        this.context = this.canvas.getContext("2d", { willReadFrequently: true });

        this.observer = new MutationObserver(this.rerender.bind(this));
        this.observer.observe(document.body, { childList: true });

        return alpha;
    }

    rerender() {
        this.clear();
        this.resize();
        if (!this.isMove) {
            this.setPos();
        }
        this.mask();
        this.gradient();
        this.pointer();
    }

    pointer() {
        const h = this.canvas.height - this.padding.y * 2;

        const x = this.pos.x;
        const y = this.canvas.height / 2;

        this.context.save();
        this.context.beginPath();
        this.context.arc(x, y, 16, 0, 2 * Math.PI, true);
        this.context.fillStyle = "#fff";
        this.context.shadowColor = "rgba(0, 0, 0, 0.3)";
        this.context.shadowBlur = 4;
        this.context.fill();
        this.context.restore();

        const tileWidth = h / 2;
        const tileHeight = h / 2;

        const pattern = this.context.createPattern(this.tile(tileWidth, tileHeight), "repeat");
        this.context.beginPath();
        this.context.arc(x, y, 12, 0, 2 * Math.PI, true);
        this.context.fillStyle = pattern;
        this.context.fill();

        this.context.beginPath();
        this.context.arc(x, y, 12, 0, 2 * Math.PI, true);
        this.context.fillStyle = `hsla(${this.hsla.h}, ${this.hsla.s}%, ${this.hsla.l}%, ${this.hsla.a})`;
        this.context.fill();
    }

    mask() {
        const w = this.canvas.width - this.padding.x * 2;
        const h = this.canvas.height - this.padding.y * 2;

        const x = this.padding.x;
        const y = this.padding.y;

        const tileWidth = h / 2;
        const tileHeight = h / 2;

        const pattern = this.context.createPattern(this.tile(tileWidth, tileHeight), "repeat");

        this.context.beginPath();
        this.context.roundRect(x, y, w, h, 100);

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

    gradient() {
        const w = this.canvas.width - this.padding.x * 2;
        const h = this.canvas.height - this.padding.y * 2;

        const x = this.padding.x;
        const y = this.padding.y;

        const gradient = this.context.createLinearGradient(x, y, w, 0);

        gradient.addColorStop(0, `hsla(${this.hsla.h}, ${this.hsla.s}%, ${this.hsla.l}%, 0)`);
        gradient.addColorStop(1, `hsla(${this.hsla.h}, ${this.hsla.s}%, ${this.hsla.l}%, 1)`);

        this.context.beginPath();
        this.context.roundRect(x, y, w, h, 100);

        this.context.fillStyle = gradient;
        this.context.fill();
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

        this.canvas.style.cursor = "ew-resize";

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
            this.canvas.style.cursor = "ew-resize";
        } else {
            this.isHover = false;
            this.canvas.removeAttribute("style");
        }
    }

    position(e) {
        const rect = this.canvas.getBoundingClientRect();

        const px = this.padding.x;

        const left = rect.left + px;

        let x = e.clientX ?? e.touches[0].clientX;
        x = x - left;
        const w = this.canvas.width - px * 2;

        if (x < 0) {
            x = 0;
        }

        if (x > w) {
            x = w;
        }

        this.pos.x = x + px;

        this.hsla.a = x / w;
    }

    destroy() {
        this.observer.disconnect();
        this.alphaEl.remove();
        delete this;
    }
}

export default Alpha;
