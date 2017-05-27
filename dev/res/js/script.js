"use strict";

let stepsComp = [],
    stepsUser = [],
    globalCounter = 0,
    stepCounter = makeCounter(),
    startGameBtn = document.getElementById("start-game"),
    message = document.getElementById("message"),
    messageTitle = document.getElementById("msg-title"),
    btn = document.getElementsByClassName("simon__btn"),
    bestScore = document.getElementById("best"),
    score = document.getElementById("score");


bestScore.innerHTML = localStorage.getItem("bestScore") || 0;

startGameBtn.addEventListener("click", startGame, false);

function startGame() {
    message.classList.remove("message_active");

    for (let i = 0; i < btn.length; i++) {
        btn[i].classList.remove("simon__btn_out-game");
    }

    setTimeout(function() {
        step();
    }, 1000);
}

function step() {
    generateSeries(globalCounter);

    stepsComp.forEach(function(item, i) {
        setTimeout(function() {
            lightSimonBtn(item);
            playSound(item);
        }, 1000 * i++);
    });

    setTimeout(function() {
        giveClickSimonBtn();
    }, 1000 * stepsComp.length);

    globalCounter++;
}

function generateSeries(num) {
    for(let i = 0; i <= num; i++) {
        stepsComp[i] = rand();
    }
}

function rand() {
    let min = 0,
        max = 3;

    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function makeCounter() {
    let currentCounter = 0;

    return function(newValue) {
        if (newValue !== undefined) {
            currentCounter = +newValue;
            return currentCounter;
        }

        return ++currentCounter;
    }
}

function addScore() {
    let currentScore = globalCounter * 100;

    score.innerHTML = currentScore;

    if (+score.innerHTML > +bestScore.innerHTML) {
        bestScore.innerHTML = currentScore;
        localStorage.setItem("bestScore", bestScore.innerHTML);
    }

}

function lightSimonBtn(item) {
    document.querySelector(`button[data-btn="${item}"]`).classList.add("click");

    setTimeout(function() {
        document.querySelector(`button[data-btn="${item}"]`).classList.remove("click");
    }, 500);
}

function playSound(item) {
    let audio = document.querySelector(`audio[data-sound="${item}"]`);

    if (!audio) return;
    audio.currentTime = 0;
    audio.play();
}

function mouseDownSimonBtn(e) {
    e.target.classList.add("click");
    lightSimonBtn(e.target.dataset.btn);
    playSound(e.target.dataset.btn);
}

function mouseUpSimonBtn(e) {
    e.target.classList.remove("click");
    stepsUser.push(+e.target.dataset.btn);
    checkingStep( stepCounter() );
}

function giveClickSimonBtn() {
    for (let i = 0; i < btn.length; i++) {
        btn[i].classList.add("simon__btn_active");
        btn[i].addEventListener("mousedown", mouseDownSimonBtn, false);
        btn[i].addEventListener("mouseup", mouseUpSimonBtn, false);
    }
}

function takeClickSimonBtn() {
    for (let i = 0; i < btn.length; i++) {
        btn[i].classList.remove("simon__btn_active");
        btn[i].removeEventListener("mousedown", mouseDownSimonBtn, false);
        btn[i].removeEventListener("mouseup", mouseUpSimonBtn, false);
    }
}

function gameOver() {

    resetSeries();

    for (let i = 0; i < btn.length; i++) {
        btn[i].classList.add("simon__btn_end");
    }

    setTimeout(function () {
        message.classList.add("message_active", "message_end");
        messageTitle.classList.add("message__title_active");

        for (let i = 0; i < btn.length; i++) {
            btn[i].classList.add("simon__btn_out-game");
            btn[i].classList.remove("simon__btn_end");
        }
    }, 1500);
}

function resetStep() {
    takeClickSimonBtn();
    stepsComp = [];
    stepsUser = [];
    stepCounter(0);
}

function resetSeries() {
    resetStep();
    score.innerHTML = 0;
    globalCounter = 0;
    startGameBtn.innerHTML = "Try again";
}

function checkingStep(index) {
    if (stepsUser[index - 1] === stepsComp[index - 1]) {

        if (globalCounter === index) {
            addScore();
            resetStep();
            setTimeout(function() {
                return step();
            }, 1000);
        }

    } else {
        gameOver();
    }
}