
const miningRange = 2; // Distance within which player can mine
let selectedOre = null;

function checkForOreProximity() {
    selectedOre = null;
    ores.forEach(ore => {
        if (!ore.userData.isMined) {
            const distance = player.position.distanceTo(ore.position);
            if (distance <= miningRange) {
                selectedOre = ore;
            }
        }
    });
}

function mineOre() {
    if (selectedOre) {
        selectedOre.userData.health -= 1;
        // Optional: Visual feedback (e.g., change color)
        selectedOre.material.color.setHex(0xff0000);
        if (selectedOre.userData.health <= 0) {
            selectedOre.userData.isMined = true;
            scene.remove(selectedOre);
            addToInventory(selectedOre.userData.type);
            // Respawn ore after delay
            setTimeout(() => {
                selectedOre.userData.health = selectedOre.userData.maxHealth;
                selectedOre.userData.isMined = false;
                scene.add(selectedOre);
                selectedOre.material.color.setHex(0x888888);
            }, 10000); // 10 seconds
        }
    }
}

// Event listener for mouse click
window.addEventListener('mousedown', () => {
    mineOre();
});
