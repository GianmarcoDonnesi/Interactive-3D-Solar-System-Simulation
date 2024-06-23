# Space exploration: An Interactive 3D Solar System Simulation

![Solar System GIF](https://github.com/GianmarcoDonnesi/InteractiveComputerGraphics-FinalProject/blob/main/SolarSystemRec.gif)

## Overview

Welcome to the interactive 3D solar system simulation! This project offers users an immersive experience by allowing them to explore and interact with the planets and the International Space Station (ISS). Navigate through space using custom controls, observe the precise orbits of the planets, and get a close-up view of the ISS as it orbits Earth. This simulation provides a visually rich and interactive way to learn about our solar system, using advanced web technologies to bring celestial dynamics to life.

## Functionality and Key Features

- **Interactive 3D Scene**: Explore a fully-rendered 3D scene of the solar system with realistic textures and lighting.
- **Dynamic Planets and Space Station**: View and interact with detailed models of planets and the International Space Station, each with unique textures and orbits.
- **Custom Controls**: Navigate the scene using custom controls that provide a smooth and intuitive user experience, including the ability to lock the view on the ISS.
- **Realistic Orbits**: Observe the planets moving along their elliptical orbits, accurately reflecting their paths around the sun.
- **Realistic Sun Illumination**: Experience realistic lighting effects where the sun illuminates the planets, casting dynamic shadows that enhance the visual realism.
- **Shadow Projection**: Observe accurate shadow projections of celestial bodies, adding depth and authenticity to the scene.
- **Animation Loop**: Enjoy a continuously updating scene with an animation loop that keeps the simulation dynamic and engaging.


## Setup and Requirements

### Prerequisites

Ensure you have the following installed on your system:

- Node.js (version 14 or higher)
- npm (Node Package Manager)

### Installation

1. **Clone the repository**:
    ```bash
    git clone https://github.com/GianmarcoDonnesi/Interactive-3D-Solar-System-Simulation.git
    ```

2. **Navigate to the project directory**:
    ```bash
    cd Interactive 3D Solar System Simulation/finalproject
    ```

3. **Install dependencies**:
    ```bash
    npm install
    ```

### Running the Project

1. **Start the development server**:
    ```bash
    npm start
    ```

2. **Open your browser and navigate to**:
    ```bash
    http://localhost:3000
    ```

## Technologies and Tools Used

- **Three.js**: A powerful 3D library that makes WebGL simpler. Used for rendering the 3D scene and creating realistic models and animations.
- **JavaScript**: The primary programming language used for developing the project's functionality and interactivity.
- **Node.js**: A JavaScript runtime used for setting up the development environment and managing dependencies.
- **npm**: Node Package Manager, used for installing and managing project dependencies.
- **HTML5 and CSS3**: Used for structuring and styling the web application.

## Project Structure

- **`js/scene.js`**: Manages the 3D scene setup, including lighting, camera, and renderer configuration.
- **`js/controls.js`**: Implements custom controls for user interaction and navigation within the 3D scene.
- **`js/animate.js`**: Contains the animation loop that updates and renders the scene at each frame.
- **`js/spaceshipControls.js`**: Provides the logic for controlling the spaceship within the scene.
- **`js/main.js`**: Initializes the application and starts the animation loop.
- **`js/objects.js`**: Defines the 3D objects, such as planets, asteroids, and orbits, used in the scene.
- **`textures/`**: Contains all the realistic textures for the planets, background, and asteroids.
- **`model/`**: Contains the 3D model  *ISS_stationary.glb* of the International Space Station.


## License

This project is licensed under the GPL-3.0 License. See the [LICENSE](LICENSE) file for details.
