// Egg Hatching System
let pets = {
    common: { name: 'Common Pet', health: 10, damage: 5, rarity: 'Common' },
    rare: { name: 'Rare Pet', health: 20, damage: 10, rarity: 'Rare' },
    epic: { name: 'Epic Pet', health: 40, damage: 20, rarity: 'Epic' },
    legendary: { name: 'Legendary Pet', health: 100, damage: 50, rarity: 'Legendary' }
};

// UI Elements
let hatchButton = document.getElementById("hatch-button");
let petDisplay = document.getElementById("pet-display");
let petInfo = document.getElementById("pet-info");

// Function to Hatch Egg
function hatchEgg() {
    let rarity = getRandomRarity();
    let newPet = pets[rarity];
    petDisplay.innerHTML = `You hatched a ${newPet.rarity} pet!`;
    petInfo.innerHTML = `Name: ${newPet.name}<br>Health: ${newPet.health}<br>Damage: ${newPet.damage}`;
    // Give pet boosts here (health/damage)
    alert(`You hatched a ${newPet.rarity} pet: ${newPet.name}!`);
}

// Function to get a random pet rarity
function getRandomRarity() {
    let rarities = ['common', 'rare', 'epic', 'legendary'];
    let randomIndex = Math.floor(Math.random() * rarities.length);
    return rarities[randomIndex];
}

// Attach hatch egg function to button
hatchButton.addEventListener("click", hatchEgg);
