class Missile {
    constructor(image) {
        this.image = image;
        this.position = {x: 0, y: 0};
        this.state = 'deaden';
    }

    fire(positionX, positionY) {
        if (this.state === 'deaden') {
            this.position.y = positionY;
        }
        this.state = 'fired';
        this.position.y -= 10;
        ctx.drawImage(this.image, positionX, this.position.y);
    }
}