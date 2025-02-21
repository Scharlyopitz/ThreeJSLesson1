import "./style.css";
import * as THREE from "three";

const canvas = document.querySelector(".webgl");

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

const animateCube = (e) => {
  cube.rotation.x = numberRotation(e.clientY);
  cube.rotation.y = numberRotation(e.clientX);
};

window.addEventListener("mousemove", animateCube);

scene.add(cube);

// Camera Settings

const size = { width: window.innerWidth, height: window.innerHeight };

const camera = new THREE.PerspectiveCamera(75, size.width / size.height);

camera.position.set(0, 0, 3);
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

  // Animation(activation)
  window.requestAnimationFrame(tick);
};
tick();
