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

const button = document.createElement("button");
button.textContent = "Milk Me!";
button.type = "button";
let milk = 0;
const message = document.createElement("p");
message.textContent = `Milk:${milk}L`;
button.addEventListener("click", (event: MouseEvent) => {
  const target = event.target as HTMLButtonElement;
  console.log("Button clicked!", button.textContent);
  milk++;
});

app.append(heading, image, message, button);
