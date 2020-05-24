import Phaser from "phaser";

const KILL_TIMEOUT = 5000;

export class Raccoon extends Phaser.Physics.Arcade.Sprite {
  constructor (scene, x, y, physicsGroup) {
    super(scene, x, y, 'raccoon');

    //- custom properties
    this.isAlive = true;

    //- parent stuff
    scene.add.existing(this);
    if(physicsGroup){
      physicsGroup.add(this);
    }else{
      scene.physics.add.existing(this);
    }
    
    //- physics
    this.setBounce(.4);
    this.setCollideWorldBounds(true);
    this.allowGravity = false;

    //- squeeze in hit box from edge of sprite
    this.body.setSize(60,70);
    this.body.offset.x = 35;
    this.body.offset.y = 30;
    this.anims.play('raccoon_walk');

    //- interaction listeners
    this.setInteractive();
    this.on('pointerdown', (thing) => {
      this.kill();
    });
  }

  kill(){
    this.anims.play('raccoon_dead');
    this.body.setDrag(500);
    this.isAlive = false;

    global.setTimeout(() => {
      this.destroy();
    }, KILL_TIMEOUT)
  }

  update(){
    //- turn if facing left
    if(this.flipX){
      if(this.body.velocity.x > 0) this.flipX = false;
    }else{
      if(this.body.velocity.x < 0) this.flipX = true;
    }

    this.checkForJump(.05);
  }

   checkForJump(chance){
    if(this.isAlive && this.body.touching.down && Math.random() < chance){
      this.setVelocityX((1 + Math.random()) * this.body.velocity.x);
      this.setVelocityY(Math.random() * - 300);
    }
  }
}