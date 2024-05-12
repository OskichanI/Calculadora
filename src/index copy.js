import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";

// Crear la escena
const scene = new THREE.Scene();
// Definir el color de fondo
scene.background = new THREE.Color(0xdddddd); // Puedes usar un valor hexadecimal o un nombre de color

// Crear la cámara
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  100000
);
camera.position.setZ(-1);

// Crear el renderizador
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Añadir OrbitContorls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Habilita el amortiguamiento para movimientos suaves
controls.dampingFactor = 0.25; // Factor de amortiguamiento (cuanto mayor, más suave)
controls.rotateSpeed = 0.35; // Velocidad de rotación al arrastrar el ratón
controls.zoomSpeed = 1.5; // Velocidad de zoom
controls.panSpeed = 0.5; // Velocidad de panorámica

// Añadir luces
const lights = new THREE.AmbientLight(0xffffff, 1);
scene.add(lights);

// Agregar la calculadora
const gltfLoader = new GLTFLoader();
gltfLoader.load("/calculadora.glb", (gltf) => {
  const model = gltf.scene;
  scene.add(model);

  model.traverse((c) => {
    if (c.isMesh && c.name.includes("btn")) {
      const value = c.name.split("_");
      // console.log(c.name.split('_'));
      c.userData.value = value[1];
      if (c.userData.value === "%") c.userData.value = "/";
      if (c.userData.value === ",") c.userData.value = ".";
    }
  });
});

// Creamos el texto
var text = "1";
const fontLoader = new FontLoader();
fontLoader.load(
  "https://cdn.jsdelivr.net/gh/mrdoob/three.js/examples/fonts/helvetiker_regular.typeface.json",
  function (font) {
    const textGeometry = new TextGeometry(text, {
      font: font,
      size: 0.1,
      height: 0.05,
      curveSegments: 12,
      bevelEnabled: false,
    });

    const textMaterial = new THREE.MeshBasicMaterial({ color: "black" });
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);
    scene.add(textMesh);
    textMesh.rotateY(Math.PI);
    textMesh.position.set(0, 0.35, -0.01);
  }
);

// Agregar una geometría (por ejemplo, un cubo)
// const geometry = new THREE.BoxGeometry();
// const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
// const cube = new THREE.Mesh(geometry, material);
// console.log(material);
// scene.add(cube);

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

function handleClick(event) {
  text = "2";
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(pointer, camera);

  const intersects = raycaster.intersectObjects(scene.children);

  if (intersects.length > 0) {
    const hoveredObject = intersects[0].object;

    console.log(hoveredObject.userData.value);
  }
}

window.addEventListener("click", handleClick);

function addToDisplay() {}

function clearDisplay() {}

function calculate() {
  var expression;
  var result;
  try {
    result = eval(expression);
  } catch (error) {
    result = "Error";
  }
}

// Función de renderizado
const animate = function () {
  requestAnimationFrame(animate);

  controls.update(); // Actualizar OrbitControls

  renderer.render(scene, camera);
};

animate();

// Función para manejar el cambio de tamaño de la ventana
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Escuchar el evento de cambio de tamaño de la ventana
window.addEventListener("resize", onWindowResize);
