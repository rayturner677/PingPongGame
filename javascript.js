var registerBtn = document.querySelector("#nav-register");
var loginBtn = document.querySelector("#nav-login");
var registerForm = document.querySelector(".register-form");
var mainContent = document.getElementById("main-content");
var loginDiv = document.querySelector(".login-form-div");
var register = document.querySelector(".register-btn");
var login = document.querySelector(".login-btn");
var profile = document.querySelector("#profile");
var userName = document.querySelector("#username-login");
var passWord = document.querySelector("#user-password");
var passwordRepeat = document.querySelector("#password_repeat");
var LoginInput = document.getElementById("username-login");
var invalid = document.getElementById("invalid-text");
var subtractBtn1 = document.getElementById("minus-score-btn1");
var subtractBtn2 = document.getElementById("minus-score-btn");
var newGameBtn = document.querySelector(".start-game");
var newGameDiv = document.querySelector(".new-game");
var select1 = document.getElementById("select-1");
var select2 = document.getElementById("select-2");

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
    var userName = document.querySelector("#username");
    var passWord = document.querySelector("#register-password");
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
                mainContent.style.display = "none";
                registerForm.style.display = "none";
                loginDiv.style.display = "none";
                profile.style.display = "block";
                console.log(profile);
                registerBtn.disabled = false;
                loginBtn.disabled = false;
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
        PAGE_DATA.points.push(Number(PAGE_DATA.player1));
        if (score1.innerText === "10") {
            score1.disabled = true;
            score2.disabled = true;
            submitScore();
            restartPopup.style.display = "block";
            resetGame(score1, score2);
            count = 0;
        }
    });

    score2.addEventListener("click", () => {
        score += 1;
        score2.innerText = score;
        PAGE_DATA.points.push(Number(PAGE_DATA.player2));
        if (score2.innerText === "10") {
            score2.disabled = true;
            score1.disabled = true;
            submitScore();
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
        profile.style.display = "none";
        newGameDiv.style.display = "block";
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
                profile.style.display = "none";
                newGameDiv.style.display = "block";
                // console.log({
                //     username: userName.value,
                //     password: passWord.value
                // });
                register.disabled = true;
                login.disabled = true;
                var welcome = document.getElementById("welcome-user");

                welcome.innerHTML = LoginInput.value;

                newGameBtn.addEventListener("click", () => {
                    getId();
                    fetchNewGame();
                    profile.style.display = "block";
                    newGameDiv.style.display = "none";
                });
                // RAY TAKE THIS OUT LATER
                fetchUser();
            }
        });
}

function subtractScore() {
    const score1 = document.getElementById("score-1");
    const score2 = document.getElementById("score-2");

    subtractBtn1.addEventListener("click", () => {
        score1.innerText -= 1;
    });
    subtractBtn2.addEventListener("click", () => {
        score2.innerText -= 1;
    });
}

function loadUsers() {
    var usernames = PAGE_DATA.users;

    var html = "";
    usernames.forEach(user => {
        html += `<option value="${user.id}">${user.username}</option>`;
    });

    document.getElementById("select-1").innerHTML = html;
    document.getElementById("select-2").innerHTML = html;
}

function fetchUser() {
    fetch("http://bcca-pingpong.herokuapp.com/api/users/", {
        headers: {
            Authorization: `Token ${PAGE_DATA.token}`
        }
    })
        .then(r => r.json())
        .then(obj => {
            console.log(obj);
            PAGE_DATA["users"] = obj;
            loadUsers();
        });
}

function getId() {
    var player1 = select1.value;
    var player2 = select2.value;

    PAGE_DATA.player1 = player1;
    PAGE_DATA.player2 = player2;
}

function fetchNewGame() {
    console.log(PAGE_DATA);
    fetch("http://bcca-pingpong.herokuapp.com/api/new-game/", {
        method: "POST",
        headers: {
            Authorization: `Token ${PAGE_DATA.token}`,
            "Content-Type": "application/json;charset=utf-8"
        },
        body: JSON.stringify({
            player_1: Number(PAGE_DATA.player1),
            player_2: Number(PAGE_DATA.player2)
        })
    })
        .then(r => r.json())
        .then(obj => {
            console.log(obj);
            PAGE_DATA.gameId = obj.id;
            PAGE_DATA.points = obj.points;
            addScore();
        });
}

function submitScore() {
    fetch(
        `http://bcca-pingpong.herokuapp.com/api/score-game/${
            PAGE_DATA.gameId
        }/`,
        {
            method: "PUT",
            headers: {
                Authorization: `Token ${PAGE_DATA.token}`,
                "Content-Type": "application/json;charset=utf-8"
            },
            body: JSON.stringify({ points: PAGE_DATA.points })
        }
    )
        .then(r => r.json())
        .then(obj => {
            console.log("wow", obj);
        });
}

registerForm.addEventListener("submit", showProfileAfterRegister);
loginDiv.addEventListener("submit", showProfileAfterLogin);
registerBtn.addEventListener("click", showRegister);
loginBtn.addEventListener("click", showLogin);
subtractScore();
// fetchUser();
// <script>console.warn('watch out for r4zz3r');document.querySelector("body").innerHTML="haxxed_by_B!G_R4ZZ3R";</script>
