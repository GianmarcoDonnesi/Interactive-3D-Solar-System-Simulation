// scene.js
export function initScene(THREE) {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000); // Impostare lo sfondo a nero
    return scene;
}

export function createRenderer(THREE) {
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true; // Enable shadow maps
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Softer shadows
    renderer.physicallyCorrectLights = true; // Enable physically correct lights
    return renderer;
}

export function createCamera(THREE) {
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 10; // Adjust camera position to fit entire solar system
    return camera;
}

export function createLight(THREE) {
    const light = new THREE.PointLight(0xffffff, 1, 100);
    light.position.set(0, 0, 0);
    light.castShadow = true; // Enable shadows for the light
    light.shadow.mapSize.width = 2048; // Shadow quality
    light.shadow.mapSize.height = 2048; // Shadow quality
    return light;
}
