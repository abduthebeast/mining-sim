// Capacity System
let currentCapacity = 0;
let maxCapacity = 50;  // Max capacity of the player's backpack

// UI Elements for Capacity Bar
let capacityBar = document.getElementById("capacity-bar");
let capacityText = document.getElementById("capacity-text");

// Ore Collection Function
function collectOre(oreAmount) {
    if (currentCapacity < maxCapacity) {
        currentCapacity += oreAmount;
        updateCapacityUI();
    } else {
        alert("Your backpack is full! Sell some ores or upgrade your backpack.");
    }
}

// Function to Sell Ore and Get Coins
function sellOre() {
    let coinsEarned = currentCapacity * 5;  // Example: 5 coins per ore
    currentCapacity = 0;  // Clear backpack after selling
    updateCapacityUI();
    alert(`You sold your ores for ${coinsEarned} coins!`);
}

// Function to Update the UI for Capacity
function updateCapacityUI() {
    let capacityPercent = (currentCapacity / maxCapacity) * 100;
    capacityBar.style.width = capacityPercent + "%";  // Update the bar width
    capacityText.innerText = `Ore: ${currentCapacity} / ${maxCapacity}`;  // Update the text
}

// Function to Upgrade Capacity
function upgradeCapacity() {
    maxCapacity += 20;  // Increase max capacity by 20 units
    alert(`Backpack capacity upgraded! New capacity: ${maxCapacity}`);
}

// Initial UI Update
updateCapacityUI();

// Add Event Listeners to UI Buttons (Assuming you have buttons for selling and upgrading)
document.getElementById("sell-button").addEventListener("click", sellOre);
document.getElementById("upgrade-button").addEventListener("click", upgradeCapacity);
