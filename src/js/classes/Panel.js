import Picker from "./Picker.js";
import Hue from "./Hue.js";
import Alpha from "./Alpha.js";
import Preview from "./Preview.js";
import Data from "./Data.js";
import Palette from "./Palette.js";

class Panel {
    constructor(data) {
        Object.assign(this, data);

        this.isOpen = false;
        this.isClose = false;
    }

    open() {
        if (this.isOpen) {
            return;
        }
        this.isOpen = true;

        this.onOpen();

        this.colorpicker = this.create();
        document.body.appendChild(this.colorpicker);

        this.position();

        this.colorpicker.classList.add("in");
    }

    create() {
        const colorpicker = document.createElement("div");
        colorpicker.classList.add("colorpicker");
        colorpicker.addEventListener("mousedown", this.checkClose.bind(this));
        colorpicker.addEventListener("touchstart", this.checkClose.bind(this), { passive: true });
        colorpicker.addEventListener("click", this.handleClose.bind(this));
        this.resize = this.handleResize.bind(this);
        window.addEventListener("resize", this.resize);

        const content = document.createElement("div");
        content.classList.add("content");
        content.addEventListener("click", (e) => e.stopPropagation());
        colorpicker.appendChild(content);

        if (!this.isCanvasSupported()) {
            const message = this.createMessage("Your browser does not support canvas.");
            content.appendChild(message);
            return colorpicker;
        }

        this.picker = new Picker({
            hsla: this.hsla,
            onChange: (hsla) => {
                this.hsla = hsla;

                this.hue.rerender();
                this.alpha.rerender();
                this.preview.rerender();
                this.data.rerender();
                this.palette.reset();
            },
        });
        content.appendChild(this.picker.get());

        const row = document.createElement("div");
        row.classList.add("row");
        content.appendChild(row);

        const column = document.createElement("div");
        column.classList.add("column");
        row.appendChild(column);

        this.hue = new Hue({
            hsla: this.hsla,
            onChange: (hsla) => {
                this.hsla = hsla;

                this.picker.rerender();
                this.alpha.rerender();
                this.preview.rerender();
                this.data.rerender();
                this.palette.reset();
            },
        });
        column.appendChild(this.hue.get());

        this.alpha = new Alpha({
            hsla: this.hsla,
            onChange: (hsla) => {
                this.hsla = hsla;

                this.preview.rerender();
                this.data.rerender();
            },
        });
        column.appendChild(this.alpha.get());

        this.preview = new Preview({
            hsla: this.hsla,
            onClick: () => {
                navigator.clipboard.writeText(this.data.getString());
            },
        });
        row.appendChild(this.preview.get());

        this.data = new Data({
            hsla: this.hsla,
            value: this.value,
            onChange: (hsla) => {
                this.hsla = hsla;

                this.picker.rerender();
                this.hue.rerender();
                this.alpha.rerender();
                this.preview.rerender();
                this.palette.reset();
            },
        });
        content.appendChild(this.data.get());

        this.palette = new Palette({
            hsla: this.hsla,
            onSelect: (hsla) => {
                this.hsla = hsla;

                this.picker.rerender();
                this.hue.rerender();
                this.alpha.rerender();
                this.preview.rerender();
                this.data.rerender();
            },
        });
        content.appendChild(this.palette.get());

        const actions = document.createElement("div");
        actions.classList.add("actions");
        content.appendChild(actions);

        const cancelBtn = document.createElement("button");
        cancelBtn.classList.add("cancel");
        cancelBtn.textContent = "Cancelar";
        cancelBtn.addEventListener("click", () => {
            this.isClose = true;
            this.handleClose();
        });
        actions.appendChild(cancelBtn);

        const acceptBtn = document.createElement("button");
        acceptBtn.classList.add("accept");
        acceptBtn.textContent = "Aceptar";
        acceptBtn.addEventListener("click", async () => {
            this.isClose = true;
            await this.handleClose();
            this.onAccept();
            this.destroy();
        });
        actions.appendChild(acceptBtn);

        return colorpicker;
    }

    createMessage(message) {
        const p = document.createElement("p");
        p.classList.add("message");
        p.textContent = message;
        return p;
    }

    position() {
        if (document.body.scrollHeight > (window.innerHeight || document.documentElement.clientHeight)) {
            document.body.classList.add("noscroll");
        }

        const input = this.input.get();
        const rect = input.getBoundingClientRect();

        if (innerWidth < 768) {
            this.colorpicker.firstChild.removeAttribute("style");
            return;
        }

        this.colorpicker.firstChild.style.top = `${rect.top + input.offsetHeight + 2}px`;
        this.colorpicker.firstChild.style.left = `${rect.left}px`;
        this.colorpicker.firstChild.style.width = `${rect.width}px`;
    }

    checkClose(e) {
        if (e.target === this.colorpicker) {
            this.isClose = true;
        }
    }

    async handleClose() {
        if (!this.isClose) {
            return;
        }

        this.isOpen = false;
        this.isClose = false;

        document.body.classList.remove("noscroll");
        this.colorpicker.classList.add("out");

        await this.animationend(this.colorpicker);

        if (this.isCanvasSupported()) {
            this.picker.destroy();
            this.hue.destroy();
            this.alpha.destroy();
            this.preview.destroy();
            this.data.destroy();
            this.palette.destroy();
        }

        this.onClose();
        this.destroy();
    }

    handleResize() {
        if (this.isCanvasSupported()) {
            this.picker.rerender();
            this.hue.rerender();
            this.alpha.rerender();
            this.preview.rerender();
        }

        this.position();
    }

    isCanvasSupported() {
        const canvas = document.createElement("canvas");
        return !!(canvas.getContext && canvas.getContext("2d"));
    }

    destroy() {
        window.removeEventListener("resize", this.resize);
        this.colorpicker.remove();
        delete this;
    }

    async animationend(target) {
        return new Promise((resolve) => {
            target.addEventListener("animationend", resolve, { once: true });
        });
    }
}

export default Panel;
