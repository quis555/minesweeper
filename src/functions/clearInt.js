export default function clearInt(value) {
    return parseInt(value.toString().replace(/\D/g, ''));
}
