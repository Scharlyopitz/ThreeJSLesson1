import * as THREE from "three";

// Scene
const scene = new THREE.Scene();

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: "#000000" });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Camera

const size = { width: 800, height: 600 };

const camera = new THREE.PerspectiveCamera(75, size.width / size.height);
scene.add(camera);
