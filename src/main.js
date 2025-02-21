import { animate } from "motion";
import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";

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

// Create an empty BufferGeometry
const geometry = new THREE.BufferGeometry();

const count = 300;
const positionsArray = new Float32Array(count * 3 * 3);

for (let i = 0; i < count * 3 * 3; i++) {
  positionsArray[i] = Math.random() - 0.5;
}

const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3);
geometry.setAttribute("position", positionsAttribute);
// Object Settings

const cube = new THREE.BoxGeometry(1, 1, 1);

const material = new THREE.MeshBasicMaterial({
  color: "#ff0000",
  wireframe: true,
});

const mesh = new THREE.Mesh(geometry, material);

// const numberRotation = (number) => {
//   return number * (Math.PI / 180);
// };
scene.add(mesh);

// Camera Settings

const size = { width: window.innerWidth, height: window.innerHeight };

// Update size for screenSize
const updateSize = () => {
  size.width = window.innerWidth;
  size.height = window.innerHeight;

  // Update camera
  camera.aspect = size.width / size.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(size.width, size.height);

  // Mise à jour de la qualité de l'image en fonction des pixels de l'écran
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
};
window.addEventListener("resize", updateSize);

const camera = new THREE.PerspectiveCamera(75, size.width / size.height);

camera.position.set(0, 0, 2);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
// controls.target.x = 2;
// controls.update();

// LookAt
// camera.lookAt(mesh.position);

// Renderer(pour avoir un rendu)
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});

// Taille du rendu

renderer.setSize(size.width, size.height);

// Animations
const tick = () => {
  // Render
  renderer.render(scene, camera);

  // Update camera

  // camera.position.x = Math.sin(-cursor.x * Math.PI * 2) * 3;
  // camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3;
  // camera.position.y = cursor.y * 3;
  // camera.lookAt(mesh.position);

  // Update Controls
  controls.update();

  // Animation(activation)
  window.requestAnimationFrame(tick);
};
tick();
