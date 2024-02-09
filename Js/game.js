const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1000;
canvas.height = 570;

c.fillRect(0, 0, canvas.width, canvas.height);
const gravity = 0.7;

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './Assets/Bg.png'
});

const hole = new Sprite({
    position: {
        x: 200,
        y: 10
    },
    imageSrc: './Assets/BlackHole.png',
    scale: 1.5,
    framesMax: 12,
    framesHold: 1000
});

const ground = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './Assets/Ground.png'
});

const player = new Fighter({
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
    imageSrc: './Assets/HippoAnim/Idle.png',
    framesMax: 3,
    scale: 0.7,
    offset: {
        x: 60.2,
        y: 43.96
    },
    sprites: {
        idle: {
            imageSrc: './Assets/HippoAnim/Idle.png',
            framesMax: 3
        },
        run: {
            imageSrc: './Assets/HippoAnim/Right.png',
            framesMax: 4
        },
        jump: {
            imageSrc: './Assets/HippoAnim/Jump.png',
            framesMax: 2
        },
        fall: {
            imageSrc: './Assets/HippoAnim/Fall.png',
            framesMax: 2
        },
        attack1: {
            imageSrc: './Assets/HippoAnim/Fight.png',
            framesMax: 12
        },
        takeHit: {
            imageSrc: './Assets/HippoAnim/Idle.png',
            framesMax: 3
        },
        death: {
            imageSrc: './Assets/HippoAnim/Idle.png',
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

const enemy = new Fighter({
    position: {
        x: 400,
        y: 100
    },
    velocity: {
        x: 0,
        y: 0
    }, offset: {
        x: -50,
        y: 0
    },
    imageSrc: './Assets/kenjiEnemy/Octopus.png',
    framesMax: 4,
    scale: 0.5,
    offset: {
        x: 43,
        y: 5
    },
    sprites: {
        idle: {
            imageSrc: './Assets/kenjiEnemy/Octopus_idle.png',
            framesMax: 7
        },
        run: {
            imageSrc: './Assets/kenjiEnemy/Octopus.png',
            framesMax: 4
        },
        jump: {
            imageSrc: './Assets/kenjiEnemy/Octopus.png',
            framesMax: 4
        },
        fall: {
            imageSrc: './Assets/kenjiEnemy/Octopus.png',
            framesMax: 4
        },
        attack1: {
            imageSrc: './Assets/kenjiEnemy/Octopus.png',
            framesMax: 4
        },
        takeHit: {
            imageSrc: './Assets/kenjiEnemy/Octopus.png',
            framesMax: 4
        },
        death: {
            imageSrc: './Assets/kenjiEnemy/Octopus.png',
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
        enemy.takeHit(10);

        document.querySelector('#enemyHealth').style.width = enemy.health + '%';
        player.isAttacking = false;
    }

    // if a player misses
    if (player.isAttacking && player.frameCurrent === 4) {
        player.isAttacking = false;
    }

    if (rectangularCollision({ rectangle1: enemy, rectangle2: player }) && enemy.isAttacking && enemy.frameCurrent === 2) {
        player.takeHit(5);

        document.querySelector('#playerHealth').style.width = player.health + '%';
        enemy.isAttacking = false;
    }

    if (enemy.isAttacking && enemy.frameCurrent === 2) {
        enemy.isAttacking = false;
    }

    // end game based on health
    if (enemy.health <= 0 || player.health <= 0) {
        determineWinner({ player, enemy, timerId });
    }
}
animate()

window.addEventListener('keydown', (event) => {
    if (!player.dead) {

        switch (event.key) {
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
    if (!enemy.dead) {
        switch (event.key) {
            case 'ArrowRight':
                keys.ArrowRight.pressed = true;
                enemy.lastKey = 'ArrowRight';
                break
            case 'ArrowLeft':
                keys.ArrowLeft.pressed = true;
                enemy.lastKey = 'ArrowLeft';
                break
            case 'ArrowUp':
                enemy.velocity.y = -20;
                break

            case 'ArrowDown':
                // console.log('got hit');
                enemy.attack();
                break
        }
    }

    // animate();
})


window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = false;
            break
        case 'a':
            keys.a.pressed = false;
            break
    }

    // enemy keys
    switch (event.key) {
        case 'ArrowRight':
            keys.ArrowRight.pressed = false;
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false;
            break
    }
})