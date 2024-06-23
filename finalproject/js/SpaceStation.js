// SpaceStation.js
import { Vector3 } from 'https://cdn.skypack.dev/three@0.132.2';

class SpaceStationControls {
  constructor(spacestation, planet, camera, controls) {
    this.spacestation = spacestation;
    this.planet = planet;
    this.camera = camera;
    this.controls = controls;
    this.viewLocked = false;

    document.addEventListener('keydown', (event) => this.onKeyDown(event), false);
  }

  onKeyDown(event) {
    if (event.key === 'l') { // Press 'l' to lock/unlock view
      this.viewLocked = !this.viewLocked;
      if (this.viewLocked) {
        this.lockView();
      } else {
        this.unlockView();
      }
    }
  }

  lockView() {
    const offset = new Vector3(0, 0.2, 0.5); // Close-up view offset
    const targetPosition = this.spacestation.position.clone().add(offset);
    this.camera.position.copy(targetPosition);
    this.camera.lookAt(this.spacestation.position);
    this.controls.enabled = false; // Disable OrbitControls
  }

  unlockView() {
    this.camera.position.set(0, 50, 110); // Reset camera position
    this.camera.lookAt(0, 0, 0);
    this.controls.enabled = true; // Enable OrbitControls
  }

  update(delta) {
    if (this.viewLocked) {
      this.lockView();
    }
    this.rotateAroundPlanet(delta);
  }

  rotateAroundPlanet(delta) {
    const orbitRadius = 1; // Distance from Earth
    const orbitSpeed = 0.06; // Speed of the ISS rotation around Earth
    const angle = Date.now() * 0.001 * orbitSpeed;
    this.spacestation.position.set(
      this.planet.position.x + orbitRadius * Math.cos(angle),
      this.planet.position.y,
      this.planet.position.z + orbitRadius * Math.sin(angle)
    );
    this.spacestation.lookAt(this.planet.position);
  }
}

export default SpaceStationControls;
