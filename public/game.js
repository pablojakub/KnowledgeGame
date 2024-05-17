
const canvas = document.getElementById('game_canvas');
const ctx = canvas.getContext('2d');
let questions;
let currentQuestionNumber;
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
const answerA = new Image();
answerA.src = './AnswerA.png';
const planetA = new Planet(answerA, planetYPosition, 0);

const answerB = new Image();
answerB.src = './AnswerB.png';
const planetB = new Planet(answerB, planetYPosition, 1);

const answerC = new Image();
answerC.src = './AnswerC.png';
const planetC = new Planet(answerC, planetYPosition, 2);

const answerD = new Image();
answerD.src = './AnswerD.png';
const planetD = new Planet(answerD, planetYPosition, 3);

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
        missiles.push(new Missile(missileImage));
        robot.state = 'firing';
    }
});

window.addEventListener('keyup', (event) => {
    if (event.key === 'w' && robot.state !== 'moving') {
        robot.state = 'jumpDown';
    }

    if (event.key === 'd' && robot.state !== 'firing') {
        robot.idle(initialRobotYPosition);
    }

    if (event.key === 'a' && robot.state !== 'firing') {
        robot.idle(initialRobotYPosition);
    }
});

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
    const question = questions[currentQuestionNumber];
    ctx.fillText(question.questionBody, 30, 770);
    planetA.draw(question.A);
    planetB.draw(question.B);
    planetC.draw(question.C);
    planetD.draw(question.D);
};

function changeQuestion() {
    currentQuestionNumber = generateRandomNumber(0, questions.length);

    if (questionsAsked.length === questions.length) {
        alert('Odpowiedziałeś na wszystkie pytania! Gratulacje!');
        return;
    }

    while (true) {
        if (questionsAsked.includes(currentQuestionNumber)) {
            currentQuestionNumber = generateRandomNumber(0, questions.length);
        } else {
            break;
        }
    }
    questionsAsked.push(currentQuestionNumber);;
    const question = questions[currentQuestionNumber];
    ctx.font = '42px Arial';
    ctx.fillStyle = '#ece9f3';
    ctx.fillText(question.questionBody, 30, 770);
    attachChangeButton();
}

function showAndAnimateRobot() {
    clearCanvas(true);
    ctx.drawImage(image_background, 0, 0);
    robot.draw();
    showQuestion();
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
        robot.jump(true);
    }

    if (robot.state === 'jumpDown') {
        robot.jump(false);
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

getQuestions();
showAndAnimateRobot();


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
    const question = questions[questionNumber];
    ctx.fillText(question.questionBody, 30, 770);
}
