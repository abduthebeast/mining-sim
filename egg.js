// egg.js

let egg;

function createEgg() {
    const geometry = new THREE.SphereGeometry(1, 32, 32); // Using sphere for egg shape
    const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    egg = new THREE.Mesh(geometry, material);
    egg.position.set(0, 1, -5); // Position the egg
    scene.add(egg);
}

// Simulate the egg cracking animation
function hatchEgg() {
    const crackedMaterial = new THREE.MeshBasicMaterial({ color: 0xaaaaaa });
    egg.material = crackedMaterial;
    // After a short delay, spawn a pet
    setTimeout(createPet, 1000);
}

function createPet() {
    const petGeometry = new THREE.CylinderGeometry(0.5, 0.5, 2, 32); // Pet model placeholder
    const petMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const pet = new THREE.Mesh(petGeometry, petMaterial);
    pet.position.set(0, 1, -5); // Position the pet
    scene.add(pet);
}
