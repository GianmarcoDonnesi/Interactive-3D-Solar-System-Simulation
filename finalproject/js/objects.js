// objects.js
export function createSun(THREE, textureLoader) {
    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const texture = textureLoader.load('textures/sun.jpg');

    const material = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            sunTexture: { value: texture },
            noiseFrequency: { value: 1.5 },
            noiseAmplitude: { value: 0.5 }
        },
        vertexShader: `
            varying vec2 vUv;
            varying vec3 vNormal;
            varying vec3 vPosition;

            void main() {
                vUv = uv;
                vNormal = normal;
                vPosition = position;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform float time;
            uniform sampler2D sunTexture;
            uniform float noiseFrequency;
            uniform float noiseAmplitude;
            varying vec2 vUv;
            varying vec3 vNormal;
            varying vec3 vPosition;

            float noise(vec3 p) {
                return sin(p.x + p.y + p.z + time);
            }

            void main() {
                vec3 texColor = texture2D(sunTexture, vUv).rgb;
                float noiseValue = noise(vPosition * noiseFrequency + time * 0.5);
                float intensity = 0.5 + 0.5 * noiseValue * noiseAmplitude;
                vec3 color = mix(vec3(1.0, 0.3, 0.0), vec3(1.0, 1.0, 0.0), intensity);
                gl_FragColor = vec4(texColor * color, 1.0);
            }
        `
    });

    const sun = new THREE.Mesh(geometry, material);
    sun.castShadow = true;
    sun.receiveShadow = true;

    return sun;
}

export function createPlanet(THREE, size, texturePath, distance, textureLoader, hasRings) {
    const geometry = new THREE.SphereGeometry(size, 32, 32);
    const texture = textureLoader.load(texturePath);
    const material = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.9, // Adjust roughness for better light reflection
        metalness: 0.1, // Slight metalness for shinier appearance
    });
    const planet = new THREE.Mesh(geometry, material);
    planet.position.x = distance;
    planet.castShadow = true;
    planet.receiveShadow = true;

    if (hasRings) {
        const rings = createRings(THREE, textureLoader);
        planet.add(rings);
    }

    return planet;
}

export function createRings(THREE, textureLoader) {
    const ringGeometry = new THREE.RingGeometry(1.2, 2, 64);
    const ringTexture = textureLoader.load('textures/saturn_ring.png');
    const ringMaterial = new THREE.MeshStandardMaterial({
        map: ringTexture,
        side: THREE.DoubleSide,
        transparent: true,
    });
    const rings = new THREE.Mesh(ringGeometry, ringMaterial);
    rings.rotation.x = Math.PI / 2;
    return rings;
}

export function createPlanets(THREE, textureLoader) {
    const planets = [];

    const mercury = createPlanet(THREE, 0.5, 'textures/mercury.jpg', 2, textureLoader, false);
    planets.push(mercury);

    const venus = createPlanet(THREE, 0.6, 'textures/venus.jpg', 3, textureLoader, false);
    planets.push(venus);

    const earth = createPlanet(THREE, 0.65, 'textures/earth.jpg', 4, textureLoader, false);
    planets.push(earth);

    const moon = createPlanet(THREE, 0.2, 'textures/moon.jpg', 1, textureLoader, false);
    earth.add(moon);

    const mars = createPlanet(THREE, 0.55, 'textures/mars.jpg', 5, textureLoader, false);
    planets.push(mars);

    const jupiter = createPlanet(THREE, 1.1, 'textures/jupiter.jpg', 7, textureLoader, false);
    planets.push(jupiter);

    const saturn = createPlanet(THREE, 1, 'textures/saturn.jpg', 9, textureLoader, true);
    planets.push(saturn);

    const uranus = createPlanet(THREE, 0.8, 'textures/uranus.jpg', 11, textureLoader, false);
    planets.push(uranus);

    const neptune = createPlanet(THREE, 0.8, 'textures/neptune.jpg', 13, textureLoader, false);
    planets.push(neptune);

    const pluto = createPlanet(THREE, 0.3, 'textures/pluto.jpg', 15, textureLoader, false);
    planets.push(pluto);

    return planets;
}

export function createAsteroids(THREE, textureLoader) {
    const asteroids = [];
    const asteroidGeometry = new THREE.SphereGeometry(0.05, 16, 16);
    const asteroidTexture = textureLoader.load('textures/asteroid.jpg');
    const asteroidMaterial = new THREE.MeshStandardMaterial({ map: asteroidTexture });

    for (let i = 0; i < 200; i++) { // Increase the number of asteroids for a denser belt
        const asteroid = new THREE.Mesh(asteroidGeometry, asteroidMaterial);
        const distance = Math.random() * 2 + 8; // Randomize distance to form a belt between 8 and 10 units from the sun
        const angle = Math.random() * Math.PI * 2;
        asteroid.position.set(
            distance * Math.cos(angle),
            (Math.random() - 0.5) * 0.2, // Slight vertical variation
            distance * Math.sin(angle)
        );
        asteroid.castShadow = true;
        asteroid.receiveShadow = true;
        asteroid.userData = {
            speed: Math.random() * 0.001 + 0.0001, // Random speed
            angle: angle, // Store initial angle
            distance: distance // Store distance from the sun
        };
        asteroids.push(asteroid);
    }

    return asteroids;
}

export function createOrbits(THREE, planetData) {
    const orbits = [];
    const orbitMaterial = new THREE.LineBasicMaterial({ color: 0x8888ff, linewidth: 0.1, transparent: true, opacity: 0.3 }); // Lighter and less visible

    planetData.forEach(data => {
        const orbitGeometry = new THREE.BufferGeometry();
        const points = [];

        const a = data.distance; // Semi-major axis
        const b = a * Math.sqrt(1 - data.eccentricity ** 2); // Semi-minor axis

        for (let j = 0; j <= 64; j++) {
            const theta = (j / 64) * Math.PI * 2;
            points.push(
                a * Math.cos(theta),
                0,
                b * Math.sin(theta)
            );
        }

        orbitGeometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
        const orbit = new THREE.Line(orbitGeometry, orbitMaterial);
        orbits.push(orbit);
    });

    return orbits;
}


