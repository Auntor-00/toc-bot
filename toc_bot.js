function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function clickButton(buttonText) {
  const button = Array.from(document.querySelectorAll("button")).find(
    (b) => b.textContent.trim() === buttonText
  );
  if (button) button.click();
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
  // Detect captcha
  const captcha = Array.from(document.querySelectorAll("p.text-sm")).find((p) =>
    p.textContent.startsWith("To prevent")
  );

  if (captcha) {
    console.error("Captcha detected!");

    // Play beep sound and vibrate
    playBeep();
    if (navigator.vibrate) navigator.vibrate([500, 500, 500]);

    console.log("Waiting for you to solve the captcha...");
    while (captcha && document.querySelector("p.text-sm")) {
      await sleep(1000); // Wait until the captcha disappears
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

    const mineStartTime = Date.now();

    await sleep(2000); // Wait 2 seconds for "Got it" button to appear
    clickButton("Got it");
    console.log("Clicked Got it");

    // Wait for remaining time to complete 60 seconds
    const elapsedTime = Date.now() - mineStartTime;
    const remainingTime = 60000 - elapsedTime;

    if (remainingTime > 0) {
      console.log(`Waiting for ${remainingTime / 1000} seconds...`);
      await sleep(remainingTime);
    }

    // Click "Mine more!" button
    clickButton("Mine more!");
    console.log("Clicked Mine more!");
    await sleep(2000); // Short delay to stabilize the process

    // Handle captcha if it appears
    await handleCaptcha();
  }
}

mainLoop();
