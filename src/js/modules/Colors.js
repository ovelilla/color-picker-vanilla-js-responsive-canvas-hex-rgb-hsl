export const colors = (() => {
    const getHslaFromString = (value) => {
        if (value.startsWith("#")) {
            return getHslaFromHexString(value);
        } else if (value.toLowerCase().startsWith("rgb")) {
            return getHslaFromRgbString(value);
        } else if (value.toLowerCase().startsWith("hsl")) {
            return getHslaFromHslString(value);
        }
    };

    const getColorType = (value) => {
        if (value.startsWith("#")) {
            return "hex";
        } else if (value.toLowerCase().startsWith("rgb")) {
            return "rgb";
        } else if (value.toLowerCase().startsWith("hsl")) {
            return "hsl";
        }
    };

    const getHslaFromHexString = (value) => {
        if (!validateHex(value) && !validateHexa(value)) {
            return hexToHsla("#000000", 1);
        }

        const hex = value.length === 7 ? value : value.slice(0, 7);
        const alpha = value.length === 7 ? 1 : hexToAlpha(value);

        return hexToHsla(hex, alpha);
    };

    const getHslaFromRgbString = (value) => {
        const match = value.match(/-?\d*\.?\d+%?/g);

        const rgba = {
            r: parseInt(match[0].includes("%") ? percentToRgb(match[0].replace("%", "")) : match[0]),
            g: parseInt(match[1].includes("%") ? percentToRgb(match[1].replace("%", "")) : match[1]),
            b: parseInt(match[2].includes("%") ? percentToRgb(match[2].replace("%", "")) : match[2]),
        };

        if (match[3] && match[3].includes(".") && !match[3].includes("%")) {
            rgba.a = parseFloat(match[3]);
        } else if (match[3] && match[3].includes("%")) {
            rgba.a = parseFloat(match[3].replace("%", "") / 100);
        } else if (match[3] && !match[3].includes(".") && !match[3].includes("%")) {
            rgba.a = parseInt(match[3]) > 1 ? 1 : parseInt(match[3]);
        } else if (!match[3]) {
            rgba.a = 1;
        }

        return rgbaToHsla(rgba);
    };

    const getHslaFromHslString = (value) => {
        const match = value.match(/-?\d*\.?\d+%?/g);

        const hsla = {
            h: parseInt(match[0]),
            s: parseInt(match[1]),
            l: parseInt(match[2]),
        };

        if (match[3] && match[3].includes(".") && !match[3].includes("%")) {
            hsla.a = parseFloat(match[3]);
        } else if (match[3] && match[3].includes("%")) {
            hsla.a = parseFloat(match[3].replace("%", "") / 100);
        } else if (match[3] && !match[3].includes(".") && !match[3].includes("%")) {
            hsla.a = parseInt(match[3]) > 1 ? 1 : parseInt(match[3]);
        } else if (!match[3]) {
            hsla.a = 1;
        }

        return hsla;
    };

    const hexToRgb = (hex) => {
        if (hex.length === 4) {
            hex = hex.replace(/([0-9A-F])/gi, "$1$1");
        }

        const r = parseInt(hex.substring(1, 3), 16);
        const g = parseInt(hex.substring(3, 5), 16);
        const b = parseInt(hex.substring(5, 7), 16);

        return { r, g, b };
    };

    const hexToRgba = (hex, alpha) => {
        const rgb = hexToRgb(hex);

        return {
            r: rgb.r,
            g: rgb.g,
            b: rgb.b,
            a: alpha,
        };
    };

    const hexToAlpha = (hexa) => {
        const alpha = parseInt(hexa.substring(7, 9), 16) / 255;

        return Math.round(alpha * 100) / 100;
    };

    const hexToHsl = (hex) => {
        const rgb = hexToRgb(hex);
        const hsl = rgbToHsl(rgb);

        return hsl;
    };

    const hexToHsla = (hex, alpha) => {
        const rgb = hexToRgb(hex);
        const hsl = rgbToHsl(rgb);

        return {
            h: hsl.h,
            s: hsl.s,
            l: hsl.l,
            a: alpha,
        };
    };

    const hexaToHsla = (hexa) => {
        const alpha = hexToAlpha(hexa);
        const hsla = hexToHsla(hexa, alpha);

        return hsla;
    };

    const validateHex = (hex) => {
        const regex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

        return regex.test(hex);
    };

    const validateHexa = (hexa) => {
        const regex = /^#([A-Fa-f0-9]{8})$/;

        return regex.test(hexa);
    };

    const percentToRgb = (percent) => {
        return Math.round(percent * 2.55);
    };

    const rgbToHex = (rgb) => {
        let r = rgb.r.toString(16);
        let g = rgb.g.toString(16);
        let b = rgb.b.toString(16);

        r = r.length === 1 ? "0" + r : r;
        g = g.length === 1 ? "0" + g : g;
        b = b.length === 1 ? "0" + b : b;

        return `#${r}${g}${b}`.toUpperCase();
    };

    const rgbToRgba = (rgb, alpha) => {
        return {
            r: rgb.r,
            g: rgb.g,
            b: rgb.b,
            a: alpha,
        };
    };

    const rgbToHsl = (rgb) => {
        const r = rgb.r / 255;
        const g = rgb.g / 255;
        const b = rgb.b / 255;

        const l = Math.max(r, g, b);
        const s = l - Math.min(r, g, b);
        const h = s ? (l === r ? (g - b) / s : l === g ? 2 + (b - r) / s : 4 + (r - g) / s) : 0;

        return {
            h: Math.round(60 * h < 0 ? 60 * h + 360 : 60 * h),
            s: Math.round(100 * (s ? (l <= 0.5 ? s / (2 * l - s) : s / (2 - (2 * l - s))) : 0)),
            l: Math.round((100 * (2 * l - s)) / 2),
        };
    };

    const rgbToHsla = (rgb, alpha) => {
        const hsl = rgbToHsl(rgb);

        return {
            h: hsl.h,
            s: hsl.s,
            l: hsl.l,
            a: alpha,
        };
    };

    const rgbToString = (rgba) => {
        return `rgb(${rgba.r} ${rgba.g} ${rgba.b})`;
    };

    const rgbaToHex = (rgba) => {
        const rgb = rgbaToRgb(rgba);

        return rgbToHex(rgb);
    };

    const rgbaToHexa = (rgba) => {
        const hex = rgbaToHex(rgba);
        const alpha = Math.round(rgba.a * 255)
            .toString(16)
            .toUpperCase();

        return alpha.length === 1 ? hex + "0" + alpha : hex + alpha;
    };

    const rgbaToRgb = (rgba) => {
        return {
            r: rgba.r,
            g: rgba.g,
            b: rgba.b,
        };
    };

    const rgbaToRgbMerge = (rgba) => {
        return {
            r: Math.round(rgba.r * rgba.a + 255 * (1 - rgba.a)),
            g: Math.round(rgba.g * rgba.a + 255 * (1 - rgba.a)),
            b: Math.round(rgba.b * rgba.a + 255 * (1 - rgba.a)),
        };
    };

    const rgbaToHsl = (rgba) => {
        const rgb = rgbaToRgb(rgba);
        const hsl = rgbToHsl(rgb);

        return hsl;
    };

    const rgbaToHsla = (rgba) => {
        const rgb = rgbaToRgb(rgba);
        const hsl = rgbToHsl(rgb);

        return {
            h: hsl.h,
            s: hsl.s,
            l: hsl.l,
            a: rgba.a,
        };
    };

    const rgbaToString = (rgba) => {
        return `rgb(${rgba.r} ${rgba.g} ${rgba.b} / ${Math.round(rgba.a * 100)}%)`;
    };

    const hslToHex = (hsl) => {
        const rgb = hslToRgb(hsl);

        return rgbToHex(rgb);
    };

    const hslToHexa = (hsl, alpha) => {
        const rgb = hslToRgb(hsl);
        const hex = rgbToHex(rgb);
        const a = Math.round(alpha * 255)
            .toString(16)
            .toUpperCase();

        return a.length === 1 ? hex + "0" + a : hex + a;
    };

    const hslToRgb = (hsl) => {
        const h = hsl.h;
        const s = hsl.s / 100;
        const l = hsl.l / 100;

        let a = s * Math.min(l, 1 - l);
        let f = (n, k = (n + h / 30) % 12) => l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);

        return {
            r: Math.round(f(0) * 255),
            g: Math.round(f(8) * 255),
            b: Math.round(f(4) * 255),
        };
    };

    const hslToRgbVariant = (hsl) => {
        const h = hsl.h / 60;
        const s = hsl.s / 100;
        const l = hsl.l / 100;

        const c = (1 - Math.abs(2 * l - 1)) * s;
        const x = c * (1 - Math.abs((h % 2) - 1));
        const m = l - c / 2;

        let r = 0;
        let g = 0;
        let b = 0;

        if (h >= 0 && h < 1) {
            r = c;
            g = x;
            b = 0;
        } else if (h >= 1 && h < 2) {
            r = x;
            g = c;
            b = 0;
        } else if (h >= 2 && h < 3) {
            r = 0;
            g = c;
            b = x;
        } else if (h >= 3 && h < 4) {
            r = 0;
            g = x;
            b = c;
        } else if (h >= 4 && h < 5) {
            r = x;

            g = 0;
            b = c;
        } else if (h >= 5 && h < 6) {
            r = c;
            g = 0;
            b = x;
        }

        return {
            r: Math.round((r + m) * 255),
            g: Math.round((g + m) * 255),
            b: Math.round((b + m) * 255),
        };
    };

    const hslToRgba = (hsl, alpha) => {
        const rgb = hslToRgbVariant(hsl);

        return {
            r: rgb.r,
            g: rgb.g,
            b: rgb.b,
            a: alpha,
        };
    };

    const hslToHsla = (hsl, alpha) => {
        return {
            h: hsl.h,
            s: hsl.s,
            l: hsl.l,
            a: alpha,
        };
    };

    const hslToString = (hsl) => {
        const h = Math.round(hsl.h);
        const s = Math.round(hsl.s);
        const l = Math.round(hsl.l);

        return `hsl(${h}deg ${s}% ${l}%)`;
    };

    const hslaToHex = (hsla) => {
        const rgb = hslaToRgb(hsla);

        return rgbToHex(rgb);
    };

    const hslaToHexa = (hsla) => {
        const hex = hslaToHex(hsla);
        const alpha = Math.round(hsla.a * 255)
            .toString(16)
            .toUpperCase();

        return alpha.length === 1 ? hex + "0" + alpha : hex + alpha;
    };

    const hslaToRgb = (hsla) => {
        const hsl = hslaToHsl(hsla);

        return hslToRgb(hsl);
    };

    const hslaToRgba = (hsla) => {
        const hsl = hslaToHsl(hsla);

        return hslToRgba(hsl, hsla.a);
    };

    const hslaToHsl = (hsla) => {
        return {
            h: hsla.h,
            s: hsla.s,
            l: hsla.l,
        };
    };

    const hslaToString = (hsl) => {
        const h = Math.round(hsl.h);
        const s = Math.round(hsl.s);
        const l = Math.round(hsl.l);
        const a = Math.round(hsl.a * 100);

        return `hsl(${h}deg ${s}% ${l}% / ${a}%)`;
    };

    const luminance = (rgb) => {
        const r = rgb.r;
        const g = rgb.g;
        const b = rgb.b;

        const lum = (r * 299 + g * 587 + b * 114) / 1000;

        return lum > 155;
    };

    return {
        getHslaFromString,
        getColorType,
        hexToRgb,
        hexToRgba,
        hexToAlpha,
        hexToHsl,
        hexToHsla,
        hexaToHsla,
        validateHex,
        validateHexa,
        percentToRgb,
        rgbToHex,
        rgbToRgba,
        rgbToHsl,
        rgbToHsla,
        rgbToString,
        rgbaToHex,
        rgbaToHexa,
        rgbaToRgb,
        rgbaToRgbMerge,
        rgbaToHsl,
        rgbaToHsla,
        rgbaToString,
        hslToHex,
        hslToHexa,
        hslToRgb,
        hslToRgbVariant,
        hslToRgba,
        hslToHsla,
        hslToString,
        hslaToHex,
        hslaToHexa,
        hslaToRgb,
        hslaToRgba,
        hslaToHsl,
        hslaToString,
        luminance,
    };
})();
