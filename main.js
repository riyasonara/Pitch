import * as THREE from "three";
import * as CANNON from "cannon-es";
import CannonDebugger from "cannon-es-debugger";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import Stadium from "./objects/Stadium";
import Football from "./objects/Football";

// Add scene
const scene = new THREE.Scene();

// Add Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// Render
const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById("scene"),
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// CREATE OUR PHYSICS WORLD
const world = new CANNON.World({
  gravity: new CANNON.Vec3(0, -9.82, 0),
});

const gltfLoader = new GLTFLoader();

Stadium.create(scene, world, gltfLoader);
Football.create(scene, world, gltfLoader);

// ADDING AMBIENT LIGHT (lights up everything)
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

// ADDING DIRECTIONAL LIGHT (works as sunlight)
const directionalLight = new THREE.DirectionalLight(0xffffff, 5);
scene.add(directionalLight);

// ADDING POINTLIGHT

// const controls = new OrbitControls(camera, renderer.domElement);
const cannonDebugger = new CannonDebugger(scene, world);

camera.position.set(5, 5, 5);

const animate = () => {
  requestAnimationFrame(animate);
  Football.animate(camera);

  world.fixedStep();
  // controls.update();
  cannonDebugger.update();
  renderer.render(scene, camera);
};

animate();

window.onresize = () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
};
