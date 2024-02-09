class Fighter extends Sprite {
    // order not fixed and elements not required
    constructor({
        position,
        velocity,
        color = 'red',
        imageSrc,
        scale = 1,
        framesMax = 1,
        offset = { x: 0, y: 0 },
        sprites,
        attackBox = { offset: {}, width: undefined, height: undefined }
    }) {
        super({ position, imageSrc, scale, framesMax, offset });
        this.velocity = velocity
        this.width = 50
        this.height = 150
        this.lastKey
        this.isAttacking
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset: attackBox.offset,
            width: attackBox.width,
            height: attackBox.height,
        }
        this.color = color;
        this.health = 100;
        this.frameCurrent = 0;
        this.framesElapsed = 0;
        this.framesHold = 5;
        this.sprites = sprites;
        this.dead = false;

        for (const sprite in this.sprites) {
            sprites[sprite].image = new Image();
            sprites[sprite].image.src = sprites[sprite].imageSrc;
        }
    }

    update() {
        if (!this.dead) {
            super.update();
        }

        this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
        this.attackBox.position.y = this.position.y + this.attackBox.offset.y;

        // c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height);

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        // gravity function
        if (this.position.y + this.height + this.velocity.y > canvas.height - 2) {
            this.velocity.y = 0;
            this.position.y = canvas.height - 2 - this.height + 1;
        } else {
            this.velocity.y += gravity;
        }
    }

    attack() {
        // console.log('got hit');
        this.switchSprite('attack1');
        this.isAttacking = true;
        // setTimeout(() => {
        //     this.isAttacking = false;
        // }, 1000)
    }

    takeHit(hit) {
        console.log('got hit');
        this.health -= hit;

        if (this.health <= 0) {
            this.switchSprite("death");
        }
        else {
            this.switchSprite('takeHit');
        }
    }

    switchSprite(sprite) {
        if (this.image === this.sprites.death.image) {
            if (this.frameCurrent === this.sprites.death.framesMax - 1) this.dead = true;
            return}
        // if attacking and not finished playing, don't let other animations play
        if (this.image === this.sprites.attack1.image &&
            this.frameCurrent < this.sprites.attack1.framesMax - 1) return

        // override when fighter gets hit

        if(this.image == this.sprites.takeHit.image && this.frameCurrent < this.sprites.takeHit.framesMax - 1) return

        switch (sprite) {
            case 'idle':
                if (this.image !== this.sprites.idle.image) {
                    this.frameCurrent = 0;
                    this.image = this.sprites.idle.image;
                    this.framesMax = this.sprites.idle.framesMax;
                }
                break;
            case 'run':
                if (this.image !== this.sprites.run.image) {
                    this.frameCurrent = 0;
                    this.image = this.sprites.run.image;
                    this.framesMax = this.sprites.run.framesMax;
                }
                break;
            case 'jump':
                if (this.image !== this.sprites.jump.image) {
                    this.frameCurrent = 0;
                    this.image = this.sprites.jump.image;
                    this.framesMax = this.sprites.jump.framesMax;
                }
                break;
            case 'fall':
                if (this.image !== this.sprites.fall.image) {
                    this.frameCurrent = 0;
                    this.image = this.sprites.fall.image;
                    this.framesMax = this.sprites.fall.framesMax;
                }
                break;
            case 'attack1':
                if (this.image !== this.sprites.attack1.image) {
                    this.frameCurrent = 0;
                    this.image = this.sprites.attack1.image;
                    this.framesMax = this.sprites.attack1.framesMax;
                }
                break;
            case 'takeHit':
                if (this.image !== this.sprites.takeHit.image) {
                    this.frameCurrent = 0;
                    this.image = this.sprites.takeHit.image;
                    this.framesMax = this.sprites.takeHit.framesMax;
                }
                break;
            case 'death':
                if (this.image !== this.sprites.death.image) {
                    this.frameCurrent = 0;
                    this.image = this.sprites.death.image;
                    this.framesMax = this.sprites.death.framesMax;
                }
                break;
        }
    }


    // draw() {
    //     c.fillStyle = this.color;
    //     c.fillRect(this.position.x, this.position.y, this.width, this.height);

    //     // attack box
    //     if (this.isAttacking) {
    //         c.fillStyle = 'green';
    //         c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height);
    //     }
    // }
}