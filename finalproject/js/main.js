// main.js
import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/loaders/GLTFLoader.js';
import { initScene, createRenderer, createCamera, createLight, createSunLight } from './scene.js';
import { createSun, createPlanets, createAsteroids, createOrbits } from './objects.js';
import { addControls } from './controls.js';
import { animate } from './animate.js';
import SpaceshipControls from './spaceshipControls.js';

let scene, camera, renderer, sun, planets, sunLight, asteroids, background, raycaster, mouse, spaceship, spaceshipControls, thrusterParticles, controls;
let selectedPlanet = null;
const planetData = [
    { name: 'Mercury', distance: 2, eccentricity: 0.205 },
    { name: 'Venus', distance: 3, eccentricity: 0.0067 },
    { name: 'Earth', distance: 4, eccentricity: 0.0167 },
    { name: 'Mars', distance: 5, eccentricity: 0.0934 },
    { name: 'Jupiter', distance: 7, eccentricity: 0.0489 },
    { name: 'Saturn', distance: 9, eccentricity: 0.0565 },
    { name: 'Uranus', distance: 11, eccentricity: 0.0463 },
    { name: 'Neptune', distance: 13, eccentricity: 0.0097 },
    { name: 'Pluto', distance: 15, eccentricity: 0.2488 }
];

const settings = {
    rotationSpeed: 0.002,
    orbitSpeed: 0.006
};

function init() {
    scene = initScene(THREE);
    renderer = createRenderer(THREE);
    camera = createCamera(THREE);
    camera.position.set(0, 50, 110); // Adjust camera position to ensure it can see the spaceship
    camera.lookAt(0, 0, 0);

    document.body.appendChild(renderer.domElement);

    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    const textureLoader = new THREE.TextureLoader();

    // Add the sun to the scene
    sun = createSun(THREE, textureLoader); // Pass the texture loader to createSun
    sun.castShadow = true; // Enable shadows for the sun
    scene.add(sun);

    // Add Sun's PointLight to the scene
    sunLight = createSunLight(THREE);
    scene.add(sunLight);

    // Debugging: Add light helper
    const pointLightHelper = new THREE.PointLightHelper(sunLight, 1);
    scene.add(pointLightHelper);

    // Debugging: Log sunLight properties
    console.log('SunLight Properties:', sunLight);

    // Add planets to the scene
    planets = createPlanets(THREE, textureLoader);
    planets.forEach((planet, index) => {
        planet.castShadow = true; // Enable shadows for the planets
        planet.receiveShadow = true;
        planet.userData = planetData[index]; // Store planet data
        scene.add(planet);

        // Debugging: Log planet properties
        console.log(`Planet ${planet.userData.name} Properties:`, planet);
    });

    // Add orbits to the scene
    const orbits = createOrbits(THREE, planetData);
    orbits.forEach(orbit => scene.add(orbit));

    // Add asteroids to the scene
    asteroids = createAsteroids(THREE, textureLoader);
    asteroids.forEach(asteroid => scene.add(asteroid));

    // Add additional ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 1); // Reduce ambient light intensity to 1
    scene.add(ambientLight);

    // Add controls
    controls = addControls(THREE, camera, renderer);

    // Add background
    const starTexture = textureLoader.load('textures/starfield1.jpg');
    const starGeometry = new THREE.SphereGeometry(100, 64, 64);
    const starMaterial = new THREE.MeshBasicMaterial({
        map: starTexture,
        side: THREE.BackSide
    });
    background = new THREE.Mesh(starGeometry, starMaterial);
    scene.add(background);

    // Load the spaceship model
    const loader = new GLTFLoader();
    loader.load('models/spaceship.glb', (gltf) => {
        console.log('Spaceship model loaded successfully');
        spaceship = gltf.scene;
        spaceship.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
        spaceship.scale.set(0.5, 0.5, 0.5); // Adjust the scale if necessary
        spaceship.position.set(50, 50, -50); // Set initial position of the spaceship in the upper right corner
        spaceship.lookAt(sun.position); // Point the spaceship toward the sun
        scene.add(spaceship);
        console.log('Spaceship added to the scene');

        // Initialize spaceship controls
        spaceshipControls = new SpaceshipControls(spaceship, 0.5);

        // Create thruster particles
        const particleGeometry = new THREE.BufferGeometry();
        const particleCount = 1000;
        const positions = new Float32Array(particleCount * 3);
        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = Math.random() * 2 - 1;
            positions[i * 3 + 1] = Math.random() * 2 - 1;
            positions[i * 3 + 2] = Math.random() * 2 - 1;
        }
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const particleMaterial = new THREE.PointsMaterial({ color: 0xff6600, size: 0.1, transparent: true, opacity: 0.7 });
        thrusterParticles = new THREE.Points(particleGeometry, particleMaterial);
        scene.add(thrusterParticles);

        // Start the animation loop with spaceship
        animate(THREE, renderer, scene, camera, sun, planets, settings, spaceship, spaceshipControls, thrusterParticles, controls, selectedPlanet);
    }, undefined, (error) => {
        console.error('Error loading spaceship model:', error);
    });

    // Add event listeners for tooltip and click events
    window.addEventListener('mousemove', onMouseMove, false);
    window.addEventListener('click', onClick, false);
    window.addEventListener('keydown', onKeyDown, false);
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
        selectedPlanet = planet;

        // Update tooltip position and content
        const tooltip = document.getElementById('tooltip');
        tooltip.innerHTML = `${planet.userData.name}<br>Distance: ${planet.userData.distance} AU`;
        tooltip.style.left = `${event.clientX + 5}px`;
        tooltip.style.top = `${event.clientY + 5}px`;
        tooltip.style.display = 'block';

        // Lock camera on selected planet
        camera.position.set(planet.position.x + 5, planet.position.y + 5, planet.position.z + 5);
        camera.lookAt(planet.position);
        controls.enabled = false;
    } else {
        const tooltip = document.getElementById('tooltip');
        tooltip.style.display = 'none';
    }
}

function onKeyDown(event) {
    if (event.key === 'Escape' && selectedPlanet) {
        selectedPlanet = null;
        camera.position.set(0, 50, 110);
        camera.lookAt(0, 0, 0);
        controls.enabled = true;

        const tooltip = document.getElementById('tooltip');
        tooltip.style.display = 'none';
    }
}

init();
