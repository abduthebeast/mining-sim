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

// Create a basic pet (a sphere in this case)
let petMesh = new THREE.Mesh(
  new THREE.SphereGeometry(1, 16, 16),  // Placeholder for a pet model
  new THREE.MeshBasicMaterial({ color: 0xff0000 })  // Red pet to make it visible
);

// Position the pet slightly behind the player
petMesh.position.set(player.position.x + 3, player.position.y, player.position.z);
scene.add(petMesh);

// Player movement
let playerSpeed = 0.1;
let moveDirection = new THREE.Vector3(0, 0, 0);

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

// PetFollower class for making the pet follow the player
class PetFollower {
  constructor(petMesh, playerMesh, offset = { x: 1.5, y: 0, z: -1 }) {
    this.pet = petMesh;
    this.player = playerMesh;
    this.offset = offset;
  }

  update() {
    if (!this.pet || !this.player) return;

    // Calculate desired position relative to player
    const targetX = this.player.position.x + this.offset.x;
    const targetY = this.player.position.y + this.offset.y;
    const targetZ = this.player.position.z + this.offset.z;

    // Smooth follow (optional)
    this.pet.position.x += (targetX - this.pet.position.x) * 0.1;
    this.pet.position.y += (targetY - this.pet.position.y) * 0.1;
    this.pet.position.z += (targetZ - this.pet.position.z) * 0.1;
  }
}

// Instantiate PetFollower for the pet and player
const petFollower = new PetFollower(petMesh, player);

// Update the scene
function animate() {
  requestAnimationFrame(animate);

  // Move the player
  player.position.add(moveDirection);

  // Update the pet's position based on the player's position
  petFollower.update();

  // Camera follow player
  camera.position.x = player.position.x;
  camera.position.z = player.position.z + 10;
  camera.lookAt(player.position);

  // Render the scene
  renderer.render(scene, camera);
}

// Start the animation loop
animate();
