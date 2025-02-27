import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import GUI from "lil-gui";
import { FontLoader } from "three/examples/jsm/Addons.js";
import { TextGeometry } from "three/examples/jsm/Addons.js";
import { RectAreaLightHelper } from "three/addons/helpers/RectAreaLightHelper.js";

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
// function TextFont() {
//   const fontLoader = new FontLoader();

//   fontLoader.load("../assets/font.json", (font) => {
//     const textType = "Swaco";

//     const textGeometry = new TextGeometry(textType, {
//       font: font,
//       size: 0.5,
//       depth: 0.2,
//       curveSegments: 6,
//       bevelEnabled: true,
//       bevelThickness: 0.03,
//       bevelSize: 0.02,
//       bevelOffset: 0,
//       bevelSegments: 5,
//     });

//     textGeometry.center();

//     const text = new THREE.Mesh(textGeometry, material);

//     scene.add(text);
//   });
// }

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
const plane = new THREE.PlaneGeometry(
  5,
  5
  //  20, 20
);
const torus = new THREE.TorusGeometry(0.5, 0.2, 16, 32);
const sphere = new THREE.SphereGeometry(0.5, 15, 16);

const material = new THREE.MeshStandardMaterial({
  wireframe: false,
  roughness: 0.7,
});

const mesh = new THREE.Mesh(cube, material);
const torusMesh = new THREE.Mesh(torus, material);
torusMesh.position.x = 1.5;

const sphereMesh = new THREE.Mesh(sphere, material);
// sphereMesh.position.x = -1.5;

const planeMesh = new THREE.Mesh(plane, material);
planeMesh.position.y = -0.5;
planeMesh.rotation.x = Math.PI / -2;

scene.add(sphereMesh, planeMesh);

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

// Shadows
function Shadows() {
  const ambientLight = new THREE.AmbientLight(0xffffff, 1);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
  directionalLight.position.set(2, 2, -1);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 1024;
  directionalLight.shadow.mapSize.height = 1024;

  // Réglage caméra proche et loin
  directionalLight.shadow.camera.near = 1;
  directionalLight.shadow.camera.far = 7;

  const directionalLightCameraHelper = new THREE.CameraHelper(
    directionalLight.shadow.camera
  );

  guiFolder.add(directionalLight, "intensity").min(0).max(1).step(0.001);
  guiFolder.add(directionalLight.position, "x").min(-5).max(5).step(0.001);
  guiFolder.add(directionalLight.position, "y").min(-5).max(5).step(0.001);
  guiFolder.add(directionalLight.position, "z").min(-5).max(5).step(0.001);

  sphereMesh.castShadow = true;

  planeMesh.receiveShadow = true;

  scene.add(ambientLight, directionalLight, directionalLightCameraHelper);
}
Shadows();

// Light
// function Lights() {
//   const ambientLight = new THREE.AmbientLight(0xffffff, 1);

//   const directionalLight = new THREE.DirectionalLight(0x00fffc, 2);
//   directionalLight.position.set(1, 0.25, 0);

//   const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.9);

//   const pointLight = new THREE.PointLight(0xff9000, 0.5, 0, 2);
//   pointLight.position.set(1, -0.5, 1);

//   const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 6, 1, 1);
//   rectAreaLight.position.set(-1.5, 0, 2);
//   rectAreaLight.lookAt(new THREE.Vector3());

//   const spotLight = new THREE.SpotLight(
//     0x78ff00,
//     4.5,
//     10,
//     Math.PI * 0.1,
//     0.25,
//     1
//   );
//   spotLight.position.set(3, 1, 3);

//   spotLight.target.position.set(0, -2.5, 0);

//   // Helper
//   const hemisphereLightHelper = new THREE.HemisphereLightHelper(
//     hemisphereLight,
//     0.2
//   );
//   const directionalLightHelper = new THREE.DirectionalLightHelper(
//     directionalLight,
//     0.2
//   );
//   const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2);

//   const spotLightHelper = new THREE.SpotLightHelper(spotLight, 0.2);

//   const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight);

//   scene.add(
//     ambientLight,
//     directionalLight,
//     hemisphereLight,
//     pointLight,
//     rectAreaLight,
//     spotLight,
//     spotLight.target,
//     hemisphereLightHelper,
//     directionalLightHelper,
//     pointLightHelper,
//     spotLightHelper,
//     rectAreaLightHelper
//   );

//   // GUI Folder
//   guiFolder.add(ambientLight, "intensity").min(1).max(3).step(0.01);
//   guiFolder.add(directionalLight, "intensity").min(1).max(5).step(0.01);
// }

// Donuts

// function Donuts() {
//   // const axesHelper = new THREE.AxesHelper();
//   const donutsGeometry = new THREE.TorusGeometry(0.3, 0.15, 20, 45);

//   const params = {
//     textureMap: PaperTexture,
//   };

//   const donutMaterial = new THREE.MeshMatcapMaterial({
//     // color: "red",
//     matcap: params.textureMap,
//   });

//   const numberOfDonuts = 100;

//   [...Array(numberOfDonuts)].map(() => {
//     const donut = new THREE.Mesh(donutsGeometry, donutMaterial);

//     donut.position.x = (Math.random() - 0.5) * 5;
//     donut.position.y = (Math.random() - 0.5) * 5;
//     donut.position.z = (Math.random() - 0.5) * 5;

//     donut.rotation.x = Math.random() * Math.PI;
//     donut.rotation.y = Math.random() * Math.PI;

//     const scale = Math.random();

//     donut.scale.x = scale;
//     donut.scale.y = scale;
//     donut.scale.z = scale;

//     scene.add(donut);
//   });

//   guiFolder.addColor(donutMaterial, "color");
//   guiFolder
//     .add(params, "textureMap", {
//       Midwam: MidwamTexture,
//       Gold: GoldTexture,
//       Paper: PaperTexture,
//     })
//     .onChange(() => {
//       donutMaterial.matcap = params.textureMap;
//     });
// }

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

// Renderer(pour avoir un rendu)
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
  alpha: true,
});

// Handle shadowMap
renderer.shadowMap.enabled = true;

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
