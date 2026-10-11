// Vite turns this import into a production-safe URL. Keep it as a file so
// even this tiny example demonstrates a separately deployed asset.
// @deno-types="./asset-url.d.ts"
import tileUrl from "./assets/tile.svg?no-inline";

const app = document.querySelector<HTMLElement>("#app")!;

const heading = document.createElement("h1");
heading.textContent = "Milk a COW!!";

const image = document.createElement("img");
image.src = tileUrl;
image.alt = "A teal tile with a cream circle";
image.width = 96;
image.height = 96;

let milk = 0;
let milkPerClick = 1;
const message = document.createElement("p");
message.textContent = `Milk:${milk}L`;

const button = document.createElement("button");
button.textContent = "Milk Me!";
button.type = "button";
let money = 0;

button.addEventListener("click", (event: MouseEvent) => {
  console.log("Button clicked!", button.textContent);
  milk += milkPerClick;
  message.textContent = `Milk:${milk}L`;
});

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
upgradeButton.textContent = "Upgrade:$20(+1 L per click)";

upgradeButton.addEventListener("click", () => {
  if (money < 20) {
    return;
  }
  money -= 20;
  milkPerClick += 1;
  wallet.textContent = `Money:$${money}`;
  upgradeButton.textContent =
    `Upgrad: $20 (+1 L per click)| Current: ${milkPerClick}L`;
});
app.append(heading, image, message, button, sellbutton, wallet, upgradeButton);
