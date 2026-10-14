// Vite turns this import into a production-safe URL. Keep it as a file so
// even this tiny example demonstrates a separately deployed asset.
// @deno-types="./asset-url.d.ts"
import tileUrl from "./assets/semi-flat-sideways-milk-cow.jpg?no-inline";

const app = document.querySelector<HTMLElement>("#app")!;
app.style.textAlign = "center";

const heading = document.createElement("h1");
heading.textContent = "Milk a COW!!";

const statsContainer = document.createElement("div");
statsContainer.style.display = "flex";
statsContainer.style.justifyContent = "center";
statsContainer.style.gap = "20px";

const image = document.createElement("img");
image.src = tileUrl;
image.alt = "A COW";
image.width = 300;
image.style.height = "auto";
image.style.display = "block";
image.style.margin = "20px auto";
image.style.cursor = "pointer";

let milk = 0;
let milkPerClick = 1;
let upgradeCost = 20;
let autoMilkers = 0;
let autoMilkerCost = 30;
const message = document.createElement("p");
message.textContent = `Milk:${milk}L`;

const upgradeClickLevel = document.createElement("p");
upgradeClickLevel.textContent = `Milk per Click: ${milkPerClick}`;

const upgradeAutoLevel = document.createElement("p");
upgradeAutoLevel.textContent = ``;

statsContainer.append(upgradeClickLevel, upgradeAutoLevel);

const button = document.createElement("button");
button.textContent = "Milk Me!";
button.type = "button";
let money = 0;

function milkCow() {
  milk += milkPerClick;
  message.textContent = `Milk:${milk.toFixed(1)}L`;
  image.animate([{ transform: "scale(1)" }, { transform: "scale(0.9)" }, {
    transform: "scale(1)",
  }], { duration: 150, easing: "ease-in-out" });
}

button.addEventListener("click", milkCow);
image.addEventListener("click", milkCow);

const wallet = document.createElement("p");
wallet.textContent = `Money:$${money}`;

const sellbutton = document.createElement("button");
sellbutton.textContent = "Sell milk";

sellbutton.addEventListener("click", () => {
  money += milk;
  milk = 0;
  message.textContent = `Milk:${milk}L`;
  wallet.textContent = `Money:$${money}`;
});
const upgradeButton = document.createElement("button");
upgradeButton.textContent = `Upgrade:$${upgradeCost}(+1 L per click)`;

upgradeButton.addEventListener("click", () => {
  if (money < upgradeCost) {
    return;
  }
  money -= upgradeCost;
  milkPerClick += 1;
  upgradeCost = Math.ceil(upgradeCost * 1.5);
  wallet.textContent = `Money:$${money}`;
  upgradeButton.textContent =
    `Upgrade: $${upgradeCost} (+1 L per click)| Current: ${milkPerClick}L`;
  upgradeClickLevel.textContent = `Milk per Click: ${milkPerClick}`;
});

const autoMilkerButton = document.createElement("button");
autoMilkerButton.textContent =
  `Auto-milker: $${autoMilkerCost} (It milks every second!!!!!!!!) `;

autoMilkerButton.addEventListener("click", () => {
  if (money < autoMilkerCost) {
    return;
  }
  money -= autoMilkerCost;
  autoMilkers += 1;
  autoMilkerCost = Math.ceil(autoMilkerCost * 1.5);
  wallet.textContent = `Money:$${money.toFixed(1)}`;
  autoMilkerButton.textContent =
    `Auto-milker: $${autoMilkerCost} (+0.1 L/s) | Owned: ${autoMilkers}`;
  upgradeAutoLevel.textContent = `+${(autoMilkers * 0.1).toFixed(1)}L/sec`;
});

let lastTIme = performance.now();
function update(now: number) { //Runs every second
  const seconds = (now - lastTIme) / 1000;
  lastTIme = now;
  milk += autoMilkers * 0.1 * seconds;
  message.textContent = `Milk: ${milk.toFixed(1)}L`;
  wallet.textContent = `Money:$${money.toFixed(1)}`;
  upgradeButton.disabled = money < upgradeCost;
  autoMilkerButton.disabled = money < autoMilkerCost;
  sellbutton.disabled = milk <= 0;
  requestAnimationFrame(update);
}
requestAnimationFrame(update);

function saveGame() {
  const progress = {
    milk,
    money,
    milkPerClick,
    upgradeCost,
    autoMilkers,
    autoMilkerCost,
  };
  localStorage.setItem("milkGameProgress", JSON.stringify(progress));
}
const savedGame = localStorage.getItem("milkGameProgress");

if (savedGame !== null) {
  try {
    const progress = JSON.parse(savedGame);

    milk = progress.milk;
    money = progress.money;
    milkPerClick = progress.milkPerClick;
    upgradeCost = progress.upgradeCost;
    autoMilkers = progress.autoMilkers;
    autoMilkerCost = progress.autoMilkerCost;

    upgradeClickLevel.textContent = `Milk per Click: ${milkPerClick}`;
    upgradeAutoLevel.textContent = `+${(autoMilkers * 0.1).toFixed(1)}L/sec`;

    upgradeButton.textContent =
      `Upgrade: $${upgradeCost} (+1 L per click) | Current: ${milkPerClick}L`;

    autoMilkerButton.textContent =
      `Auto-milker: $${autoMilkerCost} (+0.1 L/s) | Owned: ${autoMilkers}`;
  } catch {
    console.log("Could not load saved progress.");
  }
}
setInterval(saveGame, 5000);

app.append(
  heading,
  statsContainer,
  image,
  message,
  button,
  sellbutton,
  wallet,
  upgradeButton,
  autoMilkerButton,
);
