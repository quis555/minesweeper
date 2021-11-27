import clearInt from "./clearInt";

export default function validateInt(value, min, max, def) {
    let result = clearInt(value);
    if (isNaN(value)) {
        result = def;
    } else if (value > max) {
        result = max;
    } else if (value < min) {
        result = min;
    }
    return result;
}
