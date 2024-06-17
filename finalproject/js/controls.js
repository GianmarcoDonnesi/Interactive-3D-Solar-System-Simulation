// controls.js
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/controls/OrbitControls.js';

export function addControls(THREE, camera, renderer) {
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = true;
}
