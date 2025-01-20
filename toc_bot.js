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

async function handleCaptcha() {
  const captcha = Array.from(document.querySelectorAll("p.text-sm")).find((p) =>
    p.textContent.startsWith("To prevent")
  );

  if (captcha) {
    console.error("Captcha detected!");

    // Play beep sound and vibrate
    playBeep();
    if (navigator.vibrate) navigator.vibrate([500, 500, 500]);

    console.log("Waiting for you to solve the captcha...");
    while (Array.from(document.querySelectorAll("p.text-sm")).some((p) =>
      p.textContent.startsWith("To prevent")
    )) {
      await sleep(1000); // Wait for the captcha to be solved
    }

    console.log("Captcha solved! Resuming...");
    await sleep(2000); // Small delay before continuing
  }
}

async function mainLoop() {
  console.log("Starting process...");
  while (true) {
    // Click "MINE" button
    clickButton("MINE");
    console.log("Clicked MINE");

    // Record the time the "MINE" button was clicked
    const mineStartTime = Date.now();

    await sleep(2000); // Wait 2 seconds before checking for "Got it"

    // Handle captcha if detected
    await handleCaptcha();

    // Click "Got it" button
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

    // Short delay before restarting the loop
    await sleep(2000);
  }
}

mainLoop();

