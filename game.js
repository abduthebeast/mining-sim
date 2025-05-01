// --- PetFollower class must come first ---
class PetFollower {
  constructor(petMesh, playerMesh, offset = { x: 1.5, y: 0, z: -1 }) {
    this.pet = petMesh;
    this.player = playerMesh;
    this.offset = offset;
  }

  update() {
    if (!this.pet || !this.player) return;
    const targetX = this.player.position.x + this.offset.x;
    const targetY = this.player.position.y + this.offset.y;
    const targetZ = this.player.position.z + this.offset.z;

    this.pet.position.x += (targetX - this.pet.position.x) * 0.1;
    this.pet.position.y += (targetY - this.pet.position.y) * 0.1;
    this.pet.position.z += (targetZ - this.pet.position.z) * 0.1;
  }
}

// --- Global variables ---
let scene, camera, renderer, player, pet, petFollower;
let moveDirection = new THREE.Vector3(0, 0, 0);
let playerSpeed = 0.3; // Increased speed
let yaw = 0; // Mouse control for yaw
let pitch = 0; // Mouse control for pitch
let isPointerLocked = false;

init();
animate();

function init() {
  // Scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x87ceeb);

  // Camera
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 5, 10);

  // Renderer
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Lighting
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(5, 10, 5);
  scene.add(light);

  // Ground
  const grass = new THREE.Mesh(
    new THREE.PlaneGeometry(50, 50),
    new THREE.MeshStandardMaterial({ color: 0x228B22 })
  );
  grass.rotation.x = -Math.PI / 2;
  scene.add(grass);

  // Mine Area
  const mine = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({ color: 0x8B4513 })
  );
  mine.rotation.x = -Math.PI / 2;
  mine.position.set(30, 0.01, 0);
  scene.add(mine);

  // Player
  player = new THREE.Mesh(
    new THREE.BoxGeometry(1, 2, 1),
    new THREE.MeshStandardMaterial({ color: 0xffff00 })
  );
  player.position.y = 1;
  scene.add(player);

  // Pet
  pet = new THREE.Mesh(
    new THREE.SphereGeometry(0.5),
    new THREE.MeshStandardMaterial({ color: 0xff69b4 })
  );
  pet.position.set(player.position.x + 1.5, 0.5, player.position.z - 1);
  scene.add(pet);

  // Pet follower logic
  petFollower = new PetFollower(pet, player);

  // UI Event Handlers
  document.getElementById('hatch-button').onclick = hatchEgg;
  document.getElementById('shop-button').onclick = toggleShop;
  document.getElementById('inventory-button').onclick = toggleInventory;

  // Mouse Control - Pointer lock for mouse look
  document.body.addEventListener('click', () => {
    if (!isPointerLocked) {
      renderer.domElement.requestPointerLock();
    }
  });

  document.addEventListener('pointerlockchange', () => {
    isPointerLocked = document.pointerLockElement === renderer.domElement;
  });

  document.addEventListener('mousemove', (event) => {
    if (isPointerLocked) {
      yaw -= event.movementX * 0.002; // Adjust mouse sensitivity here
      pitch -= event.movementY * 0.002;
      pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, pitch)); // Clamp pitch to avoid camera flipping
    }
  });

  // Movement
  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('keyup', onKeyUp);
}

function animate() {
  requestAnimationFrame(animate);

  // Move player
  player.position.add(moveDirection);

  // Update camera position based on player and mouse movement
  camera.position.x = player.position.x;
  camera.position.y = player.position.y + 2; // Set camera height
  camera.position.z = player.position.z + 10;
  camera.rotation.y = yaw;
  camera.rotation.x = pitch;

  // Follow pet
  if (petFollower) petFollower.update();

  renderer.render(scene, camera);
}

function onKeyDown(event) {
  const forward = new THREE.Vector3(Math.sin(yaw), 0, Math.cos(yaw));
  const right = new THREE.Vector3(Math.cos(yaw), 0, -Math.sin(yaw));
  switch (event.key) {
    case 'w': moveDirection.add(forward.multiplyScalar(playerSpeed)); break;
    case 's': moveDirection.sub(forward.multiplyScalar(playerSpeed)); break;
    case 'a': moveDirection.add(right.multiplyScalar(playerSpeed)); break;
    case 'd': moveDirection.sub(right.multiplyScalar(playerSpeed)); break;
  }
}

function onKeyUp(event) {
  moveDirection.set(0, 0, 0); // Stop movement on key release
}

// Dummy egg hatching
function hatchEgg() {
  const inv = document.getElementById('inventory-content');
  inv.innerHTML += `<div>🐾 New Pet Hatched!</div>`;
  alert("You hatched a pet!");
}

// Toggle shop
function toggleShop() {
  const shopUI = document.getElementById('shop-ui');
  shopUI.style.display = shopUI.style.display === 'none' ? 'block' : 'none';
}

// Toggle inventory
function toggleInventory() {
  const inventoryUI = document.getElementById('inventory-ui');
  inventoryUI.style.display = inventoryUI.style.display === 'none' ? 'block' : 'none';
}
