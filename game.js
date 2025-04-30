// === SCENE SETUP ===
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb); // Sky blue

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, 10);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// === LIGHT & GROUND ===
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 5);
scene.add(light);

const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(100, 100),
  new THREE.MeshStandardMaterial({ color: 0x228B22 })
);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// === PLAYER ===
const player = new THREE.Mesh(
  new THREE.BoxGeometry(1, 2, 1),
  new THREE.MeshStandardMaterial({ color: 0xffff00 })
);
player.position.y = 1;
scene.add(player);

// === PET ===
let petMesh = new THREE.Mesh(
  new THREE.SphereGeometry(1, 16, 16),
  new THREE.MeshStandardMaterial({ color: 0xff0000 })
);
petMesh.position.set(player.position.x + 3, player.position.y, player.position.z);
scene.add(petMesh);

// === PLAYER MOVEMENT ===
let playerSpeed = 0.1;
let moveDirection = new THREE.Vector3(0, 0, 0);

document.addEventListener('keydown', (event) => {
  if (event.key === 'w') moveDirection.z = -playerSpeed;
  if (event.key === 's') moveDirection.z = playerSpeed;
  if (event.key === 'a') moveDirection.x = -playerSpeed;
  if (event.key === 'd') moveDirection.x = playerSpeed;
});

document.addEventListener('keyup', (event) => {
  if (event.key === 'w' || event.key === 's') moveDirection.z = 0;
  if (event.key === 'a' || event.key === 'd') moveDirection.x = 0;
});

// === PET FOLLOW LOGIC ===
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

const petFollower = new PetFollower(petMesh, player);

// === UI ELEMENTS ===
const hatchButton = document.getElementById("hatch-button");
const petDisplay = document.getElementById("pet-display");
const petInfo = document.getElementById("pet-info");

hatchButton.addEventListener("click", () => {
  petInfo.innerText = "🎉 You hatched a Red Pet!";
  petDisplay.innerText = "🐾";
});

const shopButton = document.getElementById("shop-button");
const shopUI = document.getElementById("shop-ui");

shopButton.addEventListener("click", () => {
  shopUI.style.display = shopUI.style.display === "none" ? "block" : "none";
});

// === CAPACITY SYSTEM PLACEHOLDER ===
let oreCount = 0;
const maxOre = 50;
const capacityText = document.getElementById("capacity-text");

function updateCapacityUI() {
  capacityText.innerText = `Ore: ${oreCount} / ${maxOre}`;
}
updateCapacityUI();

// === GAME LOOP ===
function animate() {
  requestAnimationFrame(animate);

  player.position.add(moveDirection);
  petFollower.update();

  camera.position.x = player.position.x;
  camera.position.z = player.position.z + 10;
  camera.lookAt(player.position);

  renderer.render(scene, camera);
}
animate();
