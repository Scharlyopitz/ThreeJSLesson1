import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import GUI from "lil-gui";
import { FontLoader } from "three/examples/jsm/Addons.js";
import { TextGeometry } from "three/examples/jsm/Addons.js";
import { RectAreaLightHelper } from "three/addons/helpers/RectAreaLightHelper.js";
import { Group } from "three/examples/jsm/libs/tween.module.js";

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

// const cursor = {
//   x: 0,
//   y: 0,
// };

// const mouseMoove = (e) => {
//   cursor.x = e.clientX / size.width - 0.5;
//   cursor.y = e.clientY / size.height - 0.5;
// };
// window.addEventListener("mousemove", mouseMoove);

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

const material = new THREE.MeshBasicMaterial({
  wireframe: false,
  // roughness: 0.7,
});

const mesh = new THREE.Mesh(cube, material);
const torusMesh = new THREE.Mesh(torus, material);
torusMesh.position.x = 1.5;

const sphereMesh = new THREE.Mesh(sphere, material);
// sphereMesh.position.x = -1.5;

const planeMesh = new THREE.Mesh(plane, material);
planeMesh.position.y = -0.5;
planeMesh.rotation.x = Math.PI / -2;

// scene.add(sphereMesh);

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

// const numberRotation = (number) => {
//   return number * (Math.PI / 180);
// };

// Galaxy

