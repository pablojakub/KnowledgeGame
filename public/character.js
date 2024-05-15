class Character {

    constructor(image, position) {
        this.image = image;
        this.position = position;
        this.animationMoveSpeed = 1;
        this.state = 'idle';
        this.frame = 20;
        this.velocity = 0;
        this.weight = 1;
    }

    isStanding() {
        return this.position.y >= 470 && this.position.y <= 490;
    }


    jump(image) {
        this.image = image;
        this.frame = 60;
        this.velocity = -10;
        this.position.y += this.velocity;
    }

    draw() {
        ctx.drawImage(this.image, this.position.x, this.position.y);
    }

    move(image, toRight) {
        this.image = image;
        this.state = 'moving';
        this.frame = 60;
        if (toRight && this.position.x < canvas.width - 125) {
            this.position.x += 12;
        } else if (toRight === false && this.position.x > 0) {
            this.position.x -= 12;
        }

    }

    idle(image, positionY) {
        this.image = image;
        this.state = 'idle';
        this.frame = 20;

        if (positionY) {
            this.position.y = positionY;
        }
    }


    jumpDown(image) {
        this.image = image;
        this.state = 'jumpUp';
        this.frame = 60;
    }
}