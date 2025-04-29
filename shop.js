// shop.js

let playerCoins = 100;

document.getElementById('buyEgg').addEventListener('click', function() {
    if (playerCoins >= 100) {
        playerCoins -= 100;
        alert("You bought an egg!");
        hatchEgg(); // Trigger egg hatching
    } else {
        alert("Not enough coins!");
    }
});
