const rematchBtn = document.getElementById('rematchBtn');

rematchBtn.addEventListener('click', () => {
    //TODO: finish rematch
    playSound.play();
    setTimeout(() => {
        backgroundMusic.play();
        gameBoard.style.display = 'block';
        scoreBoard.style.display = 'none';
        showAndAnimateRobot();
    }, 2000);
    getQuestions();
});



