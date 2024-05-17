export function animate(THREE, renderer, scene, camera, sun, planets, settings) {
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
            const distance = 2 + index * 1.5;
            const orbitSpeed = settings.currentOrbitSpeed * 0.5; // Reduce the scaling factor here
            planet.position.x = distance * Math.cos(time * orbitSpeed * (1 + index));
            planet.position.z = distance * Math.sin(time * orbitSpeed * (1 + index));
            planet.rotation.y += settings.currentRotationSpeed;

            // Rotate the moon around the Earth
            if (planet.name === 'Earth') {
                const moon = planet.children[0];
                moon.position.x = 0.8 * Math.cos(time * 2 * orbitSpeed);
                moon.position.z = 0.8 * Math.sin(time * 2 * orbitSpeed);
            }
        });

        renderer.render(scene, camera);
    }
    render();
}
