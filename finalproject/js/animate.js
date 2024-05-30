export function animate(THREE, renderer, scene, camera, sun, planets, settings, spaceship, spaceshipControls, thrusterParticles) {
    function render() {
        requestAnimationFrame(render);

        // Smoothly transition speeds towards target values
        const transitionSpeed = 0.02;
        settings.currentRotationSpeed += (settings.targetRotationSpeed - settings.currentRotationSpeed) * transitionSpeed;
        settings.currentOrbitSpeed += (settings.targetOrbitSpeed - settings.currentOrbitSpeed) * transitionSpeed;

        // Rotate the sun
        sun.rotation.y += settings.currentRotationSpeed;

        // Orbit the planets around the sun
        const time = Date.now() * 0.001;

        planets.forEach((planet, index) => {
            const distance = planet.userData.distance;
            const orbitSpeed = settings.currentOrbitSpeed * 0.1; // Adjust the scaling factor here
            planet.position.x = distance * Math.cos(time * orbitSpeed * (1 + index));
            planet.position.z = distance * Math.sin(time * orbitSpeed * (1 + index));
            planet.rotation.y += settings.currentRotationSpeed;
        });

        // Update tooltip positions to face the camera
        const tooltip = document.getElementById('tooltip');
        if (tooltip && tooltip.style.display === 'block') {
            const planet = planets.find(p => p.userData.name === tooltip.innerHTML.split('<br>')[0]);
            if (planet) {
                const vector = new THREE.Vector3();
                planet.getWorldPosition(vector);
                vector.project(camera);
                tooltip.style.left = `${(vector.x + 1) * window.innerWidth / 2 + 5}px`;
                tooltip.style.top = `${(-vector.y + 1) * window.innerHeight / 2 + 5}px`;
            }
        }

        // Move the spaceship towards the sun
        if (spaceship) {
            spaceship.position.x -= 0.05; // Move left
            spaceship.position.y -= 0.05; // Move down
        }

        // Update thruster particles position
        if (thrusterParticles) {
            const positions = thrusterParticles.geometry.attributes.position.array;
            for (let i = 0; i < positions.length; i += 3) {
                positions[i] = spaceship.position.x + (Math.random() * 2 - 1) * 0.1;
                positions[i + 1] = spaceship.position.y + (Math.random() * 2 - 1) * 0.1;
                positions[i + 2] = spaceship.position.z + (Math.random() * 2 - 1) * 0.1;
            }
            thrusterParticles.geometry.attributes.position.needsUpdate = true;
        }

        // Update spaceship controls if defined
        if (spaceshipControls) {
            spaceshipControls.update();
        }

        renderer.render(scene, camera);
    }
    render();
}
