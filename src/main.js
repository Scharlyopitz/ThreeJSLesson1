import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import GUI from "lil-gui";
import { FontLoader } from "three/examples/jsm/Addons.js";
import { TextGeometry } from "three/examples/jsm/Addons.js";

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

const texture = new THREE.TextureLoader(loadingManager);

const MidwamTexture = texture.load(URL);
MidwamTexture.colorSpace = THREE.SRGBColorSpace;

const GoldTexture = texture.load("/gold.png");
GoldTexture.colorSpace = THREE.SRGBColorSpace;

const PaperTexture = texture.load("/paper.png");
PaperTexture.colorSpace = THREE.SRGBColorSpace;

// Fonts
// const fontLoader = new FontLoader();

// fontLoader.load("../assets/font.json", (font) => {
//   const textType = "Swaco";

//   const textGeometry = new TextGeometry(textType, {
//     font: font,
//     size: 0.5,
//     depth: 0.2,
//     curveSegments: 6,
//     bevelEnabled: true,
//     bevelThickness: 0.03,
//     bevelSize: 0.02,
//     bevelOffset: 0,
//     bevelSegments: 5,
//   });

//   // textGeometry.computeBoundingBox();
//   // textGeometry.translate(
//   //   -(textGeometry.boundingBox.max.x - 0.02) * 0.5,
//   //   -(textGeometry.boundingBox.max.y - 0.02) * 0.5,
//   //   -(textGeometry.boundingBox.max.z - 0.03) * 0.5
//   // );

//   textGeometry.center();

//   const text = new THREE.Mesh(textGeometry, material);

//   // scene.add(text);
// });

// Debug
const gui = new GUI({
  width: 360,
  title: "Debug UI Scharly",
});
const debugObject = {};

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

// const mesh = new THREE.Mesh(cube, material);
// scene.add(mesh);

// Debug UI parameters
const guiFolder = gui.addFolder("Nice Tweak");

const pressToHide = (e) => {
  const minisculKey = e.key.toLowerCase();
  if (minisculKey === "h") {
    gui.show(gui._hidden);
  }
  if (minisculKey === "j") {
    guiFolder.open(guiFolder._closed);
  }
};

window.addEventListener("keydown", pressToHide);

guiFolder.close();

// const numberRotation = (number) => {
//   return number * (Math.PI / 180);
// };

// Donuts

// const axesHelper = new THREE.AxesHelper();

const donutsGeometry = new THREE.TorusGeometry(0.3, 0.15, 20, 45);

const params = {
  background: "#444444",
  textureMap: PaperTexture,
};

scene.background = new THREE.Color(params.background);

const donutMaterial = new THREE.MeshMatcapMaterial({
  // color: "red",
  matcap: params.textureMap,
});

for (let i = 0; i < 100; i++) {
  const donut = new THREE.Mesh(donutsGeometry, donutMaterial);

  donut.position.x = (Math.random() - 0.5) * 5;
  donut.position.y = (Math.random() - 0.5) * 5;
  donut.position.z = (Math.random() - 0.5) * 5;

  donut.rotation.x = Math.random() * Math.PI;
  donut.rotation.y = Math.random() * Math.PI;

  const scale = Math.random();

  donut.scale.x = scale;
  donut.scale.y = scale;
  donut.scale.z = scale;

  scene.add(donut);
}

guiFolder.addColor(params, "background").onChange((e) => {
  scene.background = new THREE.Color(params.background);
});

guiFolder.addColor(donutMaterial, "color");
guiFolder
  .add(params, "textureMap", {
    Midwam: MidwamTexture,
    Gold: GoldTexture,
    Paper: PaperTexture,
  })
  .onChange(() => {
    donutMaterial.matcap = params.textureMap;
  });

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
  alpha: true,
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
