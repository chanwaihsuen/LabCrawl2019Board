import * as THREE from 'three';
import TWEEN from 'tween.js';

import base from './images/base.png';
import RoundedCard from './model/roundedCard';

export default class deckCards {
  constructor() {


    // var cssElement = createCSS3DObject(content);
    // cssElement.position.set(100, 100, 100);
    // this.scene.add(cssElement);

    // takeover here
    // var geometry = new THREE.BoxGeometry(10, 10, 1);
    // var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    // var cube = new THREE.Mesh(geometry, material);


    // const effectPass = new EffectPass(this.camera.threeCamera, new BloomEffect());
    // effectPass.renderToScreen = true;




    // CANVAS
    var canvas = document.createElement('canvas'),
      ctx = canvas.getContext('2d');

    canvas.width = 1024;
    canvas.height = 1024;

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const baseImage = new Image();
    baseImage.src = base;
    baseImage.onload = function () {
      ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
    }

    //document.body.appendChild(canvas);

    var texture = new THREE.CanvasTexture(canvas);
    texture.encoding = THREE.sRGBEncoding;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(0.01, 0.01);

    // // var loader = new THREE.TextureLoader();
    // // MATERIAL
    var materialCanvas = new THREE.MeshPhongMaterial({
      shininess: 1000,
      map: texture
    });

     //var mesh = new THREE.Mesh(geometry, materialCanvas);

    // var geometry = new THREE.BoxGeometry(1, 1, 1);
    // var cube = new THREE.Mesh(geometry, materialCanvas);



    // var content = '<div>' +
    //   '<h1>This is an H1 Element.</h1>' +
    //   '<span class="large">Hello Three.js cookbook</span>' +
    //   '<textarea> And this is a textarea</textarea>' +
    //   '</div>';
    // function createCSS3DObject(content) {
    //   // convert the string to dome elements
    //   var wrapper = document.createElement('div');
    //   wrapper.innerHTML = content;
    //   var div = wrapper.firstChild;

    //   // set some values on the div to style it.
    //   // normally you do this directly in HTML and 
    //   // CSS files.
    //   div.style.width = '370px';
    //   div.style.height = '370px';
    //   div.style.opacity = 0.7;
    //   div.style.background = new THREE.Color(Math.random() * 0xffffff).getStyle();

    //   // create a CSS3Dobject and return it.
    //   var object = new CSS3DObject(div);
    //   return object;
    // }


    var frustum = new THREE.Frustum();
    var cameraViewProjectionMatrix = new THREE.Matrix4();

    // every time the camera or objects change position (or every frame)

    camera.updateMatrixWorld(); // make sure the camera matrix is updated
    camera.matrixWorldInverse.getInverse(camera.matrixWorld);
    cameraViewProjectionMatrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
    frustum.setFromMatrix(cameraViewProjectionMatrix);

    // frustum is now ready to check all the objects you need

    console.log(frustum.intersectsObject(object));





Set up rStats if dev environment
if (Config.isDev && Config.isShowingStats) {
  this.stats = new Stats(this.renderer);
  this.stats.setUp();
}

Instantiate texture class
this.texture = new Texture();

Start loading the textures and then go on to load the model after the texture Promises have resolved
this.texture.load().then(() => {
  this.manager = new THREE.LoadingManager();

  // Textures loaded, load model
  this.model = new Model(this.scene, this.manager, this.texture.textures);
  this.model.load();

  // onProgress callback
  this.manager.onProgress = (item, loaded, total) => {
    console.log(`${item}: ${loaded} ${total}`);
  };

  // All loaders done now
  this.manager.onLoad = () => {
    // Set up interaction manager with the app now that the model is finished loading
    new Interaction(this.renderer.threeRenderer, this.scene, this.camera.threeCamera, this.controls.threeControls);

    // Add dat.GUI controls if dev
    if (Config.isDev) {
      new DatGUI(this, this.model.obj);
    }

    // Everything is now fully loaded
    Config.isLoaded = true;
    this.container.querySelector('#loading').style.display = 'none';
  };
});

  }
}