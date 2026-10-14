// Vite turns this import into a production-safe URL. Keep it as a file so
// even this tiny example demonstrates a separately deployed asset.
// @deno-types="./asset-url.d.ts"
import tileUrl from "./assets/cow.svg?no-inline";

import milkSoundUrl from "./assets/milk-drip-sfx.mp3?no-inline";
import sellSoundUrl from "./assets/sell-milk-sfx.mp3?no-inline";
import upgradeSoundUrl from "./assets/upgrade-sfx.mp3?no-inline";
import upgradeAutoSoundUrl from "./assets/upgrade-auto-sfx.mp3?no-inline";
import upgradeBucketSoundUrl from "./assets/upgrade-bucket-sfx.mp3?no-inline";
import grassSoundUrl from "./assets/grass-sfx.mp3?no-inline";
import appleSoundUrl from "./assets/apple-sfx.mp3?no-inline";
import deathSoundUrl from "./assets/death-sfx.mp3?no-inline";
import bgMusicUrl from "./assets/backround-sfx.mp3?no-inline";

const bgMusic = new Audio(bgMusicUrl);
bgMusic.loop = true;
bgMusic.volume = 0.075;

const milkSound = new Audio(milkSoundUrl);
milkSound.volume = 0.5;
const sellSound = new Audio(sellSoundUrl);
sellSound.volume = 0.1;
const upgradeSound = new Audio(upgradeSoundUrl);
upgradeSound.volume = 0.1;
const upgradeAutoSound = new Audio(upgradeAutoSoundUrl);
upgradeAutoSound.volume = 0.3;
const upgradeBucketSound = new Audio(upgradeBucketSoundUrl);
upgradeBucketSound.volume = 0.05;
const grassSound = new Audio(grassSoundUrl);
grassSound.volume = 0.3;
const appleSound = new Audio(appleSoundUrl);
appleSound.volume = 0.3;
const deathSound = new Audio(deathSoundUrl);
deathSound.volume = 0.5;

const app = document.querySelector<HTMLElement>("#app")!;
app.style.textAlign = "center";
document.body.style.background =
  "linear-gradient(to bottom, #dff3ff 0%, #edf9ff 45%, #b6d887 45%, #79ad58 100%)";
document.body.style.minHeight = "100vh";
document.body.style.color = "#3e3529";
document.body.style.fontFamily = "Arial, sans-serif";
document.body.style.margin = "0";

