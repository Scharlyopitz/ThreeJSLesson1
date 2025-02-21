import { animate } from "motion";
import "./style.css";
import * as THREE from "three";

const canvas = document.querySelector(".webgl");

// Cursor

const cursor = {
  x: 0,
  y: 0,
};

const mouseMoove = (e) => {
  cursor.x = e.clientX / size.width - 0.5;
  cursor.y = e.clientY / size.height - 0.5;
};
window.addEventListener("mousemove", mouseMoove);

// Scene
const scene = new THREE.Scene();

// Object Settings

const cube = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: "#ff0000" })
);

const numberRotation = (number) => {
  return number * (Math.PI / 180);
};

// animate(
//   cube.rotation,
//   {
//     y: numberRotation(360),
//   },
//   { duration: 10, repeat: Infinity, ease: "linear" }
// );

scene.add(cube);

// Camera Settings

const size = { width: window.innerWidth, height: window.innerHeight };

const camera = new THREE.PerspectiveCamera(75, size.width / size.height);

// const aspectRatio = size.width / size.height;
// const camera = new THREE.OrthographicCamera(
//   -1 * aspectRatio,
//   1 * aspectRatio,
//   1,
//   -1,
//   0.1,
//   100
// );

camera.position.set(0, 0, 2);
scene.add(camera);

// LookAt
// camera.lookAt(mesh.position);

// Renderer(pour avoir un rendu)
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});

// Taille du rendu
renderer.setSize(window.innerWidth, window.innerHeight);

// Animations
const tick = () => {
  // Render
  renderer.render(scene, camera);

  // Update camera

  camera.position.x = Math.sin(-cursor.x * Math.PI * 2) * 3;
  camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3;
  camera.position.y = cursor.y * 3;
  camera.lookAt(cube.position);

  // Animation(activation)
  window.requestAnimationFrame(tick);
};
tick();
