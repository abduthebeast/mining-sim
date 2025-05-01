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
let scene, camera, renderer, player, pet = null, petFollower;
let moveDirection = new THREE.Vector3(0, 0, 0);
let playerSpeed = 0.3; // Increased speed
let yaw = 0; // Mouse control for yaw
let pitch = 0; // Mouse control for pitch
let isPointerLocked = false;
let inventory = []; // Array to hold pets
let coins = 100;
let maxOre = 50;
let currentOre = 0;
let isMouseDown = false; // Track mouse click for rotating the camera
let ores = [];
let oreTypes = [
  { name: "Stone", color: 0x808080, value: 5 },
  { name: "Iron", color: 0xb7410e, value: 15 },
  { name: "Gold", color: 0xffd700, value: 30 },
  { name: "Diamond", color: 0x00ffff, value: 60 }
];
let toolLevel = 1;
let backpackLevel = 1;
let miningCooldown = 0;
let minedCount = 0;
let mineSize = 20; // Initial mine area


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

  function generateOres() {
  ores.forEach(o => scene.remove(o.mesh));
  ores = [];
  for (let i = 0; i < 40 + minedCount * 2; i++) {
    const type = oreTypes[Math.floor(Math.random() * oreTypes.length)];
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ color: type.color });
    const ore = new THREE.Mesh(geometry, material);
    ore.position.set(
      30 + (Math.random() - 0.5) * mineSize,
      0.5,
      (Math.random() - 0.5) * mineSize
    );
    ore.userData = { type };
    ores.push({ mesh: ore, type });
    scene.add(ore);
  }
}

  // Player
  player = new THREE.Mesh(
    new THREE.BoxGeometry(1, 2, 1),
    new THREE.MeshStandardMaterial({ color: 0xffff00 })
  );
  player.position.y = 1;
  scene.add(player);

  // Pet (initially set to null)
  pet = null;

  // Pet follower logic
  petFollower = new PetFollower(pet, player);

  if (miningCooldown > 0) miningCooldown--;

ores.forEach((ore, index) => {
  const dist = player.position.distanceTo(ore.mesh.position);
  if (dist < 2 && miningCooldown === 0 && currentOre < maxOre) {
    scene.remove(ore.mesh);
    ores.splice(index, 1);
    currentOre++;
    coins += ore.type.value;
    document.getElementById('capacity-text').innerText = `Ore: ${currentOre} / ${maxOre}`;
    document.getElementById('coins-text').innerText = `Coins: ${coins}`;
    miningCooldown = 30 - toolLevel * 5; // Faster tools = faster mining
    minedCount++;
    if (minedCount % 10 === 0) {
      mineSize += 5;
      generateOres(); // Expand mine and add new ores
    }
  }
});

  // UI Event Handlers
  document.getElementById('hatch-button').onclick = hatchEgg;
  document.getElementById('shop-button').onclick = toggleShop;
  document.getElementById('inventory-button').onclick = toggleInventory;

  // Mouse Control - Now using mouse movement with mouse down to rotate camera
  document.body.addEventListener('mousedown', () => {
    isMouseDown = true;
  });

  document.body.addEventListener('mouseup', () => {
    isMouseDown = false;
  });

  document.addEventListener('mousemove', (event) => {
    if (isMouseDown) {
      yaw -= event.movementX * 0.002; // Adjust mouse sensitivity here
      pitch += event.movementY * 0.002;
      pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, pitch)); // Clamp pitch to avoid camera flipping
    }
  });

  // Movement 
  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('keyup', onKeyUp);

  updateOreUI(); // ✅ Add this here
}


function animate() {
  requestAnimationFrame(animate);

  // Move player
  player.position.add(moveDirection);

   const radius = 10; // distance from player
  const cameraOffsetX = radius * Math.sin(yaw) * Math.cos(pitch);
  const cameraOffsetY = radius * Math.sin(pitch);
  const cameraOffsetZ = radius * Math.cos(yaw) * Math.cos(pitch);

  camera.position.set(
    player.position.x + cameraOffsetX,
    player.position.y + 2 + cameraOffsetY, // slightly above player
    player.position.z + cameraOffsetZ
  );

  camera.lookAt(player.position.x, player.position.y + 1, player.position.z);

  // Follow pet if there is one
  if (pet) petFollower.update();

  // Rendering
  renderer.render(scene, camera);
}

function onKeyDown(event) {
  const forward = new THREE.Vector3(Math.sin(yaw), 0, Math.cos(yaw));
  const right = new THREE.Vector3(Math.cos(yaw), 0, -Math.sin(yaw));
  switch (event.key) {
    case 'w': moveDirection.sub(forward.multiplyScalar(playerSpeed)); break;
    case 's': moveDirection.add(forward.multiplyScalar(playerSpeed)); break;
    case 'a': moveDirection.sub(right.multiplyScalar(playerSpeed)); break;
    case 'd': moveDirection.add(right.multiplyScalar(playerSpeed)); break;
  }
}

function onKeyUp(event) {
  moveDirection.set(0, 0, 0); // Stop movement on key release
}

