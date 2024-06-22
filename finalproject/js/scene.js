// scene.js
export function initScene(THREE) {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000); // Set background to black
    return scene;
}

export function createRenderer(THREE) {
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.physicallyCorrectLights = true; // Enable physically correct lights
    return renderer;
}

export function createCamera(THREE) {
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 10; // Adjust camera position to fit the entire solar system
    return camera;
}

export function createLight(THREE) {
    const light = new THREE.AmbientLight(0x404040, 1); // Soft white ambient light
    return light;
}

export function createSunLight(THREE) {
    const sunLight = new THREE.PointLight(0xffffff, 100, 1000); // Increased intensity to 50
    sunLight.position.set(0, 0, 0);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 4096; // Shadow quality
    sunLight.shadow.mapSize.height = 4096; // Shadow quality
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 10000; // Ensure this is enough to cover the scene
    sunLight.shadow.bias = -0.0001;
    sunLight.shadow.focus = 1;
    sunLight.decay = 2; // Light decay over distance
    return sunLight;
}

export function createDirectionalLight(THREE) {
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 10, 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    return directionalLight;
}
