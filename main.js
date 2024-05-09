import * as THREE from "three";
import * as CANNON from "cannon-es";
import CannonDebugger from "cannon-es-debugger";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

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

// CREATE SURFACE / GROUND
const groundBody = new CANNON.Body({
  mass: 0, // if any object falls on this it remains static (i.e. it doesn't move)
  material: new CANNON.Material("ground"),
  shape: new CANNON.Plane(),
});
groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
world.addBody(groundBody);

// CREATE SPHERE
const sphereBody = new CANNON.Body({
  mass: 5,
  shape: new CANNON.Sphere(0.5),
  material: new CANNON.Material(),
  position: new CANNON.Vec3(0, 10, 0)
});
world.addBody(sphereBody);

// ADDING GLTF LOADER FOR STADIUM
const gltfLoader = new GLTFLoader();
gltfLoader.load('stadium/scene.gltf',(gltf)=>{
    scene.add(gltf.scene)
})

// ADDING AMBIENT LIGHT (lights up everything)
const ambientLight = new THREE.AmbientLight(0xffffff,1)
scene.add(ambientLight);

// ADDING DIRECTIONAL LIGHT (works as sunlight)
const directionalLight = new THREE.DirectionalLight(0xffffff,5)
scene.add(directionalLight);

// ADDING POINTLIGHT

const controls = new OrbitControls(camera, renderer.domElement);
const cannonDebugger = new CannonDebugger(scene, world);

camera.position.set(5, 5, 5);

const animate = () => {
  requestAnimationFrame(animate);
  world.fixedStep();
  controls.update();
  cannonDebugger.update();
  renderer.render(scene, camera);
};

animate();

window.onresize = () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
};
