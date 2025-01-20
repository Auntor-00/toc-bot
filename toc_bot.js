function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function clickButton(buttonText) {
  const button = Array.from(document.querySelectorAll("button")).find(
    (b) => b.textContent.trim() === buttonText
  );
  if (button) {
    console.log(`Clicking button: ${buttonText}`);
    button.click();
  } else {
    console.warn(`Button not found: ${buttonText}`);
  }
}

function playBeep() {
  console.log("Playing beep...");
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

    playBeep();
    if (navigator.vibrate) navigator.vibrate([500, 500, 500]);

    console.log("Waiting for captcha to be solved manually...");
    while (document.querySelector("p.text-sm")) {
      await sleep(1000); // Wait for captcha to disappear
    }
    console.log("Captcha solved! Resuming process...");
    await sleep(2000);
  }
}

async function mainLoop() {
  console.log("Starting process...");

  while (true) {
    console.log("Attempting to click 'MINE'...");
    clickButton("MINE");

    const mineStartTime = Date.now();
    await sleep(2000);

    console.log("Attempting to click 'Got it'...");
    clickButton("Got it");

    const elapsedTime = Date.now() - mineStartTime;
    const remainingTime = 60000 - elapsedTime;

    if (remainingTime > 0) {
      console.log(`Waiting for ${remainingTime / 1000} seconds...`);
      await sleep(remainingTime);
    }

    console.log("Attempting to click 'Mine more!'...");
    clickButton("Mine more!");

    await sleep(2000);
    console.log("Handling captcha if necessary...");
    await handleCaptcha();
  }
}

mainLoop();
