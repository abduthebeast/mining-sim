
let egg;
let pet;

// Create an egg (placeholder)
function createEgg() {
    const geometry = new THREE.SphereGeometry(1, 32, 32); // Simple egg shape
    const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    egg = new THREE.Mesh(geometry, material);
    egg.position.set(0, 1, -5); // Position the egg in front of the player
    scene.add(egg);
}

// Simulate the egg cracking animation (just a color change for now)
function hatchEgg() {
    if (egg) {
        const crackedMaterial = new THREE.MeshBasicMaterial({ color: 0xaaaaaa });
        egg.material = crackedMaterial; // Change the color of the egg to "crack" it

        // Spawn pet after animation (1 second delay)
        setTimeout(() => createPet(), 1000);
    }
}

// Create a basic pet (can replace with an actual model later)
function createPet() {
    const petGeometry = new THREE.CylinderGeometry(0.5, 0.5, 2, 32); // Placeholder pet model
    const petMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    pet = new THREE.Mesh(petGeometry, petMaterial);
    pet.position.set(0, 1, -5); // Position the pet next to the egg
    scene.add(pet);
}

// Listen for egg hatching event when the button is clicked
document.getElementById('hatchEggButton').addEventListener('click', function() {
    hatchEgg(); // Trigger the egg hatching process
});
