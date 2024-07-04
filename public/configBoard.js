const userInput = document.getElementById('username');
const playBtn = document.getElementById('playBtn');

userInput.value = localStorage.getItem('username') ?? '';

playBtn.addEventListener('click', (e) => {
    e.preventDefault();
    console.log(userInput);
    localStorage.setItem('username', userInput.value);
    userInput.value = '';
});

