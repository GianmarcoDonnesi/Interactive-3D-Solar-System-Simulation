export function animate(renderer, scene, camera, sun, planets) {
    function render() {
        requestAnimationFrame(render);

        // Rotate the sun
        sun.rotation.y += 0.01;

        // Orbit the planets around the sun
        const time = Date.now() * 0.001;

        planets.forEach((planet, index) => {
            const distance = 2 + index * 1.5;
            planet.position.x = distance * Math.cos(time * (1 + index * 0.1));
            planet.position.z = distance * Math.sin(time * (1 + index * 0.1));
            planet.rotation.y += 0.02;
        });

        renderer.render(scene, camera);
    }
    render();
}
