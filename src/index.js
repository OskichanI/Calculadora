import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// Creamos la escena, la cámara y el renderizador
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Creamos una geometría para los botones
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

// Creamos los botones
const buttons = [];
for (let i = 0; i < 10; i++) {
  const button = new THREE.Mesh(geometry, material);
  button.position.set(((i % 3) - 1) * 2, (i < 3 ? 1 : i < 6 ? 0 : -1) * 2, -5);
  button.number = i;
  button.onClick = function () {
    console.log("Número " + this.number + " clickeado");
  };
  buttons.push(button);
  scene.add(button);
}

// Operadores
const operators = ["+", "-", "*", "/"];
for (let i = 0; i < operators.length; i++) {
  const operator = operators[i];
  const button = new THREE.Mesh(geometry, material);
  button.position.set(2, (i - operators.length / 2) * 2, -5);
  button.operator = operator;
  button.onClick = function () {
    console.log("Operador " + this.operator + " clickeado");
  };
  buttons.push(button);
  scene.add(button);
}

// Pantalla
const screen = new THREE.Mesh(geometry, material);
screen.position.set(0, 5, -5);
screen.scale.set(5, 2, 1);
scene.add(screen);

// Añadimos un listener de clics al lienzo
console.log(document.querySelector('canvas'));
document.querySelector("canvas").addEventListener("click", function (event) {
  const mouse = new THREE.Vector2();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(buttons);
  if (intersects.length > 0 && intersects[0].object.onClick) {
    intersects[0].object.onClick();
  }
});

// Establecemos la posición de la cámara
camera.position.z = 10;

// Renderizamos la escena
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
