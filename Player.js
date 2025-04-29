// player.js

let player;
let playerSpeed = 0.1; // Speed of movement

// Create a basic player (you can replace this with your own model later)
function createPlayer() {
    const geometry = new THREE.BoxGeometry(1, 2, 1); // Using a box as placeholder
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    player = new THREE.Mesh(geometry, material);
    player.position.set(0, 1, 0); // Set player starting position
    scene.add(player);
}

function movePlayer() {
    const speed = playerSpeed;
    
    // Handle player movement with keyboard input
    if (keyboard.pressed("W")) {
        player.position.z -= speed;
    }
    if (keyboard.pressed("S")) {
        player.position.z += speed;
    }
    if (keyboard.pressed("A")) {
        player.position.x -= speed;
    }
    if (keyboard.pressed("D")) {
        player.position.x += speed;
    }
}

// Initialize the player and movement
createPlayer();

function update() {
    movePlayer();
    cameraFollow();
}
