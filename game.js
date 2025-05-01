import * as THREE from 'three';

let scene, camera, renderer;
let player, playerSpeed = 0.2;
let keysPressed = {};
let ores = [];
let mineSize = 10;
let minedOres = 0;
let mineThreshold = 20;
let capacity = 10;
let carriedOres = 0;
let money = 0;
let shopUI, capacityText, moneyText;

const oreTypes = [
  { name: 'Stone', color: 0x888888, value: 1, rarity: 0.6 },
  { name: 'Iron', color: 0xb7410e, value: 5, rarity: 0.25 },
  { name: 'Gold', color: 0xffd700, value: 10, rarity: 0.1 },
  { name: 'Diamond', color: 0x00ffff, value: 25, rarity: 0.05 }
];

init();
animate();

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xa0a0a0);

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 5, 10);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const light = new THREE.HemisphereLight(0xffffff, 0x444444);
  light.position.set(0, 20, 0);
  scene.add(light);

  const ground = new THREE.Mesh(
    new THREE.BoxGeometry(50, 1, 50),
    new THREE.MeshStandardMaterial({ color: 0x8b4513 })
  );
  ground.position.y = -0.5;
  scene.add(ground);

  player = new THREE.Mesh(
    new THREE.BoxGeometry(1, 2, 1),
    new THREE.MeshStandardMaterial({ color: 0x0000ff })
  );
  player.position.y = 1;
  scene.add(player);

  generateMine();

  document.addEventListener('keydown', (e) => keysPressed[e.key] = true);
  document.addEventListener('keyup', (e) => keysPressed[e.key] = false);

  setupUI();
}
function generateMine() {
  const orePositions = new Set(ores.map(o => `${o.position.x},${o.position.z}`));
  const half = mineSize / 2;

  for (let x = -half; x < half; x++) {
    for (let z = -half; z < half; z++) {
      // Only spawn on outer edge of new mine expansion
      if (
        Math.abs(x) >= half - 5 || Math.abs(z) >= half - 5
      ) {
        const key = `${x},${z}`;
        if (!orePositions.has(key) && Math.random() < 0.3) {
          const oreType = getRandomOreType();
          const ore = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.MeshStandardMaterial({ color: oreType.color })
          );
          ore.position.set(x, 0.5, z);
          ore.userData = { type: oreType };
          scene.add(ore);
          ores.push(ore);
          orePositions.add(key);
        }
      }
    }
  }
}


function getRandomOreType() {
  let rand = Math.random();
  let sum = 0;
  for (const ore of oreTypes) {
    sum += ore.rarity;
    if (rand <= sum) return ore;
  }
  return oreTypes[0]; // fallback
}

function setupUI() {
  shopUI = document.createElement('div');
  shopUI.style.position = 'absolute';
  shopUI.style.top = '10px';
  shopUI.style.left = '10px';
  shopUI.style.padding = '10px';
  shopUI.style.backgroundColor = 'rgba(0,0,0,0.5)';
  shopUI.style.color = 'white';
  shopUI.style.fontFamily = 'sans-serif';
  shopUI.innerHTML = `
    <div>💰 Money: <span id="money">0</span></div>
    <div>🎒 Capacity: <span id="capacity">10</span></div>
    <button id="upgrade">Upgrade Backpack (Cost: 50)</button>
  `;
  document.body.appendChild(shopUI);

  capacityText = document.getElementById('capacity');
  moneyText = document.getElementById('money');
  document.getElementById('upgrade').onclick = upgradeBackpack;
}

function upgradeBackpack() {
  const cost = 50;
  if (money >= cost) {
    money -= cost;
    capacity += 10;
    updateUI();
  }
}

function updateUI() {
  capacityText.textContent = capacity;
  moneyText.textContent = money;
}

function animate() {
  requestAnimationFrame(animate);

  handlePlayerMovement();
  checkMining();

  camera.position.x = player.position.x;
  camera.position.z = player.position.z + 10;
  camera.lookAt(player.position);

  renderer.render(scene, camera);
}

function handlePlayerMovement() {
  if (keysPressed['w']) player.position.z -= playerSpeed;
  if (keysPressed['s']) player.position.z += playerSpeed;
  if (keysPressed['a']) player.position.x -= playerSpeed;
  if (keysPressed['d']) player.position.x += playerSpeed;
}

function checkMining() {
  for (let i = ores.length - 1; i >= 0; i--) {
    const ore = ores[i];
    if (player.position.distanceTo(ore.position) < 1.5 && carriedOres < capacity) {
      const value = ore.userData.type.value;
      carriedOres++;
      money += value;
      minedOres++;
      scene.remove(ore);
      ores.splice(i, 1);
      updateUI();

      if (minedOres >= mineThreshold) {
        mineSize += 5;
        mineThreshold += 20;
        generateMine();
      }
    }
  }
}