function Galaxy() {
  const parameters = {
    count: 100000,
    size: 0.01,
    radius: 5,
    branches: 3,
    spin: -4,
    randomness: 0.2,
    randomnessPower: 5,
    insideColor: "#ff6030",
    outsideColor: "#1b3984",
  };

  let particleGeometry = null;
  let particuleMaterial = null;
  let particule = null;

  const generateGalaxy = () => {
    if (particule !== null) {
      particleGeometry.dispose();
      particuleMaterial.dispose();
      scene.remove(particule);
    }

    const position = new Float32Array(parameters.count * 3);
    const colors = new Float32Array(parameters.count * 3);

    const colorInside = new THREE.Color(parameters.insideColor);
    const colorOutside = new THREE.Color(parameters.outsideColor);

    [...Array(parameters.count)].map((_, i) => {
      const i3 = i * 3;
      // Position
      const radius = Math.random() * parameters.radius;
      const branchAngle =
        ((i % parameters.branches) / parameters.branches) * Math.PI * 2;
      const spinAngle = radius * parameters.spin;

      const randomX =
        Math.pow(Math.random(), parameters.randomnessPower) *
        (Math.random() < 0.5 ? 1 : -1) *
        radius *
        parameters.randomness;
      const randomY =
        Math.pow(Math.random(), parameters.randomnessPower) *
        (Math.random() < 0.5 ? 1 : -1) *
        radius *
        parameters.randomness;
      const randomZ =
        Math.pow(Math.random(), parameters.randomnessPower) *
        (Math.random() < 0.5 ? 1 : -1) *
        radius *
        parameters.randomness;

      position[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
      position[i3 + 1] = randomY;
      position[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

      // Color
      const mixedColor = colorInside.clone();
      mixedColor.lerp(colorOutside, radius / parameters.radius);

      colors[i3] = mixedColor.r;
      colors[i3 + 1] = mixedColor.g;
      colors[i3 + 2] = mixedColor.b;
    });

    particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(position, 3)
    );
    particleGeometry.setAttribute(
      "color",
      new THREE.Float32BufferAttribute(colors, 3)
    );

    particuleMaterial = new THREE.PointsMaterial({
      size: parameters.size,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
    });

    particule = new THREE.Points(particleGeometry, particuleMaterial);
    scene.add(particule);
  };
  generateGalaxy();

  // FOLDER

  guiFolder
    .add(parameters, "count")
    .min(0)
    .max(200000)
    .step(1)
    .onFinishChange(generateGalaxy);
  guiFolder
    .add(parameters, "size")
    .min(0.01)
    .max(0.1)
    .step(0.001)
    .onFinishChange(generateGalaxy);
  guiFolder
    .add(parameters, "radius")
    .min(1)
    .max(20)
    .step(0.001)
    .onFinishChange(generateGalaxy);
  guiFolder
    .add(parameters, "branches")
    .min(2)
    .max(15)
    .step(1)
    .onFinishChange(generateGalaxy);
  guiFolder
    .add(parameters, "spin")
    .min(-5)
    .max(5)
    .step(0.01)
    .onFinishChange(generateGalaxy);
  guiFolder
    .add(parameters, "randomness")
    .min(0)
    .max(2)
    .step(0.01)
    .onFinishChange(generateGalaxy);
  guiFolder
    .add(parameters, "randomnessPower")
    .min(1)
    .max(10)
    .step(0.01)
    .onFinishChange(generateGalaxy);
  guiFolder
    .addColor(parameters, "insideColor")
    .min(1)
    .max(10)
    .step(0.01)
    .onFinishChange(generateGalaxy);
  guiFolder
    .addColor(parameters, "outsideColor")
    .min(1)
    .max(10)
    .step(0.01)
    .onFinishChange(generateGalaxy);
}
Galaxy();

// Particle
// function Particles() {
//   const geometry = new THREE.BufferGeometry();
//   const numberOfParticles = 5000;

//   const position = new Float32Array(numberOfParticles * 3);
//   const colorsArray = new Float32Array(numberOfParticles * 3);

//   geometry.setAttribute("position", new THREE.BufferAttribute(position, 3));
//   geometry.setAttribute("color", new THREE.BufferAttribute(colorsArray, 3));
//   const particleMaterial = new THREE.PointsMaterial({
//     size: 0.1,
//     sizeAttenuation: true,
//     // map: MidwamTexture,
//   });
//   const particle = new THREE.Points(geometry, particleMaterial);

//   [...Array(numberOfParticles)].map((_, i) => {
//     position[i] = (Math.random() - 0.5) * 10;
//     colorsArray[i] = Math.random();
//   });

//   particleMaterial.vertexColors = true;

//   scene.add(particle);
// }

// Haunted House
// function HauntedHouse() {
//   // Floor
//   const floor = new THREE.Mesh(
//     new THREE.PlaneGeometry(20, 20),
//     new THREE.MeshStandardMaterial({ color: "black" })
//   );
//   floor.rotation.set(-Math.PI * 0.5, 0, 0);

//   // House container
//   const house = new THREE.Group();

//   const walls = new THREE.Mesh(
//     new THREE.BoxGeometry(4, 2.5, 4),
//     new THREE.MeshStandardMaterial({
//       // opacity: 0.3,
//       // transparent: true,
//     })
//   );
//   walls.position.y = 1.25;

//   const roof = new THREE.Mesh(
//     new THREE.ConeGeometry(3.5, 1.5, 4),
//     new THREE.MeshStandardMaterial()
//   );
//   roof.position.set(0, 2.5 + 1.5 / 2, 0);
//   roof.rotation.set(0, Math.PI * 0.25, 0);

//   const door = new THREE.Mesh(
//     new THREE.PlaneGeometry(1.5, 2),
//     new THREE.MeshStandardMaterial({
//       color: "red",
//     })
//   );
//   door.position.set(0, 1, 2 + 0.01);

//   // Bushes
//   const bushGeometry = new THREE.SphereGeometry(2, 15, 16);
//   const bushMaterial = new THREE.MeshStandardMaterial();

//   const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
//   bush1.scale.set(0.25, 0.25, 0.25);
//   bush1.position.set(1, 0.2, 2.2);

//   const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
//   bush2.scale.set(0.2, 0.2, 0.2);
//   bush2.position.set(1.6, 0.1, 2.1);

//   const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
//   bush3.scale.set(0.3, 0.3, 0.3);
//   bush3.position.set(-1.1, 0.1, 2.2);

//   const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
//   bush4.scale.set(0.15, 0.15, 0.15);
//   bush4.position.set(-1.4, 0.05, 2.6);

//   const numberOfGraves = 30;
//   const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);
//   const graveMaterial = new THREE.MeshStandardMaterial();

//   // Graves
//   const graves = new THREE.Group();

//   [...Array(numberOfGraves)].map(() => {
//     const grave = new THREE.Mesh(graveGeometry, graveMaterial);
//     const angle = Math.random() * Math.PI * 2;

//     const radius = 4 + Math.random() * 4;

//     const x = Math.cos(angle) * radius;
//     const z = Math.sin(angle) * radius;

//     grave.position.x = x;
//     grave.position.y = Math.random() * 0.4;
//     grave.position.z = z;
//     grave.rotation.x = (Math.random() - 0.5) * 0.4;
//     grave.rotation.y = (Math.random() - 0.5) * 0.4;
//     grave.rotation.z = (Math.random() - 0.5) * 0.4;

//     graves.add(grave);
//   });

//   house.add(bush1, bush2, bush3, bush4);
//   house.add(walls, roof, door, graves);

//   // Ambient Light
//   const ambientLight = new THREE.AmbientLight("#ffffff", 1);

//   // DirectionalLight
//   const directionalLight = new THREE.DirectionalLight("#ffffff", 1);
//   const directionalLightHelper = new THREE.DirectionalLightHelper(
//     directionalLight
//   );
//   directionalLightHelper.visible = false;

//   // Ghosts

//   const ghostBasicPosition = {
//     y: 0.056,
//   };

//   console.log(ghostBasicPosition.y);

//   const ghost1 = new THREE.PointLight("#8800ff", 6);
//   ghost1.position.set(-5, ghostBasicPosition.y, 0);

//   const ghost2 = new THREE.PointLight("#2516f4", 6);
//   ghost2.position.set(0, ghostBasicPosition.y, 5);

//   const ghost3 = new THREE.PointLight("#dd16f4", 6);
//   ghost3.position.set(5, ghostBasicPosition.y, 0);

//   house.add(ghost1, ghost2, ghost3);

//   // Folder
//   function GhostsFolder() {
//     const ghostsFolder = guiFolder.addFolder("Ghosts");

//     const ghost1folder = ghostsFolder.addFolder("ghost1");
//     ghost1folder.close();
//     ghost1folder.add(ghost1.position, "x").min(-5).max(5).step(0.001);
//     ghost1folder.add(ghost1.position, "y").min(-5).max(5).step(0.001);
//     ghost1folder.add(ghost1.position, "z").min(-5).max(5).step(0.001);
//     ghost1folder.add(ghost1, "intensity").min(1).max(10).step(0.001);

//     const ghost2folder = ghostsFolder.addFolder("ghost2");
//     ghost2folder.close();
//     ghost2folder.add(ghost2.position, "x").min(-5).max(5).step(0.001);
//     ghost2folder.add(ghost2.position, "y").min(-5).max(5).step(0.001);
//     ghost2folder.add(ghost2.position, "z").min(-5).max(5).step(0.001);
//     ghost2folder.add(ghost2, "intensity").min(1).max(10).step(0.001);

//     const ghost3folder = ghostsFolder.addFolder("ghost3");
//     ghost3folder.close();
//     ghost3folder.add(ghost3.position, "x").min(-5).max(5).step(0.001);
//     ghost3folder.add(ghost3.position, "y").min(-5).max(5).step(0.001);
//     ghost3folder.add(ghost3.position, "z").min(-5).max(5).step(0.001);
//     ghost3folder.add(ghost3, "intensity").min(1).max(10).step(0.001);
//   }
//   GhostsFolder();

//   function BushesFolder() {
//     const bushesFolder = guiFolder.addFolder("Bushes Parameters");
//     bushesFolder.close();
//     const bush1Folder = bushesFolder.addFolder("Bush 1");
//     bush1Folder.close();
//     bush1Folder.add(bush1.position, "x").min(-5).max(5).step(0.001);
//     bush1Folder.add(bush1.position, "y").min(-5).max(5).step(0.001);
//     bush1Folder.add(bush1.position, "z").min(-5).max(5).step(0.001);

//     const bush2Folder = bushesFolder.addFolder("Bush 2");
//     bush2Folder.close();
//     bush2Folder.add(bush2.position, "x").min(-5).max(5).step(0.001);
//     bush2Folder.add(bush2.position, "y").min(-5).max(5).step(0.001);
//     bush2Folder.add(bush2.position, "z").min(-5).max(5).step(0.001);

//     const bush3Folder = bushesFolder.addFolder("Bush 3");
//     bush3Folder.close();
//     bush3Folder.add(bush3.position, "x").min(-5).max(5).step(0.001);
//     bush3Folder.add(bush3.position, "y").min(-5).max(5).step(0.001);
//     bush3Folder.add(bush3.position, "z").min(-5).max(5).step(0.001);

//     const bush4Folder = bushesFolder.addFolder("Bush 4");
//     bush4Folder.close();
//     bush4Folder.add(bush4.position, "x").min(-5).max(5).step(0.001);
//     bush4Folder.add(bush4.position, "y").min(-5).max(5).step(0.001);
//     bush4Folder.add(bush4.position, "z").min(-5).max(5).step(0.001);
//   }

//   function AmbientLightFolder() {
//     const ambientLightFolder = guiFolder.addFolder("ambientLightFolder");
//     ambientLightFolder.close();
//     ambientLightFolder.add(ambientLight, "intensity").min(0).max(2).step(0.001);
//     ambientLightFolder
//       .add(ambientLight.position, "x")
//       .min(-5)
//       .max(5)
//       .step(0.001);
//     ambientLightFolder
//       .add(ambientLight.position, "y")
//       .min(-5)
//       .max(5)
//       .step(0.001);
//     ambientLightFolder
//       .add(ambientLight.position, "z")
//       .min(-5)
//       .max(5)
//       .step(0.001);
//   }

//   function DirectionalLightFolder() {
//     const directionalLightFolder = guiFolder.addFolder(
//       "directionalLightFolder"
//     );
//     directionalLightFolder.close();
//     directionalLightFolder.add(directionalLightHelper, "visible");
//     directionalLightFolder
//       .add(directionalLight, "intensity")
//       .min(0)
//       .max(2)
//       .step(0.001);
//     directionalLightFolder
//       .add(directionalLight.position, "x")
//       .min(-5)
//       .max(5)
//       .step(0.001);
//     directionalLightFolder
//       .add(directionalLight.position, "y")
//       .min(-5)
//       .max(5)
//       .step(0.001);
//     directionalLightFolder
//       .add(directionalLight.position, "z")
//       .min(-5)
//       .max(5)
//       .step(0.001);
//   }

//   // SceneADD
//   scene.add(
//     house,
//     floor,
//     ambientLight,
//     directionalLight,
//     directionalLightHelper
//   );
// }

// Shadows
// function Shadows() {
//   const ambientLight = new THREE.AmbientLight(0xffffff, 1);

//   const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
//   directionalLight.position.set(0.891, 1.713, 2.385);
//   directionalLight.castShadow = true;
//   directionalLight.shadow.mapSize.width = 1024;
//   directionalLight.shadow.mapSize.height = 1024;

//   // Position
//   directionalLight.shadow.camera.top = 2;
//   // directionalLight.shadow.camera.bottom = 2;
//   directionalLight.shadow.camera.left = -2;
//   // directionalLight.shadow.camera.right = -2;

//   // Réglage caméra proche et loin
//   directionalLight.shadow.camera.near = 1;
//   directionalLight.shadow.camera.far = 6;

//   // directionalLight.shadow.radius = 10;

//   const directionalLightCameraHelper = new THREE.CameraHelper(
//     directionalLight.shadow.camera
//   );
//   directionalLightCameraHelper.visible = false;

//   // Spotlight
//   const spotLight = new THREE.SpotLight(0xffffff, 3.6, 10, Math.PI * 0.3);
//   spotLight.castShadow = true;
//   spotLight.position.set(0, 2, 2);
//   spotLight.shadow.mapSize.width = 1024;
//   spotLight.shadow.mapSize.height = 1024;
//   spotLight.shadow.camera.fov = 30;
//   spotLight.shadow.camera.near = 2;
//   spotLight.shadow.camera.far = 5;

//   const spotLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera);
//   spotLightCameraHelper.visible = false;

//   // PointLight
//   const pointLight = new THREE.PointLight(0xffffff, 2.7);
//   pointLight.castShadow = true;
//   pointLight.shadow.mapSize.width = 1024;
//   pointLight.shadow.mapSize.height = 1024;
//   pointLight.shadow.camera.near = 0.1;
//   pointLight.shadow.camera.far = 5;
//   pointLight.position.set(-1, 1, 0);

//   const pointLightHelper = new THREE.CameraHelper(pointLight.shadow.camera);
//   pointLightHelper.visible = false;

//   // GUI ShadowsFolders

//   const shadowsFolder = guiFolder.addFolder("Directional Light Parameters");
//   shadowsFolder.add(directionalLightCameraHelper, "visible");
//   shadowsFolder.add(directionalLight, "intensity").min(0).max(1).step(0.001);
//   shadowsFolder.add(directionalLight.position, "x").min(-5).max(5).step(0.001);
//   shadowsFolder.add(directionalLight.position, "y").min(-5).max(5).step(0.001);
//   shadowsFolder.add(directionalLight.position, "z").min(-5).max(5).step(0.001);

//   const pointerLightFolder = guiFolder.addFolder("Pointer Light");
//   pointerLightFolder.add(pointLightHelper, "visible");
//   pointerLightFolder.add(pointLight.position, "x").min(-5).max(5).step(0.001);
//   pointerLightFolder.add(pointLight.position, "y").min(-5).max(5).step(0.001);
//   pointerLightFolder.add(pointLight.position, "z").min(-5).max(5).step(0.001);

//   // -----

//   sphereMesh.castShadow = true;

//   planeMesh.receiveShadow = true;

//   scene.add(
//     ambientLight,
//     directionalLight,
//     directionalLightCameraHelper,
//     spotLight,
//     spotLight.target,
//     spotLightCameraHelper,
//     pointLight,
//     pointLightHelper
//   );
// }

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

camera.position.set(0, 0, 3);
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
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

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
