# colorpicker-responsive-vanillajs-canvas-hex-rgb-hsl
Responsive vanilla JavaScript colorpicker using canvas, accepts hex, rgb, rgba, hsl, hsla


Demo: https://fluffy-mousse-cb5bb5.netlify.app/


```
import Colorpicker from "./components/colorpicker";

const values = {
    color: "hsl(220deg 75% 50%)",
};

const errors = {
    color: "",
};

const container = document.querySelector(".container");

const form = document.createElement("form");
form.classList.add("mio-form");
container.appendChild(form);

const colorpicker = new Colorpicker({
    label: {
        text: "Color",
        for: "color",
    },
    input: {
        name: "color",
        id: "color",
        value: values.color,
        readOnly: true,
    },
    error: errors.color.length > 0,
    message: errors.color,
    onSelect: (color) => {
        values.color = color;
        errors.color = "";
    },
});
form.appendChild(colorpicker.get());
```
