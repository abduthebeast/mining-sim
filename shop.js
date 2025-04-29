let coins = 100; // Initial coins
let inventory = [];

const eggPrices = {
  "Basic Egg": 50,
  "Rare Egg": 100,
  "Epic Egg": 200,
  "Legendary Egg": 500
};

const eggTypes = ["Basic", "Rare", "Epic", "Legendary"];

document.getElementById('shopBtn').addEventListener('click', openShop);

function openShop() {
  let shopHtml = `<h2>Shop</h2><p>Coins: ${coins}</p>`;
  eggTypes.forEach(type => {
    shopHtml += `<button onclick="buyEgg('${type}')">${type} Egg - ${eggPrices[`${type} Egg`]} Coins</button><br>`;
  });
  document.getElementById('ui').innerHTML = shopHtml;
}

function buyEgg(type) {
  if (coins >= eggPrices[`${type} Egg`]) {
    coins -= eggPrices[`${type} Egg`];
    hatchEgg(type);
  } else {
    alert('Not enough coins!');
  }
  openShop();
}

function hatchEgg(type) {
  const pet = createPet(type);
  inventory.push(pet);
  alert(`You hatched a ${pet.name}!`);
  updateUI();
}

function createPet(type) {
  const pet = {
    name: `${type} Pet`,
    type: type,
    health: Math.random() * 100 + 50,
    boost: Math.random() * 10 + 1
  };
  return pet;
}

function updateUI() {
  document.getElementById('coins').innerText = coins;
  document.getElementById('ore').innerText = inventory.length;
  document.getElementById('capacity').innerText = 5;
}
