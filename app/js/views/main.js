'use strict';

import * as THREE from 'three';
import Config from 'appRoot/data/config';

import {
  TweenMax,
  // TimelineMax,
  Linear
} from "gsap/all";

import Renderer from 'appRoot/js/components/renderer';
import Camera from 'appRoot/js/components/camera';
import Light from 'appRoot/js/components/light';
import Controls from 'appRoot/js/components/controls';
import Keyboard from 'appRoot/js/utils/keyboard';

import Interaction from 'appRoot/js/managers/interaction';
import DatGUI from 'appRoot/js/managers/datGUI';

import RoundedCard from 'appRoot/js/models/roundedCard';


export default class Main {

  constructor(container) {
    this.roundedCardArray = [];

    // Set container property to container element
    this.container = container;

    // Main scene creation
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);

    // Get Device Pixel Ratio first for retina
    if (window.devicePixelRatio) {
      Config.dpr = window.devicePixelRatio;
    }

    // Main renderer constructor
    this.renderer = new Renderer(this.scene, container);

    // Components instantiations
    this.camera = new Camera(this.renderer.threeRenderer);
    this.light = new Light(this.scene);

    // Create and place lights in scene
    const lights = ['ambient', 'directional', 'point', 'hemi'];
    lights.forEach((light) => this.light.place(light));

    // this.controls = new Controls(this.camera.threeCamera, container);
    // new Interaction(this.renderer.threeRenderer, this.scene, this.camera.threeCamera, this.controls.threeControls);
    new DatGUI(this, this.roundedCardArray[0]);
    new Keyboard();

    // CREATE DECK
    this.createDeck();

    // Start render which does not wait for model fully loaded
    this.render();
  }

  createDeck() {
    const cardSize = 30;

    var groupA = new THREE.Group();
    var groupB = new THREE.Group();
    let posY = -128;
    let posX = -15;

    for (let noY = 0; noY < 8; noY++) {
      if (noY === 4) {
        posY = -128;
      }
      for (let noX = 0; noX < 4; noX++) {

        var roundedCard = new RoundedCard(posX, posY);
        this.roundedCardArray.push(roundedCard);

        if (noY < 4) {
          groupA.add(roundedCard.mesh);
        } else {
          groupB.add(roundedCard.mesh);
        }

        posX += (cardSize + 2)
      }

      posX = -15;
      posY += -(cardSize + 2);
    }

    this.scene.add(groupA);
    this.scene.add(groupB);

    const timingOfMovingUp = 20;

    TweenMax.to(groupA.position, timingOfMovingUp, {
      y: 256,
      repeat: -1,
      ease: Linear.easeNone
    });
    TweenMax.to(groupB.position, timingOfMovingUp, {
      y: 256,
      delay: timingOfMovingUp / 2,
      repeat: -1,
      ease: Linear.easeNone
    });



    document.addEventListener('keydown', (event) => {
      const keyCode = event.code;
      // console.log('keyCode', keyCode);
      if (keyCode === 'KeyS') {
        for (let i = 0; i < this.roundedCardArray.length; i++) {
          this.roundedCardArray[i].stopWindMotionAndFlipOut();
        }
      }
      if (keyCode === 'KeyX') {
        for (let i = 0; i < this.roundedCardArray.length; i++) {
          this.roundedCardArray[i].returnToWind();
        }
      }
    }, false)
  }

  render() {
    // Call render function and pass in created scene and camera
    this.renderer.render(this.scene, this.camera.threeCamera);

    // texture.needsUpdate = true;
    // Call any vendor or module frame updates here
    // TWEEN.update();

    for (let i = 0; i < this.roundedCardArray.length; i++) {
      this.roundedCardArray[i].texturereturn().needsUpdate = true;
    }


    requestAnimationFrame(this.render.bind(this)); // Bind the main class instead of window object
  }
}

