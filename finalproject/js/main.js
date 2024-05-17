import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';
import { initScene, createRenderer, createCamera, createLight } from './scene.js';
import { createSun, createPlanets, createAsteroids, createOrbits } from './objects.js';
import { addControls } from './controls.js';
import { animate } from './animate.js';

let scene, camera, renderer, sun, planets, light, asteroids, background;

const settings = {
    currentRotationSpeed: 0.01,
    targetRotationSpeed: 0.01,
    currentOrbitSpeed: 0.001,
    targetOrbitSpeed: 0.001
};

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
    const planetDistances = [2, 3, 4, 5, 7, 9, 11, 13, 15]; // Distances for Mercury to Pluto
    planets = createPlanets(THREE, textureLoader);
    planets.forEach(planet => {
        planet.castShadow = true; // Enable shadows for the planets
        planet.receiveShadow = true;
        scene.add(planet);
    });

    // Add orbits to the scene
    const orbits = createOrbits(THREE, planetDistances);
    orbits.forEach(orbit => scene.add(orbit));

    // Add asteroids to the scene
    asteroids = createAsteroids(THREE, textureLoader);
    asteroids.forEach(asteroid => scene.add(asteroid));

    // Add light to the scene
    light = createLight(THREE);
    scene.add(light);

    // Add controls
    addControls(THREE, camera, renderer);

    // Add background
    const starTexture = textureLoader.load('textures/starfield1.jpg');
    const starGeometry = new THREE.SphereGeometry(100, 64, 64);
    const starMaterial = new THREE.MeshBasicMaterial({
        map: starTexture,
        side: THREE.BackSide
    });
    background = new THREE.Mesh(starGeometry, starMaterial);
    scene.add(background);

    // Handle rotation speed changes
    document.getElementById('rotationSpeed').addEventListener('input', (event) => {
        settings.targetRotationSpeed = parseFloat(event.target.value);
    });

    // Handle orbit speed changes
    document.getElementById('orbitSpeed').addEventListener('input', (event) => {
        settings.targetOrbitSpeed = parseFloat(event.target.value);
    });

    // Start the animation loop
    animate(THREE, renderer, scene, camera, sun, planets, settings);
}

init();
