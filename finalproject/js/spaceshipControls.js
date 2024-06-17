// spaceshipControls.js
import { Vector3 } from 'https://cdn.skypack.dev/three@0.132.2';

class SpaceshipControls {
  constructor(spaceship, speed = 1) {
    this.spaceship = spaceship;
    this.speed = speed;
    this.direction = new Vector3();

    document.addEventListener('keydown', (event) => this.onKeyDown(event), false);
    document.addEventListener('keyup', (event) => this.onKeyUp(event), false);
  }

  onKeyDown(event) {
    switch (event.key) {
      case 'ArrowUp':
        this.direction.z = -1;
        break;
      case 'ArrowDown':
        this.direction.z = 1;
        break;
      case 'ArrowLeft':
        this.direction.x = -1;
        break;
      case 'ArrowRight':
        this.direction.x = 1;
        break;
    }
  }

  onKeyUp(event) {
    switch (event.key) {
      case 'ArrowUp':
      case 'ArrowDown':
        this.direction.z = 0;
        break;
      case 'ArrowLeft':
      case 'ArrowRight':
        this.direction.x = 0;
        break;
    }
  }

  update() {
    this.spaceship.position.addScaledVector(this.direction, this.speed);
  }
}

export default SpaceshipControls;
