import * as THREE from "three";

const canvas = document.querySelector(".webgl");

// Scene
const scene = new THREE.Scene();

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({
  color: "#ffffff",
  wireframe: false,
});
const mesh = new THREE.Mesh(geometry, material);
mesh.position.set(0, 0, 0);
mesh.scale.set(2, 0.5, 0.5);
scene.add(mesh);

// Helper
const helper = new THREE.AxesHelper();
scene.add(helper);

// Camera

const size = { width: 800, height: 600 };

const camera = new THREE.PerspectiveCamera(75, size.width / size.height);
camera.position.set(1, 1, 3);
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});

renderer.setSize(size.width, size.height);

renderer.render(scene, camera);
