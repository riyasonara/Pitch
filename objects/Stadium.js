import * as CANNON from "cannon-es";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

function create(scene, world, loader) {
  // CREATE SURFACE / GROUND
  const groundBody = new CANNON.Body({
    mass: 0, // if any object falls on this it remains static (i.e. it doesn't move)
    material: new CANNON.Material("ground"),
    shape: new CANNON.Plane(),
  });
  groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
  groundBody.material.restitution = 0.8;
  world.addBody(groundBody);

  // ADDING GLTF LOADER FOR STADIUM
  loader.load("stadium/scene.json", (gltf) => {
    const stadium = gltf.scene;
    const scale = 2;
    stadium.scale.set(scale, scale, scale);
    stadium.position.set(23.5, -1.1, 45);
    stadium.rotation.y = Math.PI / 2;
    scene.add(gltf.scene);
  });
}
export default { create };
