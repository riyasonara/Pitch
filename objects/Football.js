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

  // Create boundaries
  const groundMaterial = new CANNON.Material("groundMaterial");

  // Create ground plane
  const groundBody = new CANNON.Body({
    mass: 0,
    shape: new CANNON.Plane(),
    material: groundMaterial,
  });
  groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
  world.addBody(groundBody);

  // Create boundary walls
  const wallThickness = 1;
  const wallHeight = 10;
  const wallLength = 50;

  // Front wall
  const frontWall = new CANNON.Body({
    mass: 0,
    shape: new CANNON.Box(
      new CANNON.Vec3(wallLength, wallHeight, wallThickness)
    ),
    material: groundMaterial,
  });
  frontWall.position.set(0, wallHeight / 2, -wallLength);
  world.addBody(frontWall);

  // Back wall
  const backWall = new CANNON.Body({
    mass: 0,
    shape: new CANNON.Box(
      new CANNON.Vec3(wallLength, wallHeight, wallThickness)
    ),
    material: groundMaterial,
  });
  backWall.position.set(0, wallHeight / 2, wallLength);
  world.addBody(backWall);

  // Left wall
  const leftWall = new CANNON.Body({
    mass: 0,
    shape: new CANNON.Box(
      new CANNON.Vec3(wallThickness, wallHeight, wallLength)
    ),
    material: groundMaterial,
  });
  leftWall.position.set(-wallLength, wallHeight / 2, 0);
  world.addBody(leftWall);

  // Right wall
  const rightWall = new CANNON.Body({
    mass: 0,
    shape: new CANNON.Box(
      new CANNON.Vec3(wallThickness, wallHeight, wallLength)
    ),
    material: groundMaterial,
  });
  rightWall.position.set(wallLength, wallHeight / 2, 0);
  world.addBody(rightWall);
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
