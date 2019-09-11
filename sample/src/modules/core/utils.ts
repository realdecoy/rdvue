export function getRandomNumber() {
    return Math.floor(Math.random() * 100);
}

export function capitalize(word: string) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}
