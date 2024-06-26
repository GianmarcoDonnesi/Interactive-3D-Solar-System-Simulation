export function animate(THREE, renderer, scene, camera, sun, planets, settings, spacestation, spacestationControls, controls, selectedPlanet, asteroids) {
    const clock = new THREE.Clock();

    // Ensure the time uniform is added only once
    sun.material.onBeforeCompile = (shader) => {
        if (!shader.uniforms.time) {
            // Add a time uniform to the shader to be used for animations
            shader.uniforms.time = { value: 0 };

            // Add time-based transformations
            shader.vertexShader = `
                uniform float time;
                ${shader.vertexShader}
            `.replace(
                `#include <begin_vertex>`, // Find the beginning of the vertex transformation code
                `#include <begin_vertex>
                transformed += normal * sin(time * 5.0 + position.x * 5.0) * 0.1;
                `
            );

            // Add a time-based pulsation effect
            shader.fragmentShader = `
                uniform float time;
                ${shader.fragmentShader}
            `.replace(
                `gl_FragColor = vec4( outgoingLight * (1.0 + 1.0 * sin(time * 10.0)), diffuseColor.a );`, // Find the final color assignment
                `gl_FragColor = vec4( outgoingLight * (1.0 + 1.0 * sin(time * 2.0)), diffuseColor.a );` // Apply a pulsating effect to the outgoing light
            );

            // Store the shader in the material's userData for later use
            sun.material.userData.shader = shader;  
        }
    };

    // Main render loop
    function render() {
        requestAnimationFrame(render);
        const delta = clock.getDelta(); // time spent between frames

        
        sun.rotation.y += settings.rotationSpeed;

        // Add pulsation effect to the sun
        sun.material.emissiveIntensity = 1.5 + Math.sin(Date.now() * 0.002) * 1.0;

        // Update time uniform
        if (sun.material.userData.shader) {
            sun.material.userData.shader.uniforms.time.value += delta;
        }

        // Orbit the planets around the sun
        const time = Date.now() * 0.001;
        planets.forEach((planet, index) => {
            const distance = planet.userData.distance;
            const eccentricity = planet.userData.eccentricity;
            const a = distance;
            const b = distance * Math.sqrt(1 - eccentricity ** 2); 
            const orbitSpeed = settings.orbitSpeed; 
            const angle = time * orbitSpeed * (1 + index);
            planet.position.x = a * Math.cos(angle);
            planet.position.z = b * Math.sin(angle);
            planet.rotation.y += settings.rotationSpeed;

            // Adjust light intensity based on distance
            const lightIntensity = Math.min(5, Math.max(0.3, 100 / (distance * distance))); 
            planet.material.emissiveIntensity = lightIntensity;

            // Dynamic point light to point from the surface of the sun to the planet
            const pointLight = planet.userData.pointLight;
            if (pointLight) {
                const direction = new THREE.Vector3();
                direction.subVectors(planet.position, sun.position).normalize();
                const lightPosition = direction.clone().multiplyScalar(1).add(sun.position);
                pointLight.position.copy(lightPosition);
                pointLight.target.position.copy(planet.position);
            }

            // Arrow helper direction
            const arrowHelper = planet.userData.arrowHelper;
            if (arrowHelper) {
                arrowHelper.position.copy(pointLight.position);
                arrowHelper.setDirection(planet.position.clone().sub(pointLight.position).normalize());
                arrowHelper.setLength(planet.position.distanceTo(pointLight.position));
            }
        });

        // Camera position to follow the selected planet
        if (selectedPlanet) {
            const offset = new THREE.Vector3(5, 5, 5); 
            const targetPosition = selectedPlanet.position.clone().add(offset);
            camera.position.lerp(targetPosition, 0.1); 
            camera.lookAt(selectedPlanet.position);

            // Tooltip positions to follow the selected planet
            const tooltip = document.getElementById('tooltip');
            if (tooltip && tooltip.style.display === 'block') {
                const vector = new THREE.Vector3();
                selectedPlanet.getWorldPosition(vector);
                vector.project(camera);

                const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
                const y = (vector.y * -0.5 + 0.5) * window.innerHeight;

                tooltip.style.left = `${x}px`;
                tooltip.style.top = `${y}px`;
            }
        }

       
        if (spacestationControls) {
            spacestationControls.update(delta);
        }

        // Move asteroids randomly
        asteroids.forEach(asteroid => {
            const speed = asteroid.userData.speed;
            const distance = asteroid.userData.distance;
            asteroid.userData.angle += speed * delta; // Angle based on speed and delta time
            asteroid.position.x = distance * Math.cos(asteroid.userData.angle);
            asteroid.position.z = distance * Math.sin(asteroid.userData.angle);
            asteroid.rotation.x += (Math.random() - 0.5) * delta * 0.1;
            asteroid.rotation.y += (Math.random() - 0.5) * delta * 0.1;
            asteroid.rotation.z += (Math.random() - 0.5) * delta * 0.1;
        });

        // Render the scene
        renderer.render(scene, camera);
    }
    render();
}