class Character {

    constructor(image, position) {
        this.image = image;
        this.position = position;
        this.animationMoveSpeed = 1;
        this.state = 'idle';
        this.frame = 20;
        this.velocity = 0;
        this.weight = 8;
    }

    isStanding() {
        return this.position.y >= initialRobotYPosition - 20 && this.position.y <= initialRobotYPosition + 20;
    }


    jump(image, isAscending, idleImage) {
        if (isAscending && this.position.y > 220) {
            this.image = image;
            this.frame = 100;
            this.velocity = -25;
            this.position.y += this.velocity;
        }
        if (isAscending === false) {
            this.velocity = this.weight;
            this.position.y += this.velocity;
            if (this.isStanding()) {
                this.velocity = 0;
                this.idle(idleImage);
            }
        }


    }

    draw() {
        ctx.drawImage(this.image, this.position.x, this.position.y);
    }

    move(image, toRight) {
        this.image = image;
        this.state = 'moving';
        this.frame = 100;
        if (toRight && this.position.x < canvas.width - 125) {
            this.position.x += 16;
        } else if (toRight === false && this.position.x > 0) {
            this.position.x -= 16;
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
}