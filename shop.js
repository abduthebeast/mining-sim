// Shop System
let coins = 100;  // Player's coins (for example)
let shopItems = {
    egg: { name: 'Basic Egg', price: 50, description: 'Hatch a random pet.' },
    backpack: { name: 'Small Backpack', price: 100, description: 'Increase your inventory capacity.' },
    pickaxe: { name: 'Wooden Pickaxe', price: 75, description: 'Used to mine ores.' }
};

// UI Elements for Shop
let shopButton = document.getElementById("shop-button");
let shopUI = document.getElementById("shop-ui");
let shopContent = document.getElementById("shop-content");
let coinsText = document.getElementById("coins-text");

// Display current coins
coinsText.innerHTML = `Coins: ${coins}`;

// Function to open the shop
function openShop() {
    shopUI.style.display = "block"; // Show shop UI
    shopContent.innerHTML = "";
    
    for (let item in shopItems) {
        let itemDetails = shopItems[item];
        let itemButton = document.createElement("button");
        itemButton.classList.add("button");
        itemButton.innerHTML = `${itemDetails.name} - ${itemDetails.price} coins`;
        
        // Add event listener for purchasing
        itemButton.addEventListener("click", function() {
            purchaseItem(item);
        });
        
        shopContent.appendChild(itemButton);
    }
}

// Function to purchase an item
function purchaseItem(item) {
    let itemDetails = shopItems[item];
    if (coins >= itemDetails.price) {
        coins -= itemDetails.price;  // Deduct the coins
        coinsText.innerHTML = `Coins: ${coins}`;
        alert(`You bought ${itemDetails.name} for ${itemDetails.price} coins!`);
        if (item === 'egg') {
            hatchEgg();  // Hatch egg when purchased
        }
    } else {
        alert("Not enough coins!");
    }
}

// Attach open shop function to button
shopButton.addEventListener("click", openShop);
