// Initialize scene, camera, and renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb); // sky blue

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, 10);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add light and ground
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 5);
scene.add(light);

const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(100, 100),
  new THREE.MeshStandardMaterial({ color: 0x228B22 })
);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// Create player (box shape for now)
const player = new THREE.Mesh(
  new THREE.BoxGeometry(1, 2, 1),
  new THREE.MeshStandardMaterial({ color: 0xffff00 })
);
player.position.y = 1;
scene.add(player);

// Player movement
let playerSpeed = 0.1;
let moveDirection = new THREE.Vector3(0, 0, 0);

// Capacity System
let capacity = 0;
const maxCapacity = 50;
const capacityBar = document.getElementById('capacity-bar');
const capacityText = document.getElementById('capacity-text');

// Update Capacity Bar
function updateCapacityBar() {
    const percentage = (capacity / maxCapacity) * 100;
    capacityBar.style.width = `${percentage}%`;
    capacityText.textContent = `Ore: ${capacity} / ${maxCapacity}`;
}

// Egg Hatching
let petInventory = [];
let coins = 100;
let eggs = [
  { type: 'Basic Egg', cost: 20, pets: ['Dog', 'Cat', 'Rabbit', 'Bird'] },
  { type: 'Rare Egg', cost: 50, pets: ['Lion', 'Tiger', 'Elephant', 'Eagle'] }
];

document.getElementById('hatch-button').addEventListener('click', function() {
  if (coins >= eggs[0].cost) {
    coins -= eggs[0].cost;
    updateCoinsText();
    const randomPet = eggs[0].pets[Math.floor(Math.random() * eggs[0].pets.length)];
    petInventory.push(randomPet);
    document.getElementById('pet-info').textContent = `You hatched a ${randomPet}!`;
  } else {
    alert('Not enough coins!');
  }
});

// Shop System
document.getElementById('shop-button').addEventListener('click', function() {
  const shopUI = document.getElementById('shop-ui');
  shopUI.style.display = shopUI.style.display === 'none' ? 'block' : 'none';

  let shopContent = '<h3>Shop</h3>';
  eggs.forEach(egg => {
    shopContent += `<button onclick="buyEgg('${egg.type}')">${egg.type} - ${egg.cost} Coins</button><br>`;
  });
  document.getElementById('shop-content').innerHTML = shopContent;
});

function buyEgg(type) {
  const egg = eggs.find(e => e.type === type);
  if (coins >= egg.cost) {
    coins -= egg.cost;
    petInventory.push(egg.pets[Math.floor(Math.random() * egg.pets.length)]);
    updateCoinsText();
  } else {
    alert('Not enough coins!');
  }
}

function updateCoinsText() {
  document.getElementById('coins-text').textContent = `Coins: ${coins}`;
}

// Pet Following System (dummy function for now)
let petObject = null;

function spawnPet() {
  if (petInventory.length > 0) {
    const petName = petInventory[0];
    petObject = new THREE.Mesh(
      new THREE.SphereGeometry(1, 16, 16),  // Placeholder for pet shape
      new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    );
    petObject.position.set(player.position.x + 3, player.position.y + 1, player.position.z);
    scene.add(petObject);
  }
}

// Camera follow player
function cameraFollow() {
  camera.position.x = player.position.x;
  camera.position.z = player.position.z + 10;
  camera.lookAt(player.position);
}

// Player movement
document.addEventListener('keydown', function(event) {
  if (event.key === 'w') {
    moveDirection.z = -playerSpeed;
  }
  if (event.key === 's') {
    moveDirection.z = playerSpeed;
  }
  if (event.key === 'a') {
    moveDirection.x = -playerSpeed;
  }
  if (event.key === 'd') {
    moveDirection.x = playerSpeed;
  }
});

document.addEventListener('keyup', function(event) {
  if (event.key === 'w' || event.key === 's') {
    moveDirection.z = 0;
  }
  if (event.key === 'a' || event.key === 'd') {
    moveDirection.x = 0;
  }
});

// Update the scene
function animate() {
  requestAnimationFrame(animate);

  // Move the player
  player.position.add(moveDirection);

  // Update capacity bar
  updateCapacityBar();

  // Camera follow player
  cameraFollow();

  // Pet following player
  if (petObject) {
    petObject.position.x = player.position.x + 3;
    petObject.position.z = player.position.z;
  }

  // Render the scene
  renderer.render(scene, camera);
}

// Start the animation loop
animate();
