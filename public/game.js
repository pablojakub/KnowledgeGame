const score = document.getElementById('scoreResult');
const canvas = document.getElementById('game_canvas');
const scoreBoard = document.getElementById('score_board');
const userScore = document.getElementById('user_score');
const healthCheckbox = document.getElementById('health');
const gameBoard = document.getElementById('game');
const scoreTable = document.getElementById('score-table');
const backgroundMusic = document.getElementById('backgroundMusic');
const click = document.getElementById('click');
const success = document.getElementById('success');
const errorAnswer = document.getElementById('error-answer');
const soundButton = document.getElementById('sound-button');
const githubButton = document.getElementById('github-button');
const ctx = canvas.getContext('2d');
let questions;
let currentQuestionNumber;
let question;
let secondsLeft = 30;
let frameNumber = 0;
let attempts = 0;
let isSoundEnabled = true;
const questionsAsked = [];

const image_background = new Image();
image_background.src = './background.png';

const robot_idle = new Image();
robot_idle.src = './idle.png';

const robot_moving = new Image();
robot_moving.src = './move.png';

const robot_jumping = new Image();
robot_jumping.src = './jump.png';

const initialRobotYPosition = 550;
const robot = new Character(robot_idle, {x: 500, y: initialRobotYPosition}, {
    idle: robot_idle,
    moving: robot_moving,
    jumping: robot_jumping,
});

const planetYPosition = 120;
const planetHeight = 125;
const answerA = new Image();
answerA.src = './AnswerA.png';

const answerB = new Image();
answerB.src = './AnswerB.png';

const answerC = new Image();
answerC.src = './AnswerC.png';

const answerD = new Image();
answerD.src = './AnswerD.png';
const planets = [];

for (let i = 0; i <= 3; i++) {
    switch (i) {
        case 0:
            planets.push(new Planet(answerA, planetYPosition, i));
            break;
        case 1:
            planets.push(new Planet(answerB, planetYPosition, i));
            break;
        case 2:
            planets.push(new Planet(answerC, planetYPosition, i));
            break;
        case 3:
            planets.push(new Planet(answerD, planetYPosition, i));
    }
}

const lives = [];
for (let i = 0; i <= 2; i++) {
    lives.push(new Life());
}

const missileImage = new Image();
missileImage.src = './missile.png';
const missiles = [];

const changeQuestionButton = {
    x: 1030,
    y: 730,
    width: 120,
    height: 50,
};

const cursor = {
    x: 0,
    y: 0,
};

canvas.addEventListener('click', (event) => {
    let game_rectangle = canvas.getBoundingClientRect();
    cursor.x = event.clientX - game_rectangle.left;
    cursor.y = event.clientY - game_rectangle.top;

    if (elementWasClicked(cursor, changeQuestionButton)) {
        changeQuestion();
    }
});

canvas.addEventListener('mousemove', (event) => {
    let game_rectangle = canvas.getBoundingClientRect();
    cursor.x = event.clientX - game_rectangle.left;
    cursor.y = event.clientY - game_rectangle.top;

    if (elementWasClicked(cursor, changeQuestionButton)) {
        canvas.style.cursor = 'pointer';
    } else {
        canvas.style.cursor = 'default';
    }
});

githubButton.addEventListener('click', () => {
    window.open('https://github.com/pablojakub/KnowledgeGame', '_blank');
})

window.addEventListener('keydown', (event) => {
    const canMoving = robot.state === 'idle' || robot.state === 'movingLeft' || robot.state === 'movingRight';

    if (event.key === 'a' && canMoving) {
        robot.state = 'movingLeft';
    }

    if (event.key === 'd' && canMoving) {
        robot.state = 'movingRight';
    }

    if (event.key === 'w' && canMoving) {
        robot.state = 'jumpUp';
    }

    if (event.key === 'f' && robot.state !== 'jumpUp') {
        missiles.push(new Missile(missileImage, planets));
        robot.state = 'firing';
    }
});

