import * as THREE from './three.module.js';

class PetFollower {
  constructor(petMesh, playerMesh, offset = { x: 1.5, y: 0, z: -1 }) {
    this.pet = petMesh;
    this.player = playerMesh;
    this.offset = offset;
  }

  update() {
    if (!this.pet || !this.player) return;
    this.pet.position.x += (this.player.position.x + this.offset.x - this.pet.position.x) * 0.1;
    this.pet.position.y += (this.player.position.y + this.offset.y - this.pet.position.y) * 0.1;
    this.pet.position.z += (this.player.position.z + this.offset.z - this.pet.position.z) * 0.1;
  }
}

// === Scene Setup ===
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, 10);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// === Lights ===
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 5);
scene.add(light);

// === Ground ===
const grass = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), new THREE.MeshStandardMaterial({ color: 0x228B22 }));
grass.rotation.x = -Math.PI / 2;
scene.add(grass);

// === Mine Area ===
const mine = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), new THREE.MeshStandardMaterial({ color: 0x8B4513 }));
mine.rotation.x = -Math.PI / 2;
mine.position.set(20, 0.01, 0);
scene.add(mine);

// === Player ===
const player = new THREE.Mesh(new THREE.BoxGeometry(1, 2, 1), new THREE.MeshStandardMaterial({ color: 0xffff00 }));
player.position.y = 1;
scene.add(player);

// === Pet ===
const pet = new THREE.Mesh(new THREE.SphereGeometry(0.5), new THREE.MeshStandardMaterial({ color: 0xff69b4 }));
pet.position.set(1, 1, -1);
scene.add(pet);
const petFollower = new PetFollower(pet, player);

// === Controls ===
let moveDir = new THREE.Vector3();
document.addEventListener('keydown', e => {
  if (e.key === 'w') moveDir.z = -0.1;
  if (e.key === 's') moveDir.z = 0.1;
  if (e.key === 'a') moveDir.x = -0.1;
  if (e.key === 'd') moveDir.x = 0.1;
});
document.addEventListener('keyup', e => {
  if (e.key === 'w' || e.key === 's') moveDir.z = 0;
  if (e.key === 'a' || e.key === 'd') moveDir.x = 0;
});

// === Capacity System ===
let oreCollected = 0;
let capacity = 50;
const capacityText = document.getElementById('capacity-text');
const capacityFill = document.getElementById('capacity-fill');

// === Coin System ===
let coins = 100;
const coinsText = document.getElementById('coins-text');

// === Egg Hatching Logic ===
document.getElementById('hatch-button').onclick = () => {
  const petColor = Math.random() < 0.5 ? 0xff69b4 : 0x00ffff;
  const newPet = new THREE.Mesh(new THREE.SphereGeometry(0.5), new THREE.MeshStandardMaterial({ color: petColor }));
  newPet.position.copy(player.position).add(new THREE.Vector3(1, 1, -1));
  scene.add(newPet);
  alert('You hatched a pet!');
};

// === Shop Toggle ===
document.getElementById('shop-button').onclick = () => {
  const shopUI = document.getElementById('shop-ui');
  shopUI.style.display = shopUI.style.display === 'none' ? 'block' : 'none';
};

// === Animation Loop ===
function animate() {
  requestAnimationFrame(animate);

  player.position.add(moveDir);
  camera.position.x = player.position.x;
  camera.position.z = player.position.z + 10;
  camera.lookAt(player.position);

  // Simulate mining
  if (player.position.distanceTo(mine.position) < 15 && oreCollected < capacity) {
    oreCollected++;
    const percentage = (oreCollected / capacity) * 100;
    capacityFill.style.width = `${percentage}%`;
    capacityText.textContent = `Ore: ${oreCollected} / ${capacity}`;
  }

  petFollower.update();
  renderer.render(scene, camera);
}
animate();
