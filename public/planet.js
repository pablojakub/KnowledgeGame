class Planet {

    constructor(image, positionY, number) {
        this.state = 'safe';
        this.image = image;
        this.number = number;
        this.positionY = positionY;
        this.positionX = 0;
        this.width = 130;
        this.answer = '';
        this.safeImage = image;
        this.explodeImage = new Image();
        this.explodeImage.src = './explode.png';
    }

    draw(answer) {
        this.answer = answer;
        this.image = this.state === 'safe' ? this.safeImage : this.explodeImage;
        this.positionX = this.number === 0 ? 100 : this.number * 300 + 100;
        if (this.number === 0) {
            ctx.drawImage(this.image, this.positionX, this.positionY);
        } else {
            ctx.drawImage(this.image, this.positionX, this.positionY);
        }
        this.attachAnswer(this.answer, this.positionX - 20);
    }

    explode() {
        const explosionSound = document.getElementById(`explosion`);
        explosionSound.play();
        this.state = 'exploded';
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