const style = document.createElement("style");
style.textContent = `
  button {
    transition: transform 0.1s ease, box-shadow 0.15s ease, background-color 0.15s ease;
  }
  button:not(.udder-target):not(:disabled):hover {
    background-color: #d4e3c8 !important;
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
    cursor: pointer;
  }
  button:not(.udder-target):not(:disabled):active {
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
image.style.cursor = "default";
image.style.margin = "0";
image.style.width = "100%";

const cowScene = document.createElement("div");
cowScene.style.position = "relative";
cowScene.style.width = "300px";
cowScene.style.margin = "20px 0";
cowScene.style.background = "transparent";
cowScene.style.borderRadius = "0";

const udderButton = document.createElement("button");
udderButton.className = "udder-target";
udderButton.type = "button";
udderButton.setAttribute("aria-label", "Milk the cow");
udderButton.style.position = "absolute";
udderButton.style.left = "64%";
udderButton.style.top = "60%";
udderButton.style.width = "15%";
udderButton.style.height = "13%";
udderButton.style.padding = "0";
udderButton.style.background = "rgba(255, 170, 190, 0.25)";
udderButton.style.border = "2px dashed #d87991";
udderButton.style.borderRadius = "50%";
udderButton.style.cursor = "grab";

cowScene.append(image, udderButton);

let milk = 0;
let cowHealth = 100;
let rescueUsed = false;
let isResting = false;
let milkPerClick = 0.1;
let bucketCapacity = 5;
let bucketCost = 3;
let upgradeCost = 2;
let autoMilkers = 0;
let autoMilkerCost = 10;

const restButton = document.createElement("button");
restButton.textContent = "Let the cow rest";
restButton.addEventListener("click", () => {
  if (cowHealth <= 0) {
    return;
  }

  isResting = !isResting;
});
const healthInfo = document.createElement("p");
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
const rescueButton = document.createElement("button");
rescueButton.textContent = "🚑 Rescue cow: $5 (+30 health)";

rescueButton.addEventListener("click", () => {
  if (cowHealth > 0 || rescueUsed || money < 5) {
    return;
  }

  money -= 5;
  cowHealth = 30;
  rescueUsed = true;
  isResting = true;
  saveGame();
});
function feedCow(cost: number, healing: number) {
  if (money < cost || cowHealth <= 0 || cowHealth >= 100) {
    return;
  }

  money -= cost;
  cowHealth = Math.min(100, cowHealth + healing);
  saveGame();
}

const grassButton = document.createElement("button");
grassButton.textContent = "🌿 Grass: $1 (+20 health)";
grassButton.addEventListener("click", () => {
  feedCow(1, 20);
  grassSound.currentTime = 0;
  grassSound.play();
});

const treatButton = document.createElement("button");
treatButton.textContent = "🍎 Treat: $3 (+50 health)";
treatButton.addEventListener("click", () => {
  feedCow(3, 50);
  appleSound.currentTime = 0;
  appleSound.play();
});
let isMusicPlaying = false;
let isCowDead = false;

function startBackgroundMusic() {
  if (!isMusicPlaying) {
    bgMusic.play();
    isMusicPlaying = true;
  }
}
function deathSoundStart() {
  if (!isCowDead) {
    deathSound.play();
    isCowDead = true;
  }
}

function splashMilk(x: number, y: number, count = 6) {
  for (let i = 0; i < count; i++) {
    const splash = document.createElement("div");
    splash.style.position = "fixed";
    splash.style.left = `${x - 3}px`;
    splash.style.top = `${y - 3}px`;
    splash.style.width = "6px";
    splash.style.height = "6px";
    splash.style.backgroundColor = "#fffdf5";
    splash.style.border = "1px solid #b9c9d4";
    splash.style.borderRadius = "50%";
    splash.style.pointerEvents = "none";
    splash.style.zIndex = "1000";
    document.body.appendChild(splash);

    const dx = (Math.random() - 0.5) * 80;
    const rise = 12 + Math.random() * 20;

    const animation = splash.animate(
      [
        { transform: "translate(0, 0)", opacity: 1 },
        {
          transform: `translate(${dx * 0.5}px, ${-rise}px)`,
          opacity: 1,
          offset: 0.45,
        },
        {
          transform: `translate(${dx}px, 10px) scale(0.4)`,
          opacity: 0,
        },
      ],
      {
        duration: 350,
        easing: "linear",
        fill: "forwards",
      },
    );

    animation.onfinish = () => splash.remove();
  }
}
function spawnMilkDrop() {
  const source = udderButton.getBoundingClientRect();
  const target = bucketVisual.getBoundingClientRect();

  const startX = source.left + source.width / 2;
  const startY = source.bottom;
  splashMilk(startX, startY, 3);
  const endX = target.left + target.width / 2;
  const endY = target.top + 12;

  const drop = document.createElement("div");
  drop.style.position = "fixed";
  drop.style.left = `${startX - 5}px`;
  drop.style.top = `${startY}px`;
  drop.style.width = "10px";
  drop.style.height = "16px";
  drop.style.backgroundColor = "#fffdf5";
  drop.style.border = "1px solid #b9c9d4";
  drop.style.borderRadius = "50%";
  drop.style.pointerEvents = "none";
  drop.style.zIndex = "1000";

  document.body.appendChild(drop);

  const animation = drop.animate(
    [
      { transform: "translate(0, 0)", opacity: 1 },
      {
        transform: `translate(${endX - startX}px, ${endY - startY}px)`,
        opacity: 1,
      },
      {
        transform: `translate(${endX - startX}px, ${
          endY - startY
        }px) scale(1.5, 0.3)`,
        opacity: 0,
      },
    ],
    {
      duration: 600,
      easing: "ease-in",
      fill: "forwards",
    },
  );

  animation.onfinish = () => {
    drop.remove();
    splashMilk(endX, endY);
  };
}
function milkCow(e: MouseEvent) {
  if (cowHealth <= 0 || isResting) {
    return;
  }
  startBackgroundMusic();
  const before = milk;
  milk += Math.min(
    milkPerClick,
    Math.max(0, bucketCapacity - milk),
    cowHealth / 5,
  );
  const gained = milk - before;
  cowHealth = Math.max(0, cowHealth - gained * 5);

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
    milkSound.currentTime = 0;
    milkSound.play();
    spawnMilkDrop();
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
udderButton.addEventListener("click", milkCow);

const wallet = document.createElement("p");
wallet.textContent = `Money:$${money}`;

const sellbutton = document.createElement("button");
sellbutton.textContent = "Sell milk";

sellbutton.addEventListener("click", () => {
  money += milk;
  milk = 0;
  message.textContent = `Milk:${milk}L`;
  wallet.textContent = `Money:$${money}`;
  sellSound.currentTime = 0;
  sellSound.play();
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

  upgradeSound.currentTime = 0;
  upgradeSound.play();
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
  upgradeAutoSound.currentTime = 0;
  upgradeAutoSound.play();
});

const bucketInfo = document.createElement("p");
const bucketVisual = document.createElement("div");
bucketVisual.style.position = "absolute";
bucketVisual.style.left = "71.5%";
bucketVisual.style.top = "85%";
bucketVisual.style.transform = "translateX(-50%)";
bucketVisual.style.width = "60px";
bucketVisual.style.height = "80px";
bucketVisual.style.margin = "0 auto";
bucketVisual.style.border = "4px solid #3e3529";
bucketVisual.style.borderRadius = "0 0 15px 15px";
bucketVisual.style.backgroundColor = "#fff";

const bucketHandle = document.createElementNS(
  "http://www.w3.org/2000/svg",
  "svg",
);
bucketHandle.setAttribute("width", "50");
bucketHandle.setAttribute("height", "22");
bucketHandle.style.position = "absolute";
bucketHandle.style.top = "-20px";
bucketHandle.style.left = "50%";
bucketHandle.style.transform = "translateX(-50%)";
bucketHandle.style.overflow = "visible";

const handlePath = document.createElementNS(
  "http://www.w3.org/2000/svg",
  "path",
);
handlePath.setAttribute("d", "M 3 22 Q 3 2, 25 2 Q 47 2, 47 22");
handlePath.setAttribute("fill", "none");
handlePath.setAttribute("stroke", "#3e3529");
handlePath.setAttribute("stroke-width", "4");
handlePath.setAttribute("stroke-linecap", "round");
bucketHandle.appendChild(handlePath);

bucketVisual.appendChild(bucketHandle);

const milkFill = document.createElement("div");
milkFill.style.width = "100%";
milkFill.style.height = "0%";
milkFill.style.position = "absolute";
milkFill.style.bottom = "0";
milkFill.style.left = "0";
milkFill.style.backgroundColor = "#f7f2e7";
milkFill.style.transition = "height 0.3s ease";
milkFill.style.borderRadius = "0 0 11px 11px";
bucketVisual.appendChild(milkFill);
cowScene.appendChild(bucketVisual);

const bucketButton = document.createElement("button");
let lastTIme = performance.now();
function update(now: number) { //just incase u dont know what is this for Runs every second and updates the milk and money values based on the auto-milkers and other factors
  const seconds = (now - lastTIme) / 1000;
  lastTIme = now;
  if (isResting) {
    if (cowHealth > 0) {
      cowHealth = Math.min(100, cowHealth + 2 * seconds);
    }
  } else {
    const autoGained = Math.min(
      autoMilkers * 0.1 * seconds,
      Math.max(0, bucketCapacity - milk),
      cowHealth > 0 ? Infinity : 0,
    );

    milk += autoGained;
  }
  message.textContent = `Milk: ${milk.toFixed(1)}L`;
  wallet.textContent = `Money:$${money.toFixed(1)}`;
  upgradeButton.disabled = money < upgradeCost;
  autoMilkerButton.disabled = money < autoMilkerCost;
  sellbutton.disabled = milk <= 0;
  bucketInfo.textContent = `Bucket: ${milk.toFixed(1)} / ${bucketCapacity} L`;
  const fillPercentage = (milk / bucketCapacity) * 100;
  milkFill.style.height = `${Math.min(100, fillPercentage)}%`;

  bucketButton.textContent = `Bigger bucket: $${bucketCost} (+5 L)`;
  bucketButton.disabled = money < bucketCost;
  button.disabled = cowHealth <= 0 || isResting || milk >= bucketCapacity;
  udderButton.disabled = button.disabled;

  restButton.textContent = isResting ? "Resume milking" : "Let the cow rest";

  restButton.disabled = cowHealth <= 0;
  if (cowHealth <= 0 && !rescueUsed) {
    healthInfo.textContent = rescueUsed
      ? "Your cow has died."
      : "⚠ Your cow has collapsed! Rescue it for $5. You can still sell stored milk.";
  } else if (cowHealth <= 0) {
    bgMusic.pause();
    bgMusic.currentTime = 0;
    deathSoundStart();
    healthInfo.textContent = rescueUsed ? "Your cow has died." : "⚠ GAME OVER";
  } else if (cowHealth <= 30) {
    healthInfo.textContent = `⚠ Health: ${
      cowHealth.toFixed(1)
    }/100 — feed your cow or let it rest!`;
  } else {
    healthInfo.textContent = `Cow health: ${cowHealth.toFixed(1)} / 100`;
  }

  rescueButton.hidden = cowHealth > 0 || rescueUsed;
  rescueButton.disabled = money < 5;
  healthInfo.style.color = cowHealth <= 30 ? "#b83232" : "#4a7a3a";
  grassButton.disabled = money < 1 || cowHealth <= 0 || cowHealth >= 100;
  treatButton.disabled = money < 3 || cowHealth <= 0 || cowHealth >= 100;
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
  upgradeBucketSound.currentTime = 0;
  upgradeBucketSound.play();
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
    cowHealth,
    isResting,
    rescueUsed,
  };
  localStorage.setItem("milkGameProgress", JSON.stringify(progress));
}
const savedGame = localStorage.getItem("milkGameProgress");

if (savedGame !== null) {
  try {
    const progress = JSON.parse(savedGame);

    milk = progress.milk;
    cowHealth = progress.cowHealth ?? 100;
    rescueUsed = progress.rescueUsed ?? false;
    isResting = progress.isResting ?? false;
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
const feedPanel = document.createElement("div");
feedPanel.style.display = "flex";
feedPanel.style.flexDirection = "column";
feedPanel.style.gap = "12px";
feedPanel.style.width = "160px";

const feedTitle = document.createElement("h3");
feedTitle.textContent = "Care for your cow";
feedPanel.append(feedTitle, grassButton, treatButton, rescueButton);

for (const item of [grassButton, treatButton]) {
  item.style.padding = "16px";
  item.style.borderRadius = "12px";
  item.style.border = "1px solid #b5c7aa";
  item.style.backgroundColor = "#e0ead8";
}

const farmArea = document.createElement("div");
farmArea.style.display = "flex";
farmArea.style.justifyContent = "center";
farmArea.style.alignItems = "center";
farmArea.style.flexWrap = "wrap";
farmArea.style.gap = "24px";

farmArea.append(feedPanel, cowScene);
app.append(
  heading,
  wallet,
  statsContainer,
  farmArea,
  healthInfo,
  message,
  bucketInfo,
  button,
  sellbutton,
  restButton,
  shop,
);
