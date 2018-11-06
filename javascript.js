var registerBtn = document.querySelector("#nav-register");
var loginBtn = document.querySelector("#nav-login");
var registerForm = document.querySelector(".register-form");
var mainContent = document.getElementById("main-content");
var loginDiv = document.querySelector(".login-form-div");
var register = document.querySelector(".register-btn");
var login = document.querySelector(".login-btn");
var profile = document.querySelector("#profile");
var userName = document.querySelector("#username");
var passWord = document.querySelector("#password");
var passwordRepeat = document.querySelector("#password_repeat");
var LoginInput = document.getElementById("username-login");
var invalid = document.getElementById("invalid-text");
var PAGE_DATA = {};

function showRegister() {
    mainContent.style.display = "none";
    mainContent.classList.remove("d-flex");
    registerForm.style.display = "block";
    loginDiv.style.display = "none";
}
function showLogin() {
    mainContent.style.display = "none";
    mainContent.classList.remove("d-flex");
    loginDiv.style.display = "block";
    registerForm.style.display = "none";
}
function showProfileAfterRegister(event) {
    event.preventDefault();
    fetchRegisterData();
}

function fetchRegisterData() {
    var passwordRepeat = document.querySelector("#password_repeat");

    fetch("https://bcca-pingpong.herokuapp.com/api/register/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json;charset=utf-8"
        },
        body: JSON.stringify({
            username: userName.value,
            password: passWord.value,
            password_repeat: passwordRepeat.value
        })
    })
        .then(r => r.json())
        .then(obj => {
            if (obj.token) {
                var userName = document.querySelector("#username");
                var passWord = document.querySelector("#password");

                mainContent.style.display = "none";
                registerForm.style.display = "none";
                loginDiv.style.display = "none";
                profile.style.display = "block";
                console.log(profile);
                var welcome = document.getElementById("welcome-user");

                welcome.innerHTML = userName.value;

                console.log(obj);
            } else {
                invalid.style.display = "block";
            }
        });
}

function showProfileAfterLogin(event) {
    event.preventDefault();
    fetchLoginInfo();
}

function addScore() {
    const score1 = document.getElementById("score-1");
    const score2 = document.getElementById("score-2");
    var restartPopup = document.querySelector(".reset-game");

    var count = 0;
    var score = 0;

    score1.addEventListener("click", function() {
        count += 1;
        score1.innerText = count;
        if (score1.innerText === "10") {
            score1.disabled = true;
            score2.disabled = true;
            restartPopup.style.display = "block";
            resetGame(score1, score2);
            count = 0;
        }
    });

    score2.addEventListener("click", () => {
        score += 1;
        score2.innerText = score;
        if (score2.innerText === "10") {
            score2.disabled = true;
            score1.disabled = true;
            restartPopup.style.display = "block";
            resetGame(score1, score2);
            score = 0;
        }
    });
}

function resetGame(score1, score2) {
    var restartBtn = document.getElementById("restart-btn");
    var restartPopup = document.querySelector(".reset-game");
    var homeScore1 = document.getElementById("home-score1");
    var homeScore2 = document.getElementById("home-score2");

    restartBtn.addEventListener("click", () => {
        homeScore1.innerText = score1.innerText;
        homeScore2.innerText = score2.innerText;
        score1.innerText = "0";
        score2.innerText = "0";
        restartPopup.style.display = "none";
        score1.disabled = false;
        score2.disabled = false;
    });
}

function fetchLoginInfo() {
    fetch("https://bcca-pingpong.herokuapp.com/api/login/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json;charset=utf-8"
        },
        body: JSON.stringify({
            username: userName.value,
            password: passWord.value
        })
    })
        .then(r => r.json())
        .then(obj => {
            PAGE_DATA.token = obj.token;
            if (PAGE_DATA.token) {
                mainContent.style.display = "none";
                registerForm.style.display = "none";
                loginDiv.style.display = "none";
                profile.style.display = "block";
                register.disabled = true;
                login.disabled = true;
                console.log({
                    username: userName.value,
                    password: passWord.value
                });
                var welcome = document.getElementById("welcome-user");

                welcome.innerHTML = LoginInput.value;
            }
        });
}

registerForm.addEventListener("submit", showProfileAfterRegister);
loginDiv.addEventListener("submit", showProfileAfterLogin);
registerBtn.addEventListener("click", showRegister);
loginBtn.addEventListener("click", showLogin);
addScore();
