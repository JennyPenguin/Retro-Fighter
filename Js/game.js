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
    imageSrc: './Assets/pixilBg.png'
});

const shop = new Sprite({
    position: {
        x: 590,
        y: 260
    },
    imageSrc: './Assets/shop.png',
    scale: 2.3,
    framesMax: 6
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
    imageSrc: './Assets/samuraiMack/samuraiMack/Idle.png',
    framesMax: 8,
    scale: 2.5,
    offset: {
        x: 215,
        y: 157
    },
    sprites: {
        idle: {
            imageSrc: './Assets/samuraiMack/samuraiMack/Idle.png',
            framesMax: 8
        },
        run: {
            imageSrc: './Assets/samuraiMack/samuraiMack/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './Assets/samuraiMack/samuraiMack/Jump.png',
            framesMax: 2
        },
        fall: {
            imageSrc: './Assets/samuraiMack/samuraiMack/Fall.png',
            framesMax: 2
        },
        attack1: {
            imageSrc: './Assets/samuraiMack/samuraiMack/Attack1.png',
            framesMax: 6
        }
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
    imageSrc: './Assets/kenjiEnemy/Idle.png',
    framesMax: 4,
    scale: 2.5,
    offset: {
        x: 215,
        y: 170
    },
    sprites: {
        idle: {
            imageSrc: './Assets/kenjiEnemy/Idle.png',
            framesMax: 4
        },
        run: {
            imageSrc: './Assets/kenjiEnemy/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './Assets/kenjiEnemy/Jump.png',
            framesMax: 2
        },
        fall: {
            imageSrc: './Assets/kenjiEnemy/Fall.png',
            framesMax: 2
        },
        attack1: {
            imageSrc: './Assets/kenjiEnemy/Attack1.png',
            framesMax: 4
        }
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

    background.update();
    shop.update();
    player.update();
    enemy.update();

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

    // detect for collision
    if (rectangularCollision({ rectangle1: player, rectangle2: enemy }) && player.isAttacking) {
        enemy.health -= 5;
        document.querySelector('#enemyHealth').style.width = enemy.health + '%';
        player.isAttacking = false;
    }
    if (rectangularCollision({ rectangle1: enemy, rectangle2: player }) && enemy.isAttacking) {
        player.health -= 5;
        document.querySelector('#playerHealth').style.width = player.health + '%';
        enemy.isAttacking = false;
    }

    // end game based on health
    if (enemy.health <= 0 || player.health <= 0) {
        determineWinner({ player, enemy, timerId });
    }
}
animate()

window.addEventListener('keydown', (event) => {
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
        case 's':
            player.attack();
            break
        case 'ArrowDown':
            enemy.attack();
            break
    }
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