import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';
import { initScene, createRenderer, createCamera, createLight } from './scene.js';
import { createSun, createPlanets, createAsteroids, createOrbits } from './objects.js';
import { addControls } from './controls.js';
import { animate } from './animate.js';

let scene, camera, renderer, sun, planets, light, asteroids, background, raycaster, mouse;
const planetData = [
    { name: 'Mercury', distance: 2 },
    { name: 'Venus', distance: 3 },
    { name: 'Earth', distance: 4 },
    { name: 'Mars', distance: 5 },
    { name: 'Jupiter', distance: 7 },
    { name: 'Saturn', distance: 9 },
    { name: 'Uranus', distance: 11 },
    { name: 'Neptune', distance: 13 },
    { name: 'Pluto', distance: 15 }
];

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

    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    const textureLoader = new THREE.TextureLoader();

    // Add the sun to the scene
    sun = createSun(THREE, textureLoader);
    sun.castShadow = true; // Enable shadows for the sun
    scene.add(sun);

    // Add planets to the scene
    planets = createPlanets(THREE, textureLoader);
    planets.forEach((planet, index) => {
        planet.castShadow = true; // Enable shadows for the planets
        planet.receiveShadow = true;
        planet.userData = planetData[index]; // Store planet data
        scene.add(planet);
    });

    // Add orbits to the scene
    const orbits = createOrbits(THREE, planetData.map(data => data.distance));
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

    // Add event listeners for tooltip
    window.addEventListener('mousemove', onMouseMove, false);
    window.addEventListener('click', onClick, false);

    // Start the animation loop
    animate(THREE, renderer, scene, camera, sun, planets, settings);
}

function onMouseMove(event) {
    event.preventDefault();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
}

function onClick(event) {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(planets);

    if (intersects.length > 0) {
        const planet = intersects[0].object;
        const tooltip = document.getElementById('tooltip');
        tooltip.innerHTML = `${planet.userData.name}<br>Distance: ${planet.userData.distance} AU`;
        tooltip.style.left = `${event.clientX + 5}px`;
        tooltip.style.top = `${event.clientY + 5}px`;
        tooltip.style.display = 'block';
    } else {
        const tooltip = document.getElementById('tooltip');
        tooltip.style.display = 'none';
    }
}

init();
