// animate.js
export function animate(THREE, renderer, scene, camera, sun, planets, settings, spaceship, spaceshipControls, thrusterParticles, controls, selectedPlanet, asteroids) {
    const clock = new THREE.Clock();

    // Ensure the time uniform is added only once
    sun.material.onBeforeCompile = (shader) => {
        if (!shader.uniforms.time) {
            shader.uniforms.time = { value: 0 };

            shader.vertexShader = `
                uniform float time;
                ${shader.vertexShader}
            `.replace(
                `#include <begin_vertex>`,
                `#include <begin_vertex>
                transformed.x += 0.5 * sin(time + position.y);
                transformed.y += 0.5 * cos(time + position.x);
                transformed.z += 0.5 * sin(time + position.z);
                `
            );

            shader.fragmentShader = `
                uniform float time;
                ${shader.fragmentShader}
            `.replace(
                `gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,
                `gl_FragColor = vec4( outgoingLight * (1.0 + 0.5 * sin(time)), diffuseColor.a );`
            );

            sun.material.userData.shader = shader;  // Store the shader for later use
        }
    };

    function render() {
        requestAnimationFrame(render);
        const delta = clock.getDelta();

        // Rotate the sun
        sun.rotation.y += settings.rotationSpeed;

        // Add pulsation effect to the sun
        sun.material.emissiveIntensity = 1.5 + Math.sin(Date.now() * 0.005) * 0.5;

        // Update time uniform
        if (sun.material.userData.shader) {
            sun.material.userData.shader.uniforms.time.value += delta;
        }

        // Orbit the planets around the sun
        const time = Date.now() * 0.001;
        planets.forEach((planet, index) => {
            const distance = planet.userData.distance;
            const eccentricity = planet.userData.eccentricity;
            const a = distance; // Semi-major axis
            const b = distance * Math.sqrt(1 - eccentricity ** 2); // Semi-minor axis
            const orbitSpeed = settings.orbitSpeed; // Adjust the scaling factor here
            const angle = time * orbitSpeed * (1 + index);
            planet.position.x = a * Math.cos(angle);
            planet.position.z = b * Math.sin(angle);
            planet.rotation.y += settings.rotationSpeed;

            // Adjust light intensity based on distance
            const lightIntensity = Math.min(5, Math.max(0.3, 100 / (distance * distance))); // Adjusted calculation
            planet.material.emissiveIntensity = lightIntensity;

            // Update the dynamic point light to point from the surface of the sun to the planet
            const pointLight = planet.userData.pointLight;
            if (pointLight) {
                const direction = new THREE.Vector3();
                direction.subVectors(planet.position, sun.position).normalize();
                const lightPosition = direction.clone().multiplyScalar(1).add(sun.position);
                pointLight.position.copy(lightPosition);
                pointLight.target.position.copy(planet.position);
            }

            // Update arrow helper direction
            const arrowHelper = planet.userData.arrowHelper;
            if (arrowHelper) {
                arrowHelper.position.copy(pointLight.position);
                arrowHelper.setDirection(planet.position.clone().sub(pointLight.position).normalize());
                arrowHelper.setLength(planet.position.distanceTo(pointLight.position));
            }
        });

        // Update camera position to follow the selected planet
        if (selectedPlanet) {
            const offset = new THREE.Vector3(5, 5, 5); // Adjust the offset as needed
            const targetPosition = selectedPlanet.position.clone().add(offset);
            camera.position.lerp(targetPosition, 0.1); // Smoothly interpolate the camera position
            camera.lookAt(selectedPlanet.position);
        }

        // Update tooltip positions to follow the selected planet
        const tooltip = document.getElementById('tooltip');
        if (tooltip && tooltip.style.display === 'block' && selectedPlanet) {
            const vector = new THREE.Vector3();
            selectedPlanet.getWorldPosition(vector);
            vector.project(camera);

            const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
            const y = (vector.y * -0.5 + 0.5) * window.innerHeight;

            tooltip.style.left = `${x}px`;
            tooltip.style.top = `${y}px`;
        }

        // Update thruster particles position
        if (thrusterParticles) {
            thrusterParticles.position.copy(spaceship.position);
        }

        // Update spaceship controls
        spaceshipControls.update(delta);

        // Move asteroids randomly
        asteroids.forEach(asteroid => {
            asteroid.position.x += (Math.random() - 0.5) * delta;
            asteroid.position.y += (Math.random() - 0.5) * delta;
            asteroid.position.z += (Math.random() - 0.5) * delta;
            asteroid.rotation.x += (Math.random() - 0.5) * delta * 0.1;
            asteroid.rotation.y += (Math.random() - 0.5) * delta * 0.1;
            asteroid.rotation.z += (Math.random() - 0.5) * delta * 0.1;
        });

        // Render the scene
        renderer.render(scene, camera);
    }
    render();
}


