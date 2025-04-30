// Global variables
let scene, camera, renderer, player, pet, petFollower;
let moveDirection = new THREE.Vector3(0, 0, 0);
let playerSpeed = 0.1;

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

    // Light
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 10, 5);
    scene.add(light);

    // Ground (Green and Brown mine area)
    const grass = new THREE.Mesh(
        new THREE.PlaneGeometry(50, 50),
        new THREE.MeshStandardMaterial({ color: 0x228B22 })
    );
    grass.rotation.x = -Math.PI / 2;
    grass.position.set(0, 0, 0);
    scene.add(grass);

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

    // PetFollower
    petFollower = new PetFollower(pet, player);

    // UI events
    document.getElementById('hatch-button').onclick = hatchEgg;
    document.getElementById('shop-button').onclick = toggleShop;

    // Key events
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
}

function animate() {
    requestAnimationFrame(animate);

    // Move player
    player.position.add(moveDirection);

    // Follow camera
    camera.position.x = player.position.x;
    camera.position.z = player.position.z + 10;
    camera.lookAt(player.position);

    // Update pet follower
    if (petFollower) petFollower.update();

    renderer.render(scene, camera);
}

function onKeyDown(event) {
    switch (event.key) {
        case 'w': moveDirection.z = -playerSpeed; break;
        case 's': moveDirection.z = playerSpeed; break;
        case 'a': moveDirection.x = -playerSpeed; break;
        case 'd': moveDirection.x = playerSpeed; break;
    }
}

function onKeyUp(event) {
    if (['w', 's'].includes(event.key)) moveDirection.z = 0;
    if (['a', 'd'].includes(event.key)) moveDirection.x = 0;
}

// Egg hatching (demo)
function hatchEgg() {
    alert("You hatched a pet!");
}

// Toggle shop UI
function toggleShop() {
    const shopUI = document.getElementById('shop-ui');
    shopUI.style.display = shopUI.style.display === 'none' ? 'block' : 'none';
}

// PetFollower class
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
