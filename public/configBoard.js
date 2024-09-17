const userInput = document.getElementById('username');
const playBtn = document.getElementById('playBtn');
const configBoard = document.getElementById('config_board');
const errorMsg = document.getElementById('errorMsg');
const playSound = document.getElementById('play');

userInput.value = localStorage.getItem('username') ?? '';

playBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopImmediatePropagation();
    resetError();
    if (!!userInput.value === true) {
        prepareGame();
    } else {
        showError();
    }
});

function prepareGame() {
    playBtn.disabled = true;
    const sanitizedString = userInput.value.replace(/<[^>]*>?/gm, '')
    localStorage.setItem('username', sanitizedString);
    userInput.value = '';
    playSound.play();
    setTimeout(() => {
        gameBoard.style.display = 'block';
        configBoard.style.display = 'none';
        backgroundMusic.play();
        getQuestions();
        showAndAnimateRobot();
    }, 2000)
}

function resetError() {
    errorMsg.style.display = 'none';
    userInput.style.border = '2px solid hsl(185deg 84% 22%)';
}

function showError() {
    errorMsg.style.display = 'inline';
    errorMsg.innerHTML = 'Należy podać nazwę użytkownika';
    userInput.style.border = '2px solid hsl(0, 98%, 64%)';
}

