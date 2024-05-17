import { initScene, createRenderer, createCamera, createLight } from './scene.js';
import { createSun, createPlanets } from './objects.js';
import { addControls } from './controls.js';
import { animate } from './animate.js';

let scene, camera, renderer, sun, planets, light;

function init() {
    scene = initScene();
    renderer = createRenderer();
    camera = createCamera();
    document.body.appendChild(renderer.domElement);

    const textureLoader = new THREE.TextureLoader();

    // Add the sun to the scene
    sun = createSun(textureLoader);
    sun.castShadow = true; // Enable shadows for the sun
    scene.add(sun);

    // Add planets to the scene
    planets = createPlanets(textureLoader);
    planets.forEach(planet => {
        planet.castShadow = true; // Enable shadows for the planets
        planet.receiveShadow = true;
        scene.add(planet);
    });

    // Add light to the scene
    light = createLight();
    scene.add(light);

    // Add controls
    addControls(camera, renderer);

    // Start the animation loop
    animate(renderer, scene, camera, sun, planets);
}

init();
