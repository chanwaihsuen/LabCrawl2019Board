'use strict';

import * as THREE from 'three';
import base0 from 'appRoot/images/base0.png';
import base1 from 'appRoot/images/base1.png';
import base2 from 'appRoot/images/base2.png';
import base3 from 'appRoot/images/base3.png';
import base4 from 'appRoot/images/base4.png';
import base5 from 'appRoot/images/base5.png';
import base6 from 'appRoot/images/base6.png';

import {
  TweenMax,
  Linear
} from "gsap/all";

var loader = new THREE.CubeTextureLoader();
loader.setPath('./images/');

const imageArray = [base0, base1, base2, base3, base4, base5, base6];
let imageArrayCounter = 0;

const maxWidth = 980;
const lineHeight = 100;
const cX = 60;
const cY = 140;

const testString = 'one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen twenty twenty one twenty.';
let testCounter = 0;

export default class SquareCard {

  constructor(x = 0, y = 0) {
    this.text = testString;
    this.selfSize = '';
    this.canvasArray = [];
    this.ctxArray = [];

    this.windMotion = new TimelineMax({
      repeat: -1,
      yoyo: false,
      repeatDelay: 8 * Math.random()
    });
    this.cardsTimeline = new TimelineMax({
      repeat: 0,
      delay: 1,
      repeatDelay: 1
    });

    if (Math.random() > 0.5) {
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
    ctx.font = '74pt Helvetica';
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

  putImageonCanvas(canvas, ctx) {
    // const baseImage = new Image();
    // //baseImage.src = imageArray[Math.floor(Math.random() * 5)];
    // //baseImage.src = imageArray[0];
    // baseImage.src = imageArray[0];
    // // if (imageArrayCounter < 5) {
    // //   imageArrayCounter++;
    // // } else {
    // //   imageArrayCounter = 0;
    // // }

    // baseImage.onload = function () {
    //   ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

    //   // var hRatio = canvas.width / baseImage.width;
    //   // var vRatio = canvas.height / baseImage.height;
    //   // var ratio = Math.min(hRatio, vRatio);
    //   // const centerShiftX = (canvas.width - baseImage.width * ratio) / 2;
    //   // const centerShiftY = (canvas.height - baseImage.height * ratio) / 2;
    //   // ctx.clearRect(0, 0, canvas.width, canvas.height);
    //   // ctx.drawImage(baseImage, 0, 0, baseImage.width, baseImage.height,
    //   //   centerShiftX, centerShiftY, baseImage.width * ratio, baseImage.height * ratio);
    // }
  }

  updateMyTextureWithNewInformation(theTextToUpdate) {
    if (this.selfSize == 'BIG') {
      this.putTextonCanvas(this.canvasArray[0], this.ctxArray[0], theTextToUpdate, cX, cY, maxWidth, lineHeight);
    }
  }

  createSquareRect(x = 0, y = 0, width = 30, height = 30) {
    var geometry = new THREE.BoxGeometry(width, height, 1);
    var mesh;

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
        shininess: 100,
        //wireframe: true,
        //flatShading: true,
        map: this.texture
      });
      mesh = new THREE.Mesh(geometry, materialCanvas);

    } else {
      // SMALL
      var texture = new THREE.TextureLoader().load(imageArray[imageArrayCounter]);
      if (imageArrayCounter < 5) {
        imageArrayCounter++;
      } else {
        imageArrayCounter = 0;
      }

      const materialFlat = new THREE.MeshBasicMaterial({
        map: texture
      });

      // let materialFlat = new THREE.MeshBasicMaterial( { color: 0xffffff, envMap: textureCube } );
      mesh = new THREE.Mesh(geometry, materialFlat);
      mesh.material.needsUpdate = true;
      //this.putImageonCanvas(canvas, ctx);
    }

    mesh.position.set(x, y, 0);

    // ==============================

    // var center = new THREE.Vector3();
    // mesh.geometry.computeBoundingBox();
    // mesh.geometry.boundingBox.getCenter(center);
    // mesh.geometry.center();
    // mesh.position.copy(center);

    const windMoveTiming = 1;

    this.windMotion.add(TweenMax.to(mesh.rotation, windMoveTiming, {
      y: THREE.Math.degToRad(-8),
      x: THREE.Math.degToRad(-8),
      ease: Linear.easeNone
    }));
    this.windMotion.add(TweenMax.to(mesh.rotation, windMoveTiming, {
      y: THREE.Math.degToRad(0),
      x: THREE.Math.degToRad(0),
      ease: Linear.easeNone
    }));
    this.windMotion.add(TweenMax.to(mesh.rotation, windMoveTiming, {
      y: THREE.Math.degToRad(8),
      x: THREE.Math.degToRad(8),
      ease: Linear.easeNone
    }));
    this.windMotion.add(TweenMax.to(mesh.rotation, windMoveTiming, {
      y: THREE.Math.degToRad(0),
      x: THREE.Math.degToRad(0),
      ease: Linear.easeNone
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

