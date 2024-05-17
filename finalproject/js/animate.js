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
            const distance = planet.userData.distance;
            const orbitSpeed = settings.currentOrbitSpeed * 0.1; // Adjust the scaling factor here
            planet.position.x = distance * Math.cos(time * orbitSpeed * (1 + index));
            planet.position.z = distance * Math.sin(time * orbitSpeed * (1 + index));
            planet.rotation.y += settings.currentRotationSpeed;
        });

        // Update tooltip positions to face the camera
        const tooltip = document.getElementById('tooltip');
        if (tooltip.style.display === 'block') {
            const planet = planets.find(p => p.userData.name === tooltip.innerHTML.split('<br>')[0]);
            if (planet) {
                const vector = new THREE.Vector3();
                planet.getWorldPosition(vector);
                vector.project(camera);
                tooltip.style.left = `${(vector.x + 1) * window.innerWidth / 2 + 5}px`;
                tooltip.style.top = `${(-vector.y + 1) * window.innerHeight / 2 + 5}px`;
            }
        }

        renderer.render(scene, camera);
    }
    render();
}
