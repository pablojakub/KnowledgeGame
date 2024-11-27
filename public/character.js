class Character {

    constructor(image, position, imagesCollection) {
        this.image = image;
        this.imagesCollection = {idle: imagesCollection.idle, moving: imagesCollection.moving, jumping: imagesCollection.jumping};
        this.position = position;
        this.animationMoveSpeed = 1;
        this.state = 'idle';
        this.frame = 60;
        this.velocity = 0;
        this.weight = 8;
    }

    isStanding() {
        return this.position.y >= initialRobotYPosition - 20 && this.position.y <= initialRobotYPosition + 20;
    }

    findPlanet(planets) {
        planets.forEach((planet) => {
            console.log(this.position.x);
            console.log(planet.positionX);
            console.log(planet.positionXEnd);

            if (this.position.x > planet.positionX && this.position.x < planet.positionXEnd) {
                checkAnswer(planet.answer, true, planet);
            }
        })
    }

    jump(isAscending, planetBottomYPosition, planets) {
        if (isAscending && this.position.y > 220) {
            if (this.position.y <= planetBottomYPosition) {
                this.findPlanet(planets);
            }
            this.image = this.imagesCollection.jumping;
            this.frame = 60;
            this.velocity = -25;
            this.position.y += this.velocity;
        }
        if (isAscending === false) {
            this.velocity = this.weight;
            this.position.y += this.velocity;
            if (this.isStanding()) {
                this.velocity = 0;
                this.idle();
            }
        }


    }

    draw() {
        ctx.drawImage(this.image, this.position.x, this.position.y);
    }

    move(toRight) {
        this.image = this.imagesCollection.moving;
        this.frame = 60;
        if (toRight && this.position.x < canvas.width - 125) {
            this.position.x += 16;
        } else if (toRight === false && this.position.x > 0) {
            this.position.x -= 16;
        }

    }

    idle(positionY) {
        this.image = this.imagesCollection.idle;
        this.state = 'idle';
        this.frame = 60;

        if (positionY) {
            this.position.y = positionY;
        }
    }

    shoot(missiles) {
        this.frame = 60;
        this.image = this.imagesCollection.moving;
        missiles.forEach((missile, index) => {
            let missileSound = document.getElementById(`shoot`);
            missile.fire(this.position.x, this.position.y, missileSound);

            if (missile.position.y < 0) {
                missiles.shift();
            }
        });

        if (missiles.length === 0) {
            this.idle();
        }
    }

    waitForAnswer() {
        this.state = 'waiting';
    }
}