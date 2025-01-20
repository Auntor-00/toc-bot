function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function clickButton(buttonText) {
  const button = Array.from(document.querySelectorAll("button")).find(
    (b) => b.textContent.trim() === buttonText
  );
  if (button) {
    button.click();
    console.log(`Clicked "${buttonText}"`);
  } else {
    console.warn(`Button "${buttonText}" not found.`);
  }
}

function playBeep() {
  const context = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = context.createOscillator();
  const gainNode = context.createGain();

  oscillator.type = "square";
  oscillator.frequency.setValueAtTime(1000, context.currentTime);
  gainNode.gain.setValueAtTime(0.5, context.currentTime);

  oscillator.connect(gainNode);
  gainNode.connect(context.destination);

  oscillator.start();
  oscillator.stop(context.currentTime + 1);
}

async function mainLoop() {
  console.log("Starting process...");
  let mineStartTime = 0;

  while (true) {
    // Click "MINE" button
    clickButton("MINE");
    console.log("Clicked MINE");
    mineStartTime = Date.now();
    await sleep(2000); // Wait 2 seconds for the action to register

    // Click "Got it" button after clicking "MINE"
    clickButton("Got it");
    console.log("Clicked Got it");

    // Calculate remaining time to complete 60 seconds since "MINE" was clicked
    const elapsedTime = Date.now() - mineStartTime;
    const remainingTime = Math.max(60000 - elapsedTime, 0);

    // Wait for the remaining time
    console.log(`Waiting for ${remainingTime / 1000} seconds...`);
    await sleep(remainingTime);

    // Click "Mine more!" button
    clickButton("Mine more!");
    console.log("Clicked Mine more!");
  }
}

