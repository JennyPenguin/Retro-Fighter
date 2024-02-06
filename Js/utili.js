function rectangularCollision({ rectangle1, rectangle2 }) {
    return (rectangle1.attackBox.position.x + rectangle1.attackBox.width >=
        rectangle2.position.x &&
      rectangle1.attackBox.position.x <=
        rectangle2.position.x + rectangle2.width &&
      rectangle1.attackBox.position.y + rectangle1.attackBox.height >=
        rectangle2.position.y &&
      rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height);
}

function determineWinner({ player, enemy, timerId }) {
    clearTimeout(timerId);
    document.getElementById("displayText").style.display = "flex";
    if (player.health == enemy.health) {
        document.getElementById("displayText").innerHTML = "Tie";
    } else if (player.health > enemy.health) {
        document.getElementById("displayText").innerHTML = "Hippo Wins!";
    } else {
        document.getElementById("displayText").innerHTML = "Octupus Wins!";
    }
}

let timer = 180;
let timerId;
function decreaseTimer() {
    if (timer > 0) {
        timerId = setTimeout(decreaseTimer, 1000)
        timer--;
        document.getElementById("timer").innerHTML = timer;
    }
    if (timer == 0) {
        determineWinner({ player, enemy, timerId });
    }
}


function getRandomKey() {
    return Math.floor(100000 + Math.random() * 900000);
}

function randomFromArray(array) {
    return array[Math.floor(Math.random() * array.length)];
}
