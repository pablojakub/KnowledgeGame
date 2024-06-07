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

function showScoreBoard() {
    gameBoard.style.display = 'none';
    scoreBoard.style.display = 'block';

    let currentScore = parseInt(score.innerText, 10);
    userScore.innerHTML = `${currentScore} pkt`;
}

