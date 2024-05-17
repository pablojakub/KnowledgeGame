class Planet {

    constructor(image, positionY, number) {
        this.image = image;
        this.number = number;
        this.positionY = positionY;
    }

    draw(answer) {
        const xPosition = this.number === 0 ? 100 : this.number * 300 + 100;
        if (this.number === 0) {
            ctx.drawImage(this.image, xPosition, this.positionY);
        } else {
            ctx.drawImage(this.image, xPosition, this.positionY);
        }
        this.attachAnswer(answer, xPosition - 20);
    }

    attachAnswer(answer, xPos) {
        ctx.font = '16px Arial';
        ctx.fillStyle = '#ece9f3';
        if (this.answerIsLongerThanOneLine(answer)) {
            this.splitAnswer(answer, xPos, this.positionY - 20);
        } else {
            ctx.fillText(answer, xPos, this.positionY - 20);
        }
    }

    answerIsLongerThanOneLine(answer) {
        return answer.length > 27;
    }

    splitAnswer(answer, xPos, yPos) {
        if (answer.length < 54) {
            const firstPart = answer.slice(0, 27);
            const secondPart = answer.slice(27, answer.length);
            ctx.fillText(`${firstPart}-`, xPos, yPos - 20);
            ctx.fillText(secondPart, xPos, yPos);
        } else {
            const firstPart = answer.slice(0, 27);
            const secondPart = answer.slice(27, 48);
            const thirdPart = answer.slice(54, answer.length);
            ctx.fillText(`${firstPart}-`, xPos, yPos - 40);
            ctx.fillText(`${secondPart}-`, xPos, yPos - 20);
            ctx.fillText(thirdPart, xPos, yPos);
        }
    }
}