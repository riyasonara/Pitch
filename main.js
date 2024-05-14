import * as THREE from "three";
import * as CANNON from "cannon-es";
// import CannonDebugger from "cannon-es-debugger";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import Stadium from "./objects/Stadium";
import Football from "./objects/Football";
import Wall from "./objects/Walls";

// Add scene
const scene = new THREE.Scene();

// ADD CAMERA

// Create football camera (overhead view)
const footballCamera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
footballCamera.lookAt(0, 0, 0);

// Create third-person camera
const thirdPersonCamera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
thirdPersonCamera.position.set(0, 10, -20); // Adjust the position as needed
thirdPersonCamera.lookAt(0, 0, 0);

// Current active camera
let activeCamera = thirdPersonCamera;

// Function to switch cameras
function switchCamera() {
  activeCamera =
    activeCamera === thirdPersonCamera ? footballCamera : thirdPersonCamera;
}

// Render
const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById("scene"),
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// Controls for the third-person camera
const controls = new OrbitControls(thirdPersonCamera, renderer.domElement);
controls.target.set(0, 0, 0);
controls.update();

// CREATE OUR PHYSICS WORLD
const world = new CANNON.World({
  gravity: new CANNON.Vec3(0, -9.82, 0),
});

const gltfLoader = new GLTFLoader();

Stadium.create(scene, world, gltfLoader);
Football.create(scene, world, gltfLoader);
Wall.create(world);

// ADDING AMBIENT LIGHT (lights up everything)
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

// ADDING DIRECTIONAL LIGHT (works as sunlight)
const directionalLight = new THREE.DirectionalLight(0xffffff, 5);
scene.add(directionalLight);

// const cannonDebugger = new CannonDebugger(scene, world);

footballCamera.position.set(5, 5, 5);

const animate = () => {
  requestAnimationFrame(animate);
  Football.animate(footballCamera);
  world.fixedStep();
  renderer.render(scene, activeCamera);
};

animate();

window.addEventListener("resize", () => {
  const aspect = window.innerWidth / window.innerHeight;
  footballCamera.aspect = aspect;
  footballCamera.updateProjectionMatrix();

  thirdPersonCamera.aspect = aspect;
  thirdPersonCamera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Handle camera switch on key press (e.g., 'C' key)
window.addEventListener("keydown", (event) => {
  if (event.key === "c" || event.key === "C") {
    switchCamera();
  }
});
