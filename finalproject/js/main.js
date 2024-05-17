import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';
import { initScene, createRenderer, createCamera, createLight } from './scene.js';
import { createSun, createPlanets, createAsteroids } from './objects.js';
import { addControls } from './controls.js';
import { animate } from './animate.js';

let scene, camera, renderer, sun, planets, light, asteroids, background;

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

    // Add asteroids to the scene
    asteroids = createAsteroids(THREE);
    asteroids.forEach(asteroid => scene.add(asteroid));

    // Add light to the scene
    light = createLight(THREE);
    scene.add(light);

    // Add controls
    addControls(THREE, camera, renderer);

    // Add background
    const starTexture = textureLoader.load('textures/starfield.jpg');
    const starGeometry = new THREE.SphereGeometry(100, 64, 64);
    const starMaterial = new THREE.MeshBasicMaterial({
        map: starTexture,
        side: THREE.BackSide
    });
    background = new THREE.Mesh(starGeometry, starMaterial);
    scene.add(background);

    // Start the animation loop
    animate(THREE, renderer, scene, camera, sun, planets);
}

init();
