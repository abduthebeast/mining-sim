
const ores = [];

function createOre(position, type = 'iron') {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ color: 0x888888 });
    const ore = new THREE.Mesh(geometry, material);
    ore.position.copy(position);
    ore.userData = {
        type: type,
        health: 3, // Number of hits to mine
        maxHealth: 3,
        isMined: false
    };
    scene.add(ore);
    ores.push(ore);
}

// Example: Create multiple ores at different positions
createOre(new THREE.Vector3(5, 0.5, -5));
createOre(new THREE.Vector3(-3, 0.5, 2));
