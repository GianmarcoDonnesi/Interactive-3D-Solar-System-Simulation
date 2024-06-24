import { Vector3 } from 'https://cdn.skypack.dev/three@0.132.2';

// SpaceStationControls class to handle the space station's movement and camera control
class SpaceStationControls {
  constructor(spacestation, planet, camera, controls) {
    this.spacestation = spacestation; // Reference to the space station object
    this.planet = planet; // Reference to the planet object
    this.camera = camera; // Reference to the camera object
    this.controls = controls; // Reference to the OrbitControls object
    this.viewLocked = false; // Flag to track if the view is locked

    
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

  // Lock the camera view to a close-up of the space station
  lockView() {
    const offset = new Vector3(0, 0.2, 0.5); // Close-up view offset
    const targetPosition = this.spacestation.position.clone().add(offset); // Calculate the target position for the camera
    this.camera.position.copy(targetPosition); 
    this.camera.lookAt(this.spacestation.position); // Make the camera look at the space station
    this.controls.enabled = false; // Disable OrbitControls to lock the view
  }

  // Unlock the camera view and reset its position
  unlockView() {
    this.camera.position.set(0, 50, 110); 
    this.camera.lookAt(0, 0, 0); 
    this.controls.enabled = true;
  }

  update(delta) {
    if (this.viewLocked) {
      this.lockView(); // Keep the view locked if the viewLocked flag is true
    }
    this.rotateAroundPlanet(delta); // Rotate the space station around the planet
  }

  rotateAroundPlanet(delta) {
    const orbitRadius = 1; // Distance from the planet
    const orbitSpeed = 0.06; // Speed of the space station's rotation around the planet
    const angle = Date.now() * 0.001 * orbitSpeed; // Calculate the current angle based on time and speed
    this.spacestation.position.set(
      this.planet.position.x + orbitRadius * Math.cos(angle), 
      this.planet.position.y, 
      this.planet.position.z + orbitRadius * Math.sin(angle) 
    );
    this.spacestation.lookAt(this.planet.position); // Make the space station look at the planet
  }
}

export default SpaceStationControls;