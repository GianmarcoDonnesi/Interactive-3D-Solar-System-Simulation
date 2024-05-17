export function createSun(THREE, textureLoader) {
    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const texture = textureLoader.load('textures/sun.jpg');
    const material = new THREE.MeshBasicMaterial({ map: texture });
    const sun = new THREE.Mesh(geometry, material);
    return sun;
}

export function createPlanet(THREE, size, texturePath, distance, textureLoader) {
    const geometry = new THREE.SphereGeometry(size, 32, 32);
    const texture = textureLoader.load(texturePath);
    const material = new THREE.MeshBasicMaterial({ map: texture });
    const planet = new THREE.Mesh(geometry, material);
    planet.position.x = distance;
    return planet;
}

export function createPlanets(THREE, textureLoader) {
    const planets = [];

    const mercury = createPlanet(THREE, 0.5, 'textures/mercury.jpeg', 2, textureLoader);
    planets.push(mercury);

    const venus = createPlanet(THREE, 0.6, 'textures/venus.jpg', 3, textureLoader);
    planets.push(venus);

    const earth = createPlanet(THREE, 0.65, 'textures/earth.jpg', 4, textureLoader);
    planets.push(earth);

    const mars = createPlanet(THREE, 0.55, 'textures/mars.jpg', 5, textureLoader);
    planets.push(mars);

    // Add more planets as needed...

    return planets;
}