window.addEventListener('keyup', (event) => {
    if (event.key === 'w' && robot.state !== 'moving') {
        robot.state = 'jumpDown';
    }

    if (event.key === 'd' && robot.state === 'movingRight') {
        robot.idle(initialRobotYPosition);
    }

    if (event.key === 'a' && robot.state === 'movingLeft') {
        robot.idle(initialRobotYPosition);
    }
});

soundButton.addEventListener('click', () => {
    click.play();
    isSoundEnabled = !isSoundEnabled;
    soundButton.classList.toggle('disabled');

    if (isSoundEnabled === false) {
        backgroundMusic.pause()
    } else {
        backgroundMusic.play()
    }
})

const getQuestions = async () => {
    const result = await fetch('/get-questions')
        .then(result => {
            return result.json();
        })
        .then(resp => {
            questions = resp;
            showFirstQuestion();
        })
        .catch(e => alert('Coś poszło nie tak przy wczytywaniu pytań'));

    return result;
};

const showQuestion = async () => {
    if (questions === undefined || currentQuestionNumber === undefined) {
        return;
    }
    ctx.font = '42px Arial';
    ctx.fillStyle = '#ece9f3';
    question = questions[currentQuestionNumber];
    currentCorrectAnswer = question.correctAnswer;
    ctx.fillText(question.questionBody, 30, 770);
    planets.forEach((planet, index) => {
        switch (index) {
            case 0:
                planet.draw(question.answers.A);
                break;
            case 1:
                planet.draw(question.answers.B);
                break;
            case 2:
                planet.draw(question.answers.C);
                break;
            case 3:
                planet.draw(question.answers.D);
        }
    });
};

function changeQuestion() {
    currentQuestionNumber = generateRandomNumber(0, questions.length);

    if (questionsAsked.length === questions.length) {
        alert('Odpowiedziałeś na wszystkie pytania! Gratulacje!');
        void showScoreBoard();
        return;
    }
    attempts = 0;
    secondsLeft = 30;
    resetPlanetState();

    while (true) {
        if (questionsAsked.includes(currentQuestionNumber)) {
            currentQuestionNumber = generateRandomNumber(0, questions.length);
        } else {
            break;
        }
    }
    questionsAsked.push(currentQuestionNumber);;
    question = questions[currentQuestionNumber];
    ctx.font = '42px Arial';
    ctx.fillStyle = '#ece9f3';
    ctx.fillText(question.questionBody, 30, 770);
    attachChangeButton();
}

function showAndAnimateRobot() {
    if (scoreBoard.style.display === 'block') {
        return;
    }
    clearCanvas(true);
    ctx.drawImage(image_background, 0, 0);
    robot.draw();
    showQuestion();
    attachLives();
    showTime();
    attachChangeButton();
    if (robot.state === 'idle') {
        robot.position.y += robot.animationMoveSpeed;
        if (robot.position.y >= initialRobotYPosition + 20) {
            robot.animationMoveSpeed = -robot.animationMoveSpeed;
        }

        if (robot.position.y <= initialRobotYPosition - 20) {
            robot.animationMoveSpeed = -robot.animationMoveSpeed;
        }
    }

    if (robot.state === 'jumpUp') {
        robot.jump(true, planetHeight + planetYPosition, planets);
    }

    if (robot.state === 'jumpDown') {
        robot.jump(false, planetHeight + planetYPosition, planets);
    }

    if (robot.state === 'firing') {
        robot.shoot(missiles);
    }

    if (robot.state === 'movingRight') {
        robot.move(true);
    }

    if (robot.state === 'movingLeft') {
        robot.move(false);
    }

    setTimeout(() => {
        requestAnimationFrame(showAndAnimateRobot);
    }, 1000 / robot.frame);
}

// utils
function generateRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function elementWasClicked(cursor, elementProperties) {
    return cursor.x >= elementProperties.x && cursor.y <= elementProperties.x + elementProperties.width && cursor.y >= elementProperties.y && cursor.y <= elementProperties.y + elementProperties.height;
}

