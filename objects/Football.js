import * as THREE from "three";
import * as CANNON from "cannon-es";

let sphereBody;
let football;

function create(scene, world, loader) {
  // CREATE SPHERE
  sphereBody = new CANNON.Body({
    mass: 5,
    shape: new CANNON.Sphere(0.13),
    material: new CANNON.Material(),
    position: new CANNON.Vec3(0, 10, 0),
    angularVelocity: new CANNON.Vec3(10, 0, 0),
    linearDamping: 0.2,
    angularDamping: 0.5,
  });
  sphereBody.material.restitution = 0.5;
  world.addBody(sphereBody);

  // ADDING GLTF LOADER FOR FOOTBALL
  loader.load("football/scene.json", (gltf) => {
    football = gltf.scene;
    const scale = 0.003;
    football.scale.set(scale, scale, scale);
    scene.add(football);
  });
}

const cameraOffset = new THREE.Vector3(0, 0.5, 1.2);

function animate(camera) {
  if (football) {
    football.position.copy(sphereBody.position);
    football.quaternion.copy(sphereBody.quaternion);
    camera.position.copy(sphereBody.position).add(cameraOffset);
  }
}

let x;
let y;
document.addEventListener("mousedown", (e) => {
  x = e.clientX;
  y = e.clientY;
});
document.addEventListener("mouseup", (e) => {
  const dx = e.clientX - x;
  const dy = e.clientY - y;

  const VELOCITY_FACTOR = 0.015;
  const mag = Math.sqrt(dx * dx + dy * dy);

  if (sphereBody.position.y < 0.3) {
    sphereBody.velocity.set(
      -dx * VELOCITY_FACTOR,
      mag * VELOCITY_FACTOR,
      -dy * VELOCITY_FACTOR
    );
  }
});

export default { create, animate };
