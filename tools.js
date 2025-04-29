// tools.js

const tools = {
    woodenPickaxe: { power: 1 },
    stonePickaxe: { power: 2 },
    ironPickaxe: { power: 3 }
};

let currentTool = tools.woodenPickaxe;

// Modify mineOre function to use tool power
function mineOre() {
    if (selectedOre) {
        selectedOre.userData.health -= currentTool.power;
        selectedOre.material.color.setHex(0xff0000);
        if (selectedOre.userData.health <= 0) {
            selectedOre.userData.isMined = true;
            scene.remove(selectedOre);
            addToInventory(selectedOre.userData.type);
            setTimeout(() => {
                selectedOre.userData.health = selectedOre.userData.maxHealth;
                selectedOre.userData.isMined = false;
                scene.add(selectedOre);
                selectedOre.material.color.setHex(0x888888);
            }, 10000);
        }
    }
}
