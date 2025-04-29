let playerCoins = 100;  // Initial coin count

// Function to buy an egg
document.getElementById('buyEggButton').addEventListener('click', function() {
    if (playerCoins >= 100) {  // Check if the player has enough coins
        playerCoins -= 100;  // Deduct coins from the player
        alert("You bought an egg!");
        hatchEgg();  // Trigger the egg hatching process after purchase
    } else {
        alert("Not enough coins!");
    }

    // Update coin count UI (you can add this wherever you'd like to display coins)
    document.getElementById('coinCount').innerText = `Coins: ${playerCoins}`;
});
