'use strict';

import * as THREE from 'three';
import 'gsap';

import base0 from 'appRoot/images/base0.png';
import base1 from 'appRoot/images/base1.png';
import base2 from 'appRoot/images/base2.png';
import base3 from 'appRoot/images/base3.png';
import base4 from 'appRoot/images/base4.png';
import base5 from 'appRoot/images/base5.png';
import base6 from 'appRoot/images/base6.png';
import base7 from 'appRoot/images/base7.png';
import base8 from 'appRoot/images/base8.png';
import base9 from 'appRoot/images/base9.png';
import base10 from 'appRoot/images/base10.png';
import base11 from 'appRoot/images/base11.png';
import base12 from 'appRoot/images/base12.png';
import base13 from 'appRoot/images/base13.png';
import base14 from 'appRoot/images/base14.png';
import base15 from 'appRoot/images/base15.png';
import base16 from 'appRoot/images/base16.png';
import base17 from 'appRoot/images/base17.png';
import base18 from 'appRoot/images/base18.png';
import base19 from 'appRoot/images/base19.png';
import base20 from 'appRoot/images/base20.png';
import base21 from 'appRoot/images/base21.png';
import base22 from 'appRoot/images/base22.png';
import base23 from 'appRoot/images/base23.png';
import base24 from 'appRoot/images/base24.png';
import base25 from 'appRoot/images/base25.png';
import base26 from 'appRoot/images/base26.png';
import base27 from 'appRoot/images/base27.png';
import base28 from 'appRoot/images/base28.png';
import base29 from 'appRoot/images/base29.png';
import base30 from 'appRoot/images/base30.png';

var loader = new THREE.CubeTextureLoader();
loader.setPath('./images/');

const imageArray = [
  base0, base1, base2, base3, base4, base5, base6, base7, base8, base9, base10, base11, base12, base13, base14, base15,
  base16, base17, base18, base19, base20, base21, base22, base23, base24, base25, base26, base27, base28, base29, base30];
let imageArrayCounter = 0;


const maxWidth = 980;
const lineHeight = 146;
const cX = 60;
const cY = 140;

const testString = 'one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen.';
let testCounter = 0;

export default class SquareCard {

  constructor(x = 0, y = 0, size = 'SMALL') {
    this.text = testString;
    this.selfSize = '';
    this.canvasArray = [];
    this.ctxArray = [];

    this.windMotion = new TimelineMax({
      repeat: -1,
      yoyo: false,
      repeatDelay: 8 * Math.random() + 3,
      onRepeat: function () {
        // console.log('callback');
      }
    });
    this.cardsTimeline = new TimelineMax({
      repeat: 0,
      delay: 1,
      repeatDelay: 1
    });

    // if (Math.random() > 0.5) {
    //   this.mesh = this.createSquareRect(x, y);
    //   this.selfSize = 'BIG';
    // } else {
    //   this.mesh = this.createSmallerRect(x, y);
    //   this.selfSize = 'SMALL';
    // }

    if (size === 'BIG') {
      this.mesh = this.createSquareRect(x, y);
      this.selfSize = 'BIG';
    } else {
      this.mesh = this.createSmallerRect(x, y);
      this.selfSize = 'SMALL';
    }
  }

  createSmallerRect(x = 0, y = 0) {
    var meshGroup = new THREE.Group();

    const smallRectA = this.createSquareRect(x - 8, y + 8, 14, 14);
    const smallRectB = this.createSquareRect(x + 8, y + 8, 14, 14);
    const smallRectC = this.createSquareRect(x - 8, y - 8, 14, 14);
    const smallRectD = this.createSquareRect(x + 8, y - 8, 14, 14);

    meshGroup.add(smallRectA);
    meshGroup.add(smallRectB);
    meshGroup.add(smallRectC);
    meshGroup.add(smallRectD);

    return meshGroup;
  }

