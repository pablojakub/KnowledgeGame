
class Missile {
    constructor(image, planets) {
        this.image = image;
        this.position = {x: 0, y: 0};
        this.state = 'deaden';
        this.planets = planets;
    }

    fire(positionX, positionY, missileSound) {
        if (missileSound !== null && this.state === 'deaden') {
            missileSound.currentTime = 0;
            missileSound.play();
        }
        this.position.x = positionX;
        if (this.state === 'deaden') {
            this.position.y = positionY;
        }
        this.state = 'fired';
        this.position.y -= 10;
        ctx.drawImage(this.image, this.position.x, this.position.y);

        this.planets.forEach((planet) => {
            if (this.position.y < planetYPosition + 50 && (this.position.x > planet.positionX - 50 && this.position.x < planet.positionX + planet.width - 30)) {
                if (planet.state !== 'exploded') {
                    planet.explode();
                    missiles.length = 0;
                    setTimeout(() => {
                        checkAnswer(planet.answer, planet);
                    }, 200);
                }
            }
        });
    }
}