class Life {
    constructor() {
        this.image = new Image();
        this.image.src = './life.png';
        this.positionY = 15;
    }

    draw(positionX) {
        ctx.drawImage(this.image, positionX, this.positionY);
    }
}