'use strict';

import * as THREE from 'three';
import { CSS3DRenderer } from 'three-css3drenderer'
import Config from 'appRoot/data/config';

import {
  TweenMax,
  // TimelineMax,
  Linear
} from 'gsap/all';

import Renderer from 'appRoot/js/components/renderer';
import Camera from 'appRoot/js/components/camera';
import Light from 'appRoot/js/components/light';
import Controls from 'appRoot/js/components/controls';
import Keyboard from 'appRoot/js/utils/keyboard';

import Interaction from 'appRoot/js/managers/interaction';
import DatGUI from 'appRoot/js/managers/datGUI';

import RoundedCard from 'appRoot/js/models/roundedCard';
import SquareCard from 'appRoot/js/models/squareCard';
import HtmlElement from 'appRoot/js/models/htmlElement';

export default class Main {

  constructor(container) {
    this.roundedCardArray = [];

    // Set container property to container element
    this.container = container;

    // Main scene creation
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);

    //
    // this.sceneForHTML = new THREE.Scene();
    // this.rendererForHTML = new CSS3DRenderer();
    // let htmlElement = new HtmlElement(this.sceneForHTML, this.rendererForHTML);

    // this.rendererForHTML.setSize(window.innerWidth, window.innerHeight);
    // this.rendererForHTML.domElement.style.position = 'absolute';
    // this.rendererForHTML.domElement.style.top = 0;
    // document.body.appendChild(this.rendererForHTML.domElement);

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
    //new Interaction(this.renderer.threeRenderer, this.scene, this.camera.threeCamera, this.controls.threeControls);

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

    const startX = 0;
    const startY = -128;
    const padding = 2;

    let posX = startX;
    let posY = startY;

    for (let noY = 0; noY < 8; noY++) {
      if (noY === 4) {
        posY = startY;
      }
      for (let noX = 0; noX < 5; noX++) {
        var roundedCard = new SquareCard(posX, posY);
        this.roundedCardArray.push(roundedCard);
        if (noY < 4) {
          groupA.add(roundedCard.mesh);
        } else {
          groupB.add(roundedCard.mesh);
        }

        posX += (cardSize + padding)
      }

      posX = startX;
      posY += -(cardSize + padding);
    }

    this.scene.add(groupA);
    this.scene.add(groupB);

    const timingOfMovingUp = 80;

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
    // this.controls.threeControls.update();
    this.renderer.render(this.scene, this.camera.threeCamera);
    // this.rendererForHTML.render(this.sceneForHTML, this.camera.threeCamera);

    // Call any vendor or module frame updates here
    // TWEEN.update();

    for (let i = 0; i < this.roundedCardArray.length; i++) {
      this.roundedCardArray[i].texturereturn().needsUpdate = true;
    }
    
    
    requestAnimationFrame(this.render.bind(this));
  }
}

