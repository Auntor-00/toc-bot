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
    clickButton("MINE");
    console.log("Clicked MINE");
    await sleep(2000);

    // Handle captcha if detected
    await handleCaptcha();

    const gotIt = Array.from(document.querySelectorAll("p.text-sm")).find((p) =>
      p.textContent.includes("You have started")
    );
    if (gotIt) {
      clickButton("Got it");
      console.log("Clicked Got it");
      await sleep(57000); // Wait 57 seconds (almost 1 block)
      clickButton("Mine more!");
      console.log("Clicked Mine more!");
    }

    await sleep(2000); // Slight delay before looping
  }
}

mainLoop();
