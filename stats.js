// stats.js

let playerHealth = 100;
let petBoost = 0; // Boost from equipped pet

function updateStats() {
    playerHealth += petBoost; // Boost health from the pet
    document.getElementById("health").innerText = `Health: ${playerHealth}`;
}
