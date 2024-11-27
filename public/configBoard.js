const userInput = document.getElementById('username');
const playBtn = document.getElementById('playBtn');
const configBoard = document.getElementById('config_board');
const errorMsg = document.getElementById('errorMsg');
const playSound = document.getElementById('play');
const buttonsPanel = document.getElementById('buttons_panel');
const scorePanel = document.getElementById('score');

userInput.value = localStorage.getItem('username') ?? '';

fetch('/version')
    .then((resp) => resp.json())
    .then((r) => {
        document.getElementById('app-version').textContent =
            'Wersja: ' + r.version;
    })

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
    const userIdFromStorage = localStorage.getItem('userId');
    const userId = !!userIdFromStorage === false ? crypto.randomUUID() : userIdFromStorage;
    localStorage.setItem('userId', userId);
    userInput.value = '';
    playSound.play();
    setTimeout(() => {
        gameBoard.style.display = 'block';
        configBoard.style.display = 'none';
        backgroundMusic.play();
        getQuestions();
        showAndAnimateRobot();
        buttonsPanel.style.display = 'none';
        scorePanel.style.display = 'block';
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