// Hatch egg function
function hatchEgg() {
  if (inventory.length < 10) {
    const petName = `Pet ${inventory.length + 1}`;
    inventory.push(petName);
    updateInventoryDisplay();
    alert(`You hatched a new pet: ${petName}`);
    if (!pet) {
      // If you don't have a pet yet, the first pet will be spawned
      pet = new THREE.Mesh(
        new THREE.SphereGeometry(0.5),
        new THREE.MeshStandardMaterial({ color: 0xff69b4 })
      );
      pet.position.set(player.position.x + 1.5, 0.5, player.position.z - 1);
      scene.add(pet);
      petFollower = new PetFollower(pet, player); // Reassign follower
    }
  } else {
    alert("You have reached the maximum pet limit!");
  }
}

// Equip pet function
function equipPet(petName) {
  // Equip the selected pet (you can add more logic to equip different pets here)
  alert(`Equipped pet: ${petName}`);
  petFollower = new PetFollower(pet, player); // Reassign the pet follower to the new pet
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

// Update the inventory UI with the current pets
function updateInventoryDisplay() {
  const inv = document.getElementById('inventory-content');
  inv.innerHTML = ''; // Clear previous content
  if (inventory.length === 0) {
    inv.innerHTML = 'No pets yet.';
  } else {
    inventory.forEach((petName, index) => {
      inv.innerHTML += `
        <div>
          ${petName} 
          <button onclick="equipPet('${petName}')">Equip</button>
        </div>
      `;
    });
  }
}
function updateOreUI() {
  document.getElementById('ore-count').textContent = currentOre;
  document.getElementById('ore-max').textContent = maxOre;
  document.getElementById('coin-count').textContent = coins;
  document.getElementById('coins-text').textContent = `Coins: ${coins}`;
}

function sellOre() {
  if (currentOre > 0) {
    const sellValue = 5; // 5 coins per ore
    const earnings = currentOre * sellValue;
    coins += earnings;
    currentOre = 0;
    alert(`You sold your ore for ${earnings} coins!`);
    updateOreUI();
    function updateCapacityDisplay() {
  const capText = document.getElementById('capacity-text');
  capText.textContent = `Ore: ${currentOre} / ${maxOre}`;
  updateOreUI();
}

  } else {
    alert("You don't have any ore to sell!");
  }
}
// --- Ore system ---
const oreTypes = [
  { name: 'Stone', color: 0x888888, value: 1, rarity: 0.6 },
  { name: 'Iron', color: 0xb7410e, value: 5, rarity: 0.25 },
  { name: 'Gold', color: 0xffd700, value: 10, rarity: 0.1 },
  { name: 'Diamond', color: 0x00ffff, value: 25, rarity: 0.05 }
];

let oreBlocks = [];
let minedCount = 0;
let mineSize = 20;

function spawnOreField(centerX = 30, centerZ = 0, size = mineSize) {
  for (let x = -size / 2; x < size / 2; x += 2) {
    for (let z = -size / 2; z < size / 2; z += 2) {
      const oreType = getRandomOreType();
      const block = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.MeshStandardMaterial({ color: oreType.color })
      );
      block.position.set(centerX + x, 0.5, centerZ + z);
      block.userData = { oreType };
      scene.add(block);
      oreBlocks.push(block);
    }
  }
}

function getRandomOreType() {
  const rand = Math.random();
  let cumulative = 0;
  for (const ore of oreTypes) {
    cumulative += ore.rarity;
    if (rand < cumulative) return ore;
  }
  return oreTypes[0]; // fallback to common
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'e') tryMine();
});

function tryMine() {
  for (let i = 0; i < oreBlocks.length; i++) {
    const ore = oreBlocks[i];
    const dist = player.position.distanceTo(ore.position);
    if (dist < 2.5) {
      scene.remove(ore);
      oreBlocks.splice(i, 1);
      collectOre(ore.userData.oreType);
      return;
    }
  }
}

function collectOre(ore) {
  currentOre++;
  coins += ore.value;
  minedCount++;

  document.getElementById('capacity-text').innerText = `Ore: ${currentOre} / ${maxOre}`;
  document.getElementById('coins-text').innerText = `Coins: ${coins}`;

  if (minedCount % 10 === 0) {
    mineSize += 10;
    spawnOreField(30, 0, mineSize);
  }
}

// --- Initial mine generation ---
spawnOreField();
function upgradeTool() {
  const cost = toolLevel * 50;
  if (coins >= cost) {
    coins -= cost;
    toolLevel++;
    alert(`Tool upgraded to level ${toolLevel}!`);
    document.getElementById('coins-text').innerText = `Coins: ${coins}`;
  } else {
    alert("Not enough coins to upgrade tool!");
  }
}

function upgradeBackpack() {
  const cost = backpackLevel * 50;
  if (coins >= cost) {
    coins -= cost;
    backpackLevel++;
    maxOre += 50;
    alert(`Backpack upgraded! New capacity: ${maxOre}`);
    document.getElementById('coins-text').innerText = `Coins: ${coins}`;
    document.getElementById('capacity-text').innerText = `Ore: ${currentOre} / ${maxOre}`;
  } else {
    alert("Not enough coins to upgrade backpack!");
  }
}


