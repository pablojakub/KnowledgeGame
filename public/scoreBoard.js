const userScore = document.getElementById('user_score');
const rematchBtn = document.getElementById('rematchBtn');

rematchBtn.addEventListener('click', () => {
    gameBoard.style.display = 'block';
    scoreBoard.style.display = 'none';
    //TODO: finish rematch
    backgroundMusic.play();
    getQuestions();
    showAndAnimateRobot();
});

async function showScoreBoard() {
    gameBoard.style.display = 'none';
    scoreBoard.style.display = 'block';

    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;

    const users = await getAllUsers();
    console.log('🚀 ~ showScoreBoard ~ users:', users);
    let currentScore = parseInt(score.innerText, 10);
    userScore.innerHTML = `${currentScore} pkt`;
}

async function getAllUsers() {
    const result = await fetch('/get-users-score');
    if (result.status === 500) {
        // TODO: display error result and users
        return;
    }
    return result;
}

