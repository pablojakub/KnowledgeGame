export function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

export function shuffleAnswers(question) {
    const keys = Object.keys(question);
    const values = Object.values(question);

    shuffleArray(values);

    const newObj = {};
    keys.forEach((key, index) => {
        newObj[key] = values[index];
    });

    return newObj;
}