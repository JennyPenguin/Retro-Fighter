const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
const roomId = sessionStorage.getItem("roomId");
const playerId = sessionStorage.getItem("playerId");
const playerRef = firebase.database().ref(`${roomId}/players/${playerId}`);
const allPlayersRef = firebase.database().ref(`${roomId}/players`);
const side = sessionStorage.getItem("side");
const pName = sessionStorage.getItem("name");

playerRef.set({
    id: playerId,
    pName,
    score: 0,
    side,
    keyPressed: "",
    fighter: {
        position: {
            x: 0,
            y: 0
        },
        velocity: {
            x: 0,
            y: 0
        },
        isAttacking: false,
        lastKey: ""

    },
})

function updateKey(k) {
    playerRef.update({
        keyPressed: k
    })
}


// callback when value of players changes 
allPlayersRef.on("value", (snapshot) => {
    // fires whenever a change occurs
    players = snapshot.val() || {};
    Object.keys(players).forEach((key) => {
        const curr = players[key];
        console.log(curr);
        if (curr.keyPressed != "" && curr.side != side) {
            mimicKey(curr.keyPressed);
        }
        /*
        const cF = curr.fighter;
        console.log("updated " + curr.side);
        if (curr.side != side) {
            if (curr.side == "Player") {
                player.position = cF.position;
                player.velocity = cF.velocity;
                player.isAttacking = cF.isAttacking;
                player.lastKey = cF.lastKey;
                player.health = cF.health;
                player.dead = cF.dead;
                player.frameCurrent = cF.frameCurrent;
                player.framesMax = cF.framesMax;
                player.framesHold = cF.framesHold;
                player.framesElapsed = cF.framesElapsed;
            } else {
                enemy.position = cF.position;
                enemy.velocity = cF.velocity;
                enemy.isAttacking = cF.isAttacking;
                enemy.lastKey = cF.lastKey;
                enemy.health = cF.health;
                enemy.dead = cF.dead;
                enemy.frameCurrent = cF.frameCurrent;
                enemy.framesMax = cF.framesMax;
                enemy.framesHold = cF.framesHold;
                enemy.framesElapsed = cF.framesElapsed;
            }
        }
        */
    })
    // console.log("updated version")
    // console.log(player);
    // console.log(enemy);
})


//Remove me from Firebase when I diconnect
playerRef.onDisconnect().remove();
console.log(playerRef);
console.log(playerId);

canvas.width = 1000;
canvas.height = 570;

c.fillRect(0, 0, canvas.width, canvas.height);
const gravity = 0.7;

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: 'Assets/bg.png'
});

const hole = new Sprite({
    position: {
        x: 200,
        y: 10
    },
    imageSrc: 'Assets/BlackHole.png',
    scale: 1.5,
    framesMax: 12,
    framesHold: 1000
});

const ground = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: 'Assets/Ground.png'
});

let player = new Fighter({
    position: {
        x: 0,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    }, offset: {
        x: 0,
        y: 0
    },
    imageSrc: 'Assets/HippoAnim/Idle.png',
    framesMax: 3,
    scale: 0.7,
    offset: {
        x: 60.2,
        y: 43.96
    },
    sprites: {
        idle: {
            imageSrc: 'Assets/HippoAnim/Idle.png',
            framesMax: 3
        },
        run: {
            imageSrc: 'Assets/HippoAnim/Right.png',
            framesMax: 4
        },
        jump: {
            imageSrc: 'Assets/HippoAnim/Jump.png',
            framesMax: 2
        },
        fall: {
            imageSrc: 'Assets/HippoAnim/Fall.png',
            framesMax: 2
        },
        attack1: {
            imageSrc: 'Assets/HippoAnim/Fight.png',
            framesMax: 12
        },
        takeHit: {
            imageSrc: 'Assets/HippoAnim/Hit.png',
            framesMax: 3
        },
        death: {
            imageSrc: 'Assets/HippoAnim/Idle.png',
            framesMax: 3
        }
    },
    attackBox: {
        offset: {
            x: 70,
            y: 50
        },
        width: 180,
        height: 50
    }
})



