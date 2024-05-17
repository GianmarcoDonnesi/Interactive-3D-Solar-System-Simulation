import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';
import { initScene, createRenderer, createCamera, createLight } from './scene.js';
import { createSun, createPlanets } from './objects.js';
import { addControls } from './controls.js';
import { animate } from './animate.js';

let scene, camera, renderer, sun, planets, light;

function init() {
    scene = initScene(THREE);
    renderer = createRenderer(THREE);
    camera = createCamera(THREE);
    document.body.appendChild(renderer.domElement);

    const textureLoader = new THREE.TextureLoader();

    // Add the sun to the scene
    sun = createSun(THREE, textureLoader);
    sun.castShadow = true; // Enable shadows for the sun
    scene.add(sun);

    // Add planets to the scene
    planets = createPlanets(THREE, textureLoader);
    planets.forEach(planet => {
        planet.castShadow = true; // Enable shadows for the planets
        planet.receiveShadow = true;
        scene.add(planet);
    });

    // Add light to the scene
    light = createLight(THREE);
    scene.add(light);

    // Add controls
    addControls(THREE, camera, renderer);

    // Start the animation loop
    animate(THREE, renderer, scene, camera, sun, planets);
}

init();
