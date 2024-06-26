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
    camera.position.z = 10; 
    return camera;
}

export function createLight(THREE) {
    const light = new THREE.AmbientLight(0x404040, 1); // Soft white ambient light
    return light;
}

export function createSunLight(THREE) {
    const sunLight = new THREE.PointLight(0xffffff, 100, 1000); 
    sunLight.position.set(0, 0, 0);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 4096; 
    sunLight.shadow.mapSize.height = 4096; 
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 10000; 
    sunLight.shadow.bias = -0.0001;
    sunLight.shadow.focus = 1;
    sunLight.decay = 2; 
    return sunLight;
}

// If needed
export function createDirectionalLight(THREE) {
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 10, 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    return directionalLight;
}

export function loadHDRIEnvironment(THREE, renderer, scene, textureLoader) {
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();

    textureLoader.load('textures/space_hdr.hdr', (texture) => {
        const envMap = pmremGenerator.fromEquirectangular(texture).texture;
        scene.environment = envMap;
        scene.background = envMap;
        texture.dispose();
        pmremGenerator.dispose();
    });
}