function attachChangeButton() {
    ctx.fillStyle = '#bfb7d6';
    ctx.fillRect(changeQuestionButton.x, changeQuestionButton.y, changeQuestionButton.width, changeQuestionButton.height);
    ctx.font = '28px Arial';
    ctx.fillStyle = '#2d2542';
    ctx.fillText('Zmień', 1050, 765);
}

function clearCanvas(wholeCanvas) {
    if (wholeCanvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height - 100);
    }
}

function showFirstQuestion() {
    ctx.font = '42px Arial';
    ctx.fillStyle = '#ece9f3';
    const questionNumber = generateRandomNumber(0, questions.length);
    currentQuestionNumber = questionNumber;
    questionsAsked.push(questionNumber);
    question = questions[questionNumber];
    currentCorrectAnswer = question.correctAnswer;
    ctx.fillText(question.questionBody, 30, 770);
}

function checkAnswer(answer, isJumping, planet) {
    if (isJumping === false) {
        robot.state = 'idle';
    } else {
        robot.state = 'jumpDown';
    }
    if (answer === question.correctAnswer) {
        showCorrectAnswerAnimation();
        planet.explode(false);
        let currentScore = parseInt(score.innerText, 10);
        currentScore += 1 * secondsLeft;
        score.innerText = currentScore.toString();
        changeQuestion();
    } else {
        planet.explode(true);
        showError();
        attempts++;
        if (healthCheckbox.checked) {
            lives.pop();
        }
        if (lives.length === 0) {
            alert('Koniec gry przegrałeś');
            void showScoreBoard();
            return;
        }
        if (attempts === 3) {
            changeQuestion();
        }
    }

}

function resetPlanetState() {
    planets.forEach((planet) => {
        planet.state = 'safe';
    });
}

function attachLives() {
    lives.forEach((live, index) => {
        live.draw(40 + (index + 1) * 25);
    });
}

function showTime() {
    if (secondsLeft === 0) {
        alert('Koniec czasu');
        changeQuestion();
        return;
    }
    frameNumber++;
    if (frameNumber === 40) {
        frameNumber = 0;
        secondsLeft--;
    }
    ctx.font = '22px Arial';
    ctx.fillStyle = '#ece9f3';
    ctx.fillText(`Zostało: ${secondsLeft} sekund`, 980, 40)
}

async function showScoreBoard() {
    gameBoard.style.display = 'none';
    scoreBoard.style.display = 'block';
    buttonsPanel.style.display = 'block';
    scorePanel.style.display = 'none';
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;

    const currentUser = localStorage.getItem('username') ?? 'user_not_found'
    const userId = localStorage.getItem('userId');

    if (!!userId === false) {
        throw new Error('Could not find user');
    }
    let currentScore = parseInt(score.innerText, 10);
    userScore.innerHTML = `${currentUser}: ${currentScore} pkt`;
    const sendScoreResult = await addUserScore(currentUser, currentScore, userId);
    if (sendScoreResult === undefined || sendScoreResult.length === 0) {
        return;
    }
    let html = '';
    sendScoreResult.forEach((score) => {
        html += `<div>${score.nickName}</div><div>${score.score}</div>`;
    })
    scoreTable.insertAdjacentHTML('beforeend', html);
}

async function addUserScore(userName, score, userId) {
    const result = await fetch('/add-user-score', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            nickName: userName,
            score: score,
            userId: userId,
        })
    });
    if (result.ok === false) {
        const errResult = await result.json();
        alert(errResult.error);
        showConfigBoard();
        return;
    }
    return await result.json();
}

function showConfigBoard() {
    gameBoard.style.display = 'none';
    scoreBoard.style.display = 'none';
    configBoard.style.display = 'block';
}

function showError() {
    errorAnswer.classList.add('error_answer_show');

    setTimeout(() => {
        errorAnswer.classList.remove('error_answer_show');
    }, 250);
};


function showCorrectAnswerAnimation() {
    if (isSoundEnabled) {
        success.play();
    }
}