let enemy = new Fighter({
    position: {
        x: 800,
        y: 100
    },
    velocity: {
        x: 0,
        y: 0
    }, offset: {
        x: -50,
        y: 0
    },
    imageSrc: 'Assets/Octopus/Octopus_idle.png',
    framesMax: 4,
    scale: 0.5,
    offset: {
        x: 43,
        y: 5
    },
    sprites: {
        idle: {
            imageSrc: 'Assets/Octopus/Octopus_idle.png',
            framesMax: 7
        },
        run: {
            imageSrc: 'Assets/Octopus/Octopus.png',
            framesMax: 4
        },
        jump: {
            imageSrc: 'Assets/Octopus/Octopus.png',
            framesMax: 4
        },
        fall: {
            imageSrc: 'Assets/Octopus/Octopus.png',
            framesMax: 4
        },
        attack1: {
            imageSrc: 'Assets/Octopus/Octopus - attack.png',
            framesMax: 7
        },
        takeHit: {
            imageSrc: 'Assets/Octopus/Recoil.png',
            framesMax: 6
        },
        death: {
            imageSrc: 'Assets/Octopus/Octopus.png',
            framesMax: 4
        }
    },
    attackBox: {
        offset: {
            x: -170,
            y: 50
        },
        width: 170,
        height: 50
    }
})


const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    }
}
/*
updateP();

function updateP() {
    if (side == "Player") {
        playerRef.update({
            fighter: {
                position: player.position,
                velocity: player.velocity,
                isAttacking: player.isAttacking,
                lastKey: player.lastKey,
                // health: player.health,
                // dead: player.dead,
                // frameCurrent: player.frameCurrent,
                // framesMax: player.framesMax,
                // framesHold: player.framesHold,
                // framesElapsed: player.framesElapsed
            }
        })
    } else {
        playerRef.update({
            fighter: {
                position: enemy.position,
                velocity: enemy.velocity,
                isAttacking: enemy.isAttacking,
                lastKey: enemy.lastKey,
                // health: enemy.health,
                // dead: enemy.dead,
                // frameCurrent: enemy.frameCurrent,
                // framesMax: enemy.framesMax,
                // framesHold: enemy.framesHold,
                // framesElapsed: enemy.framesElapsed
            }
        })
    }
}
*/


decreaseTimer();

function animate() {
    // what function I want to loop over and over again
    window.requestAnimationFrame(animate);
    // will have to change later to match current player
    background.update();
    hole.update();
    ground.update();
    enemy.update();
    player.update();

    // player movement
    player.velocity.x = 0;
    if (keys.a.pressed && player.lastKey == 'a') {
        player.velocity.x = -5;
        player.switchSprite('run');
    } else if (keys.d.pressed && player.lastKey == 'd') {
        player.velocity.x = 5;
        player.switchSprite('run');
    } else {
        player.switchSprite('idle');
    }

    if (player.velocity.y < 0) {
        player.switchSprite('jump');
    } else if (player.velocity.y > 0) {
        player.switchSprite('fall');
    }

    // enemy movement
    enemy.velocity.x = 0;
    if (keys.ArrowLeft.pressed && enemy.lastKey == 'ArrowLeft') {
        enemy.velocity.x = -5;
        enemy.switchSprite('run');
    } else if (keys.ArrowRight.pressed && enemy.lastKey == 'ArrowRight') {
        enemy.velocity.x = 5;
        enemy.switchSprite('run');
    } else {
        enemy.switchSprite('idle');
    }

    if (enemy.velocity.y < 0) {
        enemy.switchSprite('jump');
    } else if (enemy.velocity.y > 0) {
        enemy.switchSprite('fall');
    }

    // detect for collision & enemy gets hit
    if (rectangularCollision({ rectangle1: player, rectangle2: enemy }) && player.isAttacking && player.frameCurrent === 9) {
        enemy.takeHit(3);

        document.querySelector('#enemyHealth').style.width = enemy.health + '%';
        player.isAttacking = false;
    }

    // if a player misses
    if (player.isAttacking && player.frameCurrent === 12) {
        player.isAttacking = false;
    }

    if (rectangularCollision({ rectangle1: enemy, rectangle2: player }) && enemy.isAttacking && enemy.frameCurrent === 2) {
        player.takeHit(3);

        document.querySelector('#playerHealth').style.width = player.health + '%';
        enemy.isAttacking = false;
    }

    if (enemy.isAttacking && enemy.frameCurrent === 7) {
        enemy.isAttacking = false;
    }

    // end game based on health
    if (enemy.health <= 0 || player.health <= 0) {
        determineWinner({ player, enemy, timerId });
    }
    // updateP();
}
animate()

