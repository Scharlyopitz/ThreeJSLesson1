import { animate } from "motion";
import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import GUI from "lil-gui";

// Texture

const URL = "/Midwam.png";

const loadingManager = new THREE.LoadingManager();

// loadingManager.onStart = () => {
//   console.log("start");
// };
// loadingManager.onLoad = () => {
//   console.log("load");
// };
// loadingManager.onProgress = () => {
//   console.log("progress");
// };
// loadingManager.onError = () => {
//   console.log("error");
// };

const texture = new THREE.TextureLoader(loadingManager).load(URL);
texture.colorSpace = THREE.SRGBColorSpace;

// Debug
const gui = new GUI({
  width: 360,
  title: "Debug UI Scharly",
});
const debugObject = {};

const pressToHide = (e) => {
  const minisculKey = e.key.toLowerCase();
  if (minisculKey === "h") {
    gui.show(gui._hidden);
  }
  if (minisculKey === "j") {
    gui.open(gui._closed);
  }
};

gui.close();

window.addEventListener("keydown", pressToHide);

// Canvas
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

debugObject.color = "#ff0000";

const cube = new THREE.BoxGeometry(1, 1, 1);
const plane = new THREE.PlaneGeometry(1, 1, 20, 20);
const torus = new THREE.TorusGeometry(0.5, 0.2, 16, 32);
const sphere = new THREE.SphereGeometry(0.5, 15, 16);

const material = new THREE.MeshBasicMaterial({
  color: "red",
  wireframe: false,
});

const mesh = new THREE.Mesh(cube, material);

// Debug UI parameters
const guiFolder = gui.addFolder("Nice Tweak");

guiFolder.add(material, "wireframe");

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

const clock = new THREE.Clock();

// Animations
const tick = () => {
  // Render
  renderer.render(scene, camera);

  // Update Controls
  controls.update();

  // Animation(activation)
  window.requestAnimationFrame(tick);
};
tick();
