import * as THREE from 'three';
import base0 from 'appRoot/images/base.png';
import base1 from 'appRoot/images/base5.png';
import base2 from 'appRoot/images/base6.png';
import base3 from 'appRoot/images/base7.png';
import base4 from 'appRoot/images/base8.png';
import base5 from 'appRoot/images/base9.png';

import {
  TweenMax,
  TimelineMax,
  Linear
} from "gsap/all";

const imageArray = [base0, base1, base2, base3, base4, base5];

export default class RoundedCard {

  constructor(x = 0, y = 0) {

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


    this.mesh = this.createRoundedRect(x, y);
    if (Math.random() > 0.5) {
      this.mesh = this.createRoundedRect(x, y);
    } else {
      this.mesh = this.createSmallerRect(x, y);
    }

  }

  createSmallerRect(x = 0, y = 0) {
    var meshGroup = new THREE.Group();

    const smallRectA = this.createRoundedRect(x, y, 14, 14, 2);
    const smallRectB = this.createRoundedRect(x, y + 16, 14, 14, 2);
    const smallRectC = this.createRoundedRect(x + 16, y, 14, 14, 2);
    const smallRectD = this.createRoundedRect(x + 16, y + 16, 14, 14, 2);

    meshGroup.add(smallRectA);
    meshGroup.add(smallRectB);
    meshGroup.add(smallRectC);
    meshGroup.add(smallRectD);
    return meshGroup;
  }

  createRoundedRect(x = 0, y = 0, width = 30, height = 30, radius = 2) {
    var roundedRectShape = new THREE.Shape();

    roundedRectShape.moveTo(x, y + radius);
    roundedRectShape.lineTo(x, y + height - radius);
    roundedRectShape.quadraticCurveTo(x, y + height, x + radius, y + height);
    roundedRectShape.lineTo(x + width - radius, y + height);
    roundedRectShape.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);
    roundedRectShape.lineTo(x + width, y + radius);
    roundedRectShape.quadraticCurveTo(x + width, y, x + width - radius, y);
    roundedRectShape.lineTo(x + radius, y);
    roundedRectShape.quadraticCurveTo(x, y, x, y + radius);

    var extrudeSettings = {
      depth: 1,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 0.1,
      bevelThickness: 0.2,
      material:0,
      extrudeMaterial : 1
    };

    var geometry = new THREE.ExtrudeGeometry(roundedRectShape, extrudeSettings);
    //var materialCanvas = new THREE.MeshPhongMaterial();

    //=================== CANVAS
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');

    canvas.width = 1024;
    canvas.height = 1024;

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const baseImage = new Image();
    baseImage.src = imageArray[Math.floor(Math.random() * 5)];
    //baseImage.src = imageArray[0];


    baseImage.onload = function () {
      ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

      // var hRatio = canvas.width / baseImage.width;
      // var vRatio = canvas.height / baseImage.height;
      // var ratio = Math.min(hRatio, vRatio);
      // const centerShiftX = (canvas.width - baseImage.width * ratio) / 2;
      // const centerShiftY = (canvas.height - baseImage.height * ratio) / 2;
      // ctx.clearRect(0, 0, canvas.width, canvas.height);
      // ctx.drawImage(baseImage, 0, 0, baseImage.width, baseImage.height,
      //   centerShiftX, centerShiftY, baseImage.width * ratio, baseImage.height * ratio);
    }

    //document.body.appendChild(canvas);

    this.texture = new THREE.CanvasTexture(canvas);
    // this.texture.mapping = THREE.CubeReflectionMapping;
    this.texture.encoding = THREE.sRGBEncoding;
    this.texture.wrapS = THREE.RepeatWrapping;
    this.texture.wrapT = THREE.RepeatWrapping;
    // this.texture.repeat.set(0.5, 0.5);
    //this.texture.repeat.set(0.005, 0.01);
    this.texture.repeat.set(0.005, 0.01);

    // // var loader = new THREE.TextureLoader();
    // // MATERIAL
    var materialCanvas = new THREE.MeshPhongMaterial({
      shininess: 100,
      //wireframe: true,
      //flatShading: true,
      // map: this.texture
    });

    var materialCanvasX = new THREE.MeshPhongMaterial({
      wireframe: true,
    });

    var mesh = new THREE.Mesh(geometry, materialCanvas);


    var center = new THREE.Vector3();
    mesh.geometry.computeBoundingBox();
    mesh.geometry.boundingBox.getCenter(center);
    mesh.geometry.center();
    mesh.position.copy(center);

    this.windMotion.add(TweenMax.to(mesh.rotation, 0.8, {
      y: THREE.Math.degToRad(-8),
      x: THREE.Math.degToRad(-8),
      ease: Linear.easeNone
    }));
    this.windMotion.add(TweenMax.to(mesh.rotation, 0.8, {
      y: THREE.Math.degToRad(0),
      x: THREE.Math.degToRad(0),
      ease: Linear.easeNone
    }));
    this.windMotion.add(TweenMax.to(mesh.rotation, 0.8, {
      y: THREE.Math.degToRad(8),
      x: THREE.Math.degToRad(8),
      ease: Linear.easeNone
    }));
    this.windMotion.add(TweenMax.to(mesh.rotation, 0.8, {
      y: THREE.Math.degToRad(0),
      x: THREE.Math.degToRad(0),
      ease: Linear.easeNone
    }));

    // =======
    // this.cardsTimeline.addLabel("flipout", 3);
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


function meshFitUvMap(mesh) {

  if (mesh.geometry &&
    mesh.material &&
    mesh.material.map &&
    mesh.material.map.userData &&
    mesh.material.map.userData.fitTo > 0) {


    var geometry = mesh.geometry;
    var textureFitTo = mesh.material.map.userData.fitTo;
    var faces = mesh.geometry.faces;

    for (var i = 0, len = faces.length; i < len; i++) {
      var face = faces[i];
      var uv = geometry.faceVertexUvs[0][i];

      var components = ['x', 'y', 'z'].sort(function (a, b) {
        return Math.abs(face.normal[a]) > Math.abs(face.normal[b]);
      });

      var v1 = mesh.geometry.vertices[face.a];
      var v2 = mesh.geometry.vertices[face.b];
      var v3 = mesh.geometry.vertices[face.c];

      var newUv0 = new THREE.Vector2(v1[components[0]] / textureFitTo, v1[components[1]] / textureFitTo);
      var newUv1 = new THREE.Vector2(v2[components[0]] / textureFitTo, v2[components[1]] / textureFitTo);
      var newUv2 = new THREE.Vector2(v3[components[0]] / textureFitTo, v3[components[1]] / textureFitTo);

      uv[0].copy(newUv0);
      uv[1].copy(newUv1);
      uv[2].copy(newUv2);

    }
  }
}