  putTextonCanvas(canvas, ctx, text, x, y, maxWidth, lineHeight) {
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = '96pt Helvetica';
    ctx.fillStyle = '#FFFFFF';

    let words = text.split(' ');
    let line = '';

    for (var n = 0; n < words.length; n++) {
      var testLine = line + words[n] + ' ';
      var metrics = ctx.measureText(testLine);
      var testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, x, y);
        line = words[n] + ' ';
        y += lineHeight;
      }
      else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, y);
  }

  updateMyTextureWithNewInformation(theTextToUpdate) {
    if (this.selfSize == 'BIG') {
      this.putTextonCanvas(this.canvasArray[0], this.ctxArray[0], theTextToUpdate, cX, cY, maxWidth, lineHeight);
    }
  }

  createSquareRect(x = 0, y = 0, width = 30, height = 30) {
    let geometry = new THREE.BoxGeometry(width, height, 1);
    let mesh;
    let materialsArray = [];
    let sidesMat = new THREE.MeshBasicMaterial({
      // shininess: 1000,
      color: 0x333333
    });

    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');

    canvas.width = 1024;
    canvas.height = 1024;

    this.canvasArray.push(canvas);
    this.ctxArray.push(ctx);

    if (width > 20) {
      // BIG
      this.texture = new THREE.CanvasTexture(canvas);
      this.texture.encoding = THREE.sRGBEncoding;
      this.putTextonCanvas(canvas, ctx, this.text, cX, cY, maxWidth, lineHeight);

      var materialCanvas = new THREE.MeshPhongMaterial({
        shininess: 1000,
        //wireframe: true,
        //flatShading: true,
        map: this.texture
      });
      materialsArray = [
        sidesMat,        // Left side
        sidesMat,       // Right side
        sidesMat,         // Top side
        sidesMat,      // Bottom side
        materialCanvas,       // Front side
        sidesMat         // Back side
      ];
      mesh = new THREE.Mesh(geometry, materialsArray);

    } else {
      // SMALL
      var imageTexture = new THREE.TextureLoader().load(imageArray[imageArrayCounter]);
      if (imageArrayCounter > imageArray.length - 1) {
        imageArrayCounter = 0;
      } else {
        imageArrayCounter++;
      }

      
      const materialFlat = new THREE.MeshBasicMaterial({
        // shininess: 1000,
        map: imageTexture
      });
      // const materialFlat = new THREE.MeshBasicMaterial({
      //   map: imageTexture
      // });

      materialsArray = [
        sidesMat,        // Left side
        sidesMat,       // Right side
        sidesMat,         // Top side
        sidesMat,      // Bottom side
        materialFlat,       // Front side
        sidesMat         // Back side
      ];

      mesh = new THREE.Mesh(geometry, materialsArray);
      mesh.material.needsUpdate = true;
    }

    mesh.position.set(x, y, 0);
    // ==============================

    // var center = new THREE.Vector3();
    // mesh.geometry.computeBoundingBox();
    // mesh.geometry.boundingBox.getCenter(center);
    // mesh.geometry.center();
    // mesh.position.copy(center);

    // const windMoveTiming = 1;

    // this.windMotion.add(TweenMax.to(mesh.rotation, windMoveTiming, {
    //   y: THREE.Math.degToRad(-8),
    //   x: THREE.Math.degToRad(-8),
    //   ease: Linear.easeNone
    // }));
    // this.windMotion.add(TweenMax.to(mesh.rotation, windMoveTiming, {
    //   y: THREE.Math.degToRad(0),
    //   x: THREE.Math.degToRad(0),
    //   ease: Linear.easeNone
    // }));
    // this.windMotion.add(TweenMax.to(mesh.rotation, windMoveTiming, {
    //   y: THREE.Math.degToRad(8),
    //   x: THREE.Math.degToRad(8),
    //   ease: Linear.easeNone
    // }));
    // this.windMotion.add(TweenMax.to(mesh.rotation, windMoveTiming, {
    //   y: THREE.Math.degToRad(0),
    //   x: THREE.Math.degToRad(0),
    //   ease: Linear.easeNone
    // }));

    this.windMotion.add(TweenMax.to(mesh.rotation, 3, {
      x: THREE.Math.degToRad(360),
      ease: Linear.easeNone,
    }));

    // =======
    this.cardsTimeline.addLabel('flipout', 3);
    this.cardsTimeline.add(TweenMax.to(mesh.rotation, 1 * Math.random() + 0.3, {
      x: THREE.Math.degToRad(180),
      y: THREE.Math.degToRad(180),
      ease: Linear.easeNone
    }));
    // this.cardsTimeline.add(TweenMax.to(mesh.rotation, 1 * Math.random() + 0.8, {
    //   x: THREE.Math.degToRad(180),
    //   y: THREE.Math.degToRad(180),
    //   ease: Linear.easeNone
    // }));
    this.cardsTimeline.stop();

    return mesh;
  }

  stopWindMotionAndFlipOut() {
    this.windMotion.stop();
    this.cardsTimeline.play();
  }

  returnToWind() {
    this.mesh.rotation.x = 0;
    this.mesh.rotation.y = 0;
    this.mesh.rotation.z = 0;

    this.cardsTimeline.stop();
    this.windMotion.play();
  }

  texturereturn() {
    return this.texture;
  }
}

