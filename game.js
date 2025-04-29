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

  // Camera follow player
  camera.position.x = player.position.x;
  camera.position.z = player.position.z + 10;
  camera.lookAt(player.position);

  // Render the scene
  renderer.render(scene, camera);
}

// Start the animation loop
animate();
