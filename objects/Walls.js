import * as THREE from "three";
import * as CANNON from "cannon-es";

function create(world) {
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
  const wallHeight = 50;
  const wallLength = 50;

  // Create an array to hold the walls and their corresponding meshes
  const walls = [];
    // const wallMeshes = [];

  // Function to create a wall
  function createWall(position, size) {
    const wall = new CANNON.Body({
      mass: 0,
      shape: new CANNON.Box(
        new CANNON.Vec3(size.x / 2, size.y / 2, size.z / 2)
      ),
      material: groundMaterial,
    });
    wall.position.copy(position);
    world.addBody(wall);
    walls.push(wall);

    // Mesh for the wall
        // const wallGeometry = new THREE.BoxGeometry(size.x, size.y, size.z);
        // const wallMaterial = new THREE.MeshBasicMaterial({
        //   color: 0x888888,
        //   wireframe: true,
        // });
        // const wallMesh = new THREE.Mesh(wallGeometry, wallMaterial);
        // wallMesh.position.copy(position);
        // scene.add(wallMesh);
        // wallMeshes.push(wallMesh);
  }

  // Create walls

  // Front wall
  createWall(
    new CANNON.Vec3(0, wallHeight / 2, -38),
    new CANNON.Vec3(wallLength * 2, wallHeight, wallThickness)
  );
  // Back wall
  createWall(
    new CANNON.Vec3(0, wallHeight / 2, 41),
    new CANNON.Vec3(wallLength * 2, wallHeight, wallThickness)
  );
  // Right wall
  createWall(
    new CANNON.Vec3(-20.5, wallHeight / 2, 0),
    new CANNON.Vec3(wallThickness, wallHeight, wallLength * 2)
  );
  // Left wall
  createWall(
    new CANNON.Vec3(20.5, wallHeight / 2, 0),
    new CANNON.Vec3(wallThickness, wallHeight, wallLength * 2)
  );
  // Upper Wall
  createWall(
    new CANNON.Vec3(0, wallHeight + wallThickness / 2, 0),
    new CANNON.Vec3(wallLength * 2, wallThickness, wallLength * 2)
  );

  // Synchronize CANNON bodies with THREE.js meshes
    // function updateMeshes() {
    //   for (let i = 0; i < walls.length; i++) {
    //     walls[i].position.copy(walls[i].position);
    //     walls[i].quaternion.copy(walls[i].quaternion);
    //   }
    // }

  function animate() {
    requestAnimationFrame(animate);
    world.step(1 / 60);
    // updateMeshes();
  }
  animate();
}

export default { create };
