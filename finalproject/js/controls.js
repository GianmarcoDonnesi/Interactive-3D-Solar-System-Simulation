import { OrbitControls } from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/controls/OrbitControls.js';

export function addControls(THREE, camera, renderer) {
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = true;
    controls.minDistance = 10; // Set a minimum distance for zoom
    controls.maxDistance = 110; // Set a maximum distance for zoom
    return controls;
}