'use strict';

import * as THREE from 'three';
import { CSS3DRenderer } from 'three-css3drenderer'
import Config from 'appRoot/data/config';
import { TweenMax, TimelineMax, Linear } from 'gsap/all';

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
import CubeCard from 'appRoot/js/models/CubeCard';

import GetSocialText from 'appRoot/js/views/GetSocialText.js'


export default class Main {

  constructor(container) {
    this.allCardsArray = [];

    // Set container property to container element
    this.container = container;

    // Main scene creation
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);
    this.getSocialText = new GetSocialText();
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

    this.controls = new Controls(this.camera.threeCamera, container);
    new Interaction(this.renderer.threeRenderer, this.scene, this.camera.threeCamera, this.controls.threeControls);

    new DatGUI(this, this.allCardsArray[0]);
    new Keyboard();

    // CREATE DECK
    this.createDeck();

    // Start render which does not wait for model fully loaded
    this.render();
  }

  createDeck() {
    let _this = this;
    const cardSize = 30;
    const padding = 2;

    var groupA = new THREE.Group();
    var groupB = new THREE.Group();

    var groupAArray = [];
    var groupBArray = [];

    const startX = 300;
    const startY = -128;


    let posX = startX;
    let posY = startY;

    const sizingArray = [
      'BIG', 'SMALL', 'BIG', 'SMALL', 'BIG',
      'SMALL', 'BIG', 'SMALL', 'BIG', 'SMALL',
      'BIG', 'SMALL', 'BIG', 'SMALL', 'BIG',
      'SMALL', 'SMALL', 'BIG', 'SMALL', 'BIG',
      'BIG', 'SMALL', 'BIG', 'BIG', 'SMALL',
      'SMALL', 'SMALL', 'BIG', 'SMALL', 'BIG',
      'BIG', 'SMALL', 'BIG', 'SMALL', 'BIG',
      'SMALL', 'BIG', 'SMALL', 'BIG', 'SMALL',
    ];
    let sizingArrayCounter = 0;
    const noOfVerticalTiles = 8;
    const noOfHorizontalTiles = 5

    for (let noY = 0; noY < noOfVerticalTiles; noY++) {
      if (noY === (noOfVerticalTiles / 2)) {
        posY = startY;
      }
      for (let noX = 0; noX < noOfHorizontalTiles; noX++) {
        var singleCard = new SquareCard(posX, posY, sizingArray[sizingArrayCounter]);
        this.allCardsArray.push(singleCard);

        if (noY < 4) {
          groupA.add(singleCard.mesh);
          groupAArray.push(singleCard);
        } else {
          groupB.add(singleCard.mesh);
          groupBArray.push(singleCard);
        }

        posX += (cardSize + padding)
        sizingArrayCounter++;
      }

      posX = startX;
      posY += -(cardSize + padding);
    }

    this.scene.add(groupA);
    this.scene.add(groupB);
    this.getSocialText.allCardsArray = this.allCardsArray;

    const timingOfMovingUp = 20; //80;
    const amtToMove = (noOfVerticalTiles * cardSize) + (noOfVerticalTiles * padding)

    TweenMax.to(groupA.position, timingOfMovingUp, {
      y: amtToMove,
      repeat: -1,
      ease: Linear.easeNone,
      onRepeat: function () {
        console.log('GROUP A');
        _this.getSocialText.changeText(groupAArray);
      }
    });
    TweenMax.to(groupB.position, timingOfMovingUp, {
      y: amtToMove,
      delay: timingOfMovingUp / 2,
      repeat: -1,
      ease: Linear.easeNone,
      onRepeat: function () {
        console.log('GROUP B');
        _this.getSocialText.changeText(groupBArray);
      }
    });

    document.addEventListener('keydown', (event) => {
      const keyCode = event.code;
      // console.log('keyCode', keyCode);
      if (keyCode === 'KeyS') {
        for (let i = 0; i < this.allCardsArray.length; i++) {
          this.allCardsArray[i].stopWindMotionAndFlipOut();
        }
      }
      if (keyCode === 'KeyX') {
        for (let i = 0; i < this.allCardsArray.length; i++) {
          this.allCardsArray[i].returnToWind();
        }
      }
      if (keyCode === 'KeyF') {
        this.openFullscreen();
      }
    }, false)
  }

  /* View in fullscreen */
  openFullscreen() {
    /* Get the documentElement (<html>) to display the page in fullscreen */
    var elem = document.documentElement;

    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) { /* Firefox */
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE/Edge */
      elem.msRequestFullscreen();
    }
  }

  /* Close fullscreen */
  closeFullscreen() {
    /* Get the documentElement (<html>) to display the page in fullscreen */
    var elem = document.documentElement;

    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) { /* Firefox */
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { /* IE/Edge */
      document.msExitFullscreen();
    }
  }

  render() {
    this.controls.threeControls.update();
    this.renderer.render(this.scene, this.camera.threeCamera);
    // this.rendererForHTML.render(this.sceneForHTML, this.camera.threeCamera);

    // Call any vendor or module frame updates here
    // TWEEN.update();

    for (let i = 0; i < this.allCardsArray.length; i++) {
      if (this.allCardsArray[i].selfSize === 'BIG') {
        this.allCardsArray[i].texturereturn().needsUpdate = true;
      }
    }

    requestAnimationFrame(this.render.bind(this));
  }
}

