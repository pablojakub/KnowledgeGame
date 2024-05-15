
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
const robot = new Character(robot_idle, {x: 500, y: initialRobotYPosition});

const answerYPosition = 120;
const answerA = new Image();
answerA.src = './AnswerA.png';

const answerB = new Image();
answerB.src = './AnswerB.png';

const answerC = new Image();
answerC.src = './AnswerC.png';

const answerD = new Image();
answerD.src = './AnswerD.png';


const changeQuestionButton = {
    x: 1030,
    y: 730,
    width: 120,
    height: 50,
};

let key_w_pressed = false;

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
    if (event.key === 'a' && robot.state !== 'jumpUp') {
        robot.move(robot_moving, false);
    }

    if (event.key === 'd' && robot.state !== 'jumpUp') {
        robot.move(robot_moving, true);
    }

    if (event.key === 'w' && robot.state === 'idle') {
        robot.state = 'jumpUp';
    }
});

window.addEventListener('keyup', (event) => {
    if (event.key === 'w' && robot.state !== 'moving') {
        robot.state = 'jumpDown';
    } else {
        robot.idle(robot_idle, initialRobotYPosition);
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

    ctx.font = '16px Arial';
    ctx.fillStyle = '#ece9f3';
    const firstAnswer = questions[currentQuestionNumber].A;
    ctx.fillText(firstAnswer, 80, answerYPosition - 20);

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
    ctx.drawImage(answerA, 100, answerYPosition);
    ctx.drawImage(answerB, 400, answerYPosition);
    ctx.drawImage(answerC, 700, answerYPosition);
    ctx.drawImage(answerD, 1000, answerYPosition);
    robot.draw();
    console.log(robot.state);
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
        robot.jump(robot_jumping, true, robot_idle);
    }

    if (robot.state === 'jumpDown') {
        robot.jump(robot_jumping, false, robot_idle);
    }

    setTimeout(() => {
        requestAnimationFrame(showAndAnimateRobot);
    }, 1000 / robot.frame);
}
console.log('🚀 ~ showAndAnimateRobot ~ robot:', robot);
console.log('🚀 ~ showAndAnimateRobot ~ robot:', robot);

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

