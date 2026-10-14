// Vite turns this import into a production-safe URL. Keep it as a file so
// even this tiny example demonstrates a separately deployed asset.
// @deno-types="./asset-url.d.ts"
import tileUrl from "./assets/semi-flat-sideways-milk-cow.jpg?no-inline";

const app = document.querySelector<HTMLElement>("#app")!;
app.style.textAlign = "center";
document.body.style.backgroundColor = "#ffffff";
document.body.style.color = "#3e3529";
document.body.style.fontFamily = "Arial, sans-serif";
document.body.style.margin = "0";

const style = document.createElement("style");
style.textContent = `
  button {
    transition: transform 0.1s ease, box-shadow 0.15s ease, background-color 0.15s ease;
  }
  button:not(:disabled):hover {
    background-color: #d4e3c8 !important;
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
    cursor: pointer;
  }
  button:not(:disabled):active {
    transform: translateY(0) scale(0.97);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  }
  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    filter: grayscale(0.4);
  }
`;

document.head.appendChild(style);
app.style.maxWidth = "800px";
app.style.margin = "40px auto";
app.style.padding = "24px";
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
let milkPerClick = 0.1;
let bucketCapacity = 5;
let bucketCost = 3;
let upgradeCost = 2;
let autoMilkers = 0;
let autoMilkerCost = 10;
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

function milkCow(e: MouseEvent) {
  const before = milk;
  milk = Math.min(bucketCapacity, milk + milkPerClick);
  const gained = milk - before;

  message.textContent = `Milk:${milk.toFixed(1)}L`;
  image.animate([{ transform: "scale(1)" }, { transform: "scale(0.9)" }, {
    transform: "scale(1)",
  }], { duration: 150, easing: "ease-in-out" });

  if (gained > 0) {
    spawnFloatingText(
      `+${gained.toFixed(2)}L`,
      e.clientX,
      e.clientY,
      "#4a7a3a",
    );
  }
}
function spawnFloatingText(text: string, x: number, y: number, color: string) {
  const el = document.createElement("div");
  el.textContent = text;
  el.style.position = "fixed";
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;
  el.style.color = color;
  el.style.fontWeight = "bold";
  el.style.fontSize = "18px";
  el.style.pointerEvents = "none";
  el.style.zIndex = "1000";
  el.style.transition = "transform 0.8s ease-out, opacity 0.8s ease-out";
  document.body.appendChild(el);

  requestAnimationFrame(() => {
    el.style.transform = "translateY(-40px)";
    el.style.opacity = "0";
  });

  setTimeout(() => el.remove(), 800);
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
upgradeButton.textContent = `Upgrade:$${upgradeCost}(+0.05 L per click)`;

upgradeButton.addEventListener("click", () => {
  if (money < upgradeCost) {
    return;
  }
  money -= upgradeCost;
  milkPerClick = Math.round((milkPerClick + 0.05) * 100) / 100;
  upgradeCost = Math.ceil(upgradeCost * 1.5);
  wallet.textContent = `Money:$${money}`;
  upgradeButton.textContent =
    `Upgrade: $${upgradeCost} (+0.05 L per click)| Current: ${
      milkPerClick.toFixed(2)
    }L`;
  upgradeClickLevel.textContent = `Milk per Click: ${milkPerClick.toFixed(2)}L`;
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
const bucketInfo = document.createElement("p");
const bucketButton = document.createElement("button");
let lastTIme = performance.now();
function update(now: number) { //Runs every second
  const seconds = (now - lastTIme) / 1000;
  lastTIme = now;
  milk = Math.min(bucketCapacity, milk + autoMilkers * 0.1 * seconds);
  message.textContent = `Milk: ${milk.toFixed(1)}L`;
  wallet.textContent = `Money:$${money.toFixed(1)}`;
  upgradeButton.disabled = money < upgradeCost;
  autoMilkerButton.disabled = money < autoMilkerCost;
  sellbutton.disabled = milk <= 0;
  bucketInfo.textContent = `Bucket: ${milk.toFixed(1)} / ${bucketCapacity} L`;

  bucketButton.textContent = `Bigger bucket: $${bucketCost} (+5 L)`;

  bucketButton.disabled = money < bucketCost;
  requestAnimationFrame(update);
}
requestAnimationFrame(update);

bucketButton.addEventListener("click", () => {
  if (money < bucketCost) {
    return;
  }
  money -= bucketCost;
  bucketCapacity += 5;
  bucketCost = Math.ceil(bucketCost * 1.5);
  wallet.textContent = `Money:$${money.toFixed(1)}`;
  bucketButton.textContent = `Bigger bucket: $${bucketCost} (+5 L)`;
  bucketInfo.textContent = `Bucket: ${milk.toFixed(1)} / ${bucketCapacity} L`;
});
function saveGame() {
  const progress = {
    milk,
    money,
    milkPerClick,
    upgradeCost,
    autoMilkers,
    autoMilkerCost,
    bucketCapacity,
    bucketCost,
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
    bucketCapacity = progress.bucketCapacity ?? 5;
    bucketCost = progress.bucketCost ?? 10;

    upgradeClickLevel.textContent = `Milk per Click: ${milkPerClick}`;
    upgradeAutoLevel.textContent = `+${(autoMilkers * 0.1).toFixed(1)}L/sec`;

    upgradeButton.textContent =
      `Upgrade: $${upgradeCost} (+0.05 L per click) | Current: ${milkPerClick}L`;

    autoMilkerButton.textContent =
      `Auto-milker: $${autoMilkerCost} (+0.1 L/s) | Owned: ${autoMilkers}`;
  } catch {
    console.log("Could not load saved progress.");
  }
}
setInterval(saveGame, 5000);
const shop = document.createElement("div");
shop.style.display = "flex";
shop.style.justifyContent = "center";
shop.style.flexWrap = "wrap";
shop.style.gap = "12px";
shop.style.marginTop = "24px";

shop.append(upgradeButton, autoMilkerButton, bucketButton);

for (const item of [upgradeButton, autoMilkerButton, bucketButton]) {
  item.style.width = "220px";
  item.style.minHeight = "90px";
  item.style.padding = "16px";
  item.style.backgroundColor = "#e0ead8";
  item.style.color = "#30452b";
  item.style.border = "1px solid #b5c7aa";
  item.style.borderRadius = "12px";
  item.style.fontSize = "15px";
}
app.append(
  heading,
  wallet,
  statsContainer,
  image,
  message,
  bucketInfo,
  button,
  sellbutton,
  shop,
);