window.addEventListener('keydown', (event) => {
    if (!player.dead && side == "Player") {

        switch (event.key) {
            case 'd':
                keys.d.pressed = true;
                player.lastKey = 'd';
                updateKey(["P", 'd'])
                break
            case 'a':
                keys.a.pressed = true;
                player.lastKey = 'a';
                updateKey(["P", 'a'])
                break
            case 'w':
                player.velocity.y = -20;
                updateKey(["P", 'w'])
                break
            case 's':
                // console.log('got hit');
                player.attack();
                updateKey(["P", 's'])
                break
        }
    }
    else if (!enemy.dead && side == "Enemy") {
        switch (event.key) {
            case 'd':
                keys.ArrowRight.pressed = true;
                enemy.lastKey = 'ArrowRight';
                updateKey(["P", 'd'])
                break
            case 'a':
                keys.ArrowLeft.pressed = true;
                enemy.lastKey = 'ArrowLeft';
                updateKey(["P", 'a'])
                break
            case 'w':
                enemy.velocity.y = -20;
                updateKey(["P", 'w'])
                break

            case 's':
                // console.log('got hit');
                enemy.attack();
                updateKey(["P", 's'])
                break
        }
    }
    // updateP();
    // animate();
})


window.addEventListener('keyup', (event) => {
    if (side == "Player") {
        switch (event.key) {
            case 'd':
                keys.d.pressed = false;
                updateKey(["U", "d"]);
                break
            case 'a':
                keys.a.pressed = false;
                updateKey(["U", "a"]);
                break
        }
    } else {

        // enemy keys
        switch (event.key) {
            case 'd':
                keys.ArrowRight.pressed = false;
                updateKey(["U", "d"]);
                break
            case 'a':
                keys.ArrowLeft.pressed = false;
                updateKey(["U", "a"]);
                break
        }
    }
    // updateP();
})

function mimicKey(code) {
    // key pressed
    if (code[0] == "P") {
        if (!player.dead && side != "Player") {
            switch (code[1]) {
                case 'd':
                    keys.d.pressed = true;
                    player.lastKey = 'd';
                    break
                case 'a':
                    keys.a.pressed = true;
                    player.lastKey = 'a';
                    break
                case 'w':
                    player.velocity.y = -20;
                    break
                case 's':
                    // console.log('got hit');
                    player.attack();
                    break
            }
        }
        else if (!enemy.dead && side != "Enemy") {
            switch (code[1]) {
                case 'd':
                    keys.ArrowRight.pressed = true;
                    enemy.lastKey = 'ArrowRight';
                    break
                case 'a':
                    keys.ArrowLeft.pressed = true;
                    enemy.lastKey = 'ArrowLeft';
                    break
                case 'w':
                    enemy.velocity.y = -20;
                    break

                case 's':
                    // console.log('got hit');
                    enemy.attack();
                    break
            }
        }
    } else {

        // key up
        if (side != "Player") {
            switch (code[1]) {
                case 'd':
                    keys.d.pressed = false;
                    break
                case 'a':
                    keys.a.pressed = false;
                    break
            }
        } else {
            switch (code[1]) {
                case 'd':
                    keys.ArrowRight.pressed = false;
                    break
                case 'a':
                    keys.ArrowLeft.pressed = false;
                    break
            }
        }
    }
}
