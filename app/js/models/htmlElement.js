'use strict';

import * as THREE from 'three';
import { CSS3DObject } from 'three-css3drenderer'

export default class HtmlElement {
    constructor(scene) {
        // HTML
        let element = document.createElement('div');
        element.innerHTML = 'Plain text inside a div.';
        element.style.background = "#0094ff";
        element.style.fontSize = "20px";
        element.style.color = "white";
        element.style.padding = "2em";

        // CSS Object
        let div = new CSS3DObject(element);
        div.position.x = 0;
        div.position.y = 0;
        div.position.z = 10;
        scene.add(div);
    }
}