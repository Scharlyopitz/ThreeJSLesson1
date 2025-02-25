import { animate } from "motion";
import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import GUI from "lil-gui";
import { RGBMLoader } from "three/examples/jsm/Addons.js";

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
  if (e.key === "h") {
    gui.show(gui._hidden);
  }
  if (e.key === "j") {
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

// MeshBasicMaterial
// const material = new THREE.MeshBasicMaterial({
//   // color: "#ff0000",
//   map: texture,
//   wireframe: false,
//   opacity: 0.5,
//   transparent: true,
//   // side: THREE.DoubleSide,
// });

// MeshNormalMaterial
// const material = new THREE.MeshNormalMaterial({ flatShading: true });

// MeshMatcapMaterial
// const material = new THREE.MeshMatcapMaterial({ matcap: texture });

// MeshLambertMaterial
// const material = new THREE.MeshLambertMaterial();

// MeshLambertMaterial
// const material = new THREE.MeshPhongMaterial({
//   shininess: 100,
//   specular: "#1188ff",
// });

// MeshToonMaterial
// const material = new THREE.MeshToonMaterial({ gradientMap: texture });

// MeshStandardMaterial
// const material = new THREE.MeshStandardMaterial({
//   metalness: 0.7,
//   roughness: 0.2,
//   map: texture,
//   aoMap: texture,
//   aoMapIntensity: 1,
//   displacementMap: texture,
//   displacementScale: 0.2,
//   metalnessMap: texture,
//   roughnessMap: texture,
//   normalMap: texture,
//   // transparent: true,
//   // alphaMap: texture,
// });

// MeshPhysicalMaterial
const material = new THREE.MeshPhysicalMaterial({
  metalness: 1,
  roughness: 1,
  map: texture,

  // Clearcoat
  // clearcoat: 1,
  // clearcoatRoughness: 0,
  //--------

  // Shenn
  sheen: 1,
  sheenRoughness: 0.25,
  // --------

  // aoMap: texture,
  // aoMapIntensity: 1,
  // displacementMap: texture,
  // displacementScale: 0.2,
  // metalnessMap: texture,
  // roughnessMap: texture,
  // normalMap: texture,
  // transparent: true,
  // alphaMap: texture,
});

const ambientLight = new THREE.AmbientLight("#fff", 1);

scene.add(ambientLight);

const pointLight = new THREE.PointLight("#fff", 30);
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;
scene.add(pointLight);

const rgbeLoader = new RGBMLoader();
rgbeLoader.load(URL, (evironementMAP) => {
  evironementMAP.mapping = THREE.EquirectangularReflectionMapping;

  scene.background = evironementMAP;
  scene.environment = evironementMAP;
});

const mesh = new THREE.Mesh(sphere, material);
mesh.position.set(-1.5, 0, 0);

const planeMesh = new THREE.Mesh(plane, material);

const torusMesh = new THREE.Mesh(torus, material);
torusMesh.position.set(1.5, 0, 0);

// Debug UI parameters
const tweakFolder = gui.addFolder("Nice Tweak");

tweakFolder.add(material, "metalness").min(0).max(1).step(0.001);
tweakFolder.add(material, "roughness").min(0).max(1).step(0.001);
// tweakFolder.add(material, "clearcoat").min(0).max(1).step(0.001);
// tweakFolder.add(material, "clearcoatRoughness").min(0).max(1).step(0.001);
tweakFolder.add(material, "sheen").min(0).max(1).step(0.001);
tweakFolder.add(material, "sheenRoughness").min(0).max(1).step(0.001);
tweakFolder.addColor(material, "sheenColor");

// cubeTweak.add(mesh.position, "y").min(-2).max(2).step(0.01);
// // cubeTweak.add(material, "wireframe");
// cubeTweak.addColor(debugObject, "color").onChange(() => {
//   material.color.set(debugObject.color);
// });

// // const animation = animate(
// //   mesh.rotation,
// //   { y: Math.PI * 2, x: Math.PI * 2 },
// //   { duration: 10, ease: "linear", repeat: Infinity }
// // );
// // animation.pause();

// // debugObject.start = () => {
// //   animation.play();
// // };

// // debugObject.stop = () => {
// //   animation.pause();
// // };

// // cubeTweak.add(debugObject, "start");
// // cubeTweak.add(debugObject, "stop");
// debugObject.subdivision = 2;
// cubeTweak
//   .add(debugObject, "subdivision")
//   .min(1)
//   .max(20)
//   .step(1)
//   .onFinishChange(() => {
//     mesh.geometry.dispose();
//     mesh.geometry = new THREE.BoxGeometry(
//       1,
//       1,
//       1,
//       debugObject.subdivision,
//       debugObject.subdivision,
//       debugObject.subdivision
//     );
//   });

// const numberRotation = (number) => {
//   return number * (Math.PI / 180);
// };
scene.add(mesh, planeMesh, torusMesh);

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

  const elapsTime = clock.getElapsedTime();

  mesh.rotation.y = 0.1 * elapsTime;
  planeMesh.rotation.y = 0.1 * elapsTime;
  torusMesh.rotation.y = 0.1 * elapsTime;

  // Update Controls
  controls.update();

  // Animation(activation)
  window.requestAnimationFrame(tick);
};
tick();
