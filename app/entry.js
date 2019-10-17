'use strict';

import * as THREE from 'three';
import Config from 'appRoot/data/config';
//
import Detector from 'appRoot/js/utils/detector';
import Main from 'appRoot/js/views/main';

import 'appRoot/styles/app.scss';

function init() {
    // Check for webGL capabilities
    if (!Detector.webgl) {
        Detector.addGetWebGLMessage();
    } else {
        const container = document.getElementById('appContainer');
        new Main(container);
    }
}

init();
