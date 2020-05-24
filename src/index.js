import Phaser from 'phaser';
import img_blood from './assets/blood.png';
import './style.scss';

import SpawnController from './controllers/spawn-controller';
import LevelController from './controllers/level-controller';

const config = {
  type: Phaser.AUTO,
  parent: "game-container",
  width: 900,
  height: 500,
  physics: {
      default: 'arcade',
      arcade: {
          gravity: { y: 800 },
          debug: false
      }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

const game = new Phaser.Game(config);

let enemies;
let platforms;
let emitter;
let sceneContext;

function setSceneContext(context){
  sceneContext = context;
  LevelController.setContext(context);
  SpawnController.setContext(context);
}

function preload() {
  setSceneContext(this);
  
  this.load.image('blood', img_blood);
  LevelController.preload();
  SpawnController.preload();
}

function onObjectClicked(pointer, gameObject){
  emitter.setPosition(pointer.worldX, pointer.worldY);
  emitter.explode(20);
  emitter.visible = true;
}

function create() {
  //- make the level
  platforms = LevelController.create();
  
  //- make the enemies
  let spawnGroups = SpawnController.create(this, enemies);

  this.physics.add.collider(spawnGroups.enemies, platforms);

  this.input.on('gameobjectdown', onObjectClicked);

  setupMouseEmitter();
}

function setupMouseEmitter(){
  let particles = sceneContext.add.particles('blood');

  emitter = particles.createEmitter({
    visible: false,
    blendMode: 'SCREEN',
    speed: { min: -400, max: 400 },
    angle: { min: 0, max: 360 },
    scale: { start: 1, end: 0 },
    lifespan: 500,
    gravityY: 1000
  });
}

function update (){
  SpawnController.update();
}