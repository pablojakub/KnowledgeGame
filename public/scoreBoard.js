const rematchBtn = document.getElementById('rematchBtn');


rematchBtn.addEventListener('click', () => {
    //TODO: finish rematch
    if (isSoundEnabled) {
        playSound.play();
    }
    setTimeout(() => {
        if (isSoundEnabled) {
            backgroundMusic.play()
        };
        resetPlanetState();
        gameBoard.style.display = 'block';
        scoreBoard.style.display = 'none';
        buttonsPanel.style.display = 'none';
        score.innerHTML = '0';
        scorePanel.style.display = 'block';
        showAndAnimateRobot();
    }, 2000);
    getQuestions();
});



