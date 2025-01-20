let audioContext = new (window.AudioContext || window.webkitAudioContext)();

function playBeep() {
  console.log("Playing beep...");
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.type = "square";
  oscillator.frequency.setValueAtTime(1000, audioContext.currentTime);
  gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.start();
  oscillator.stop(audioContext.currentTime + 1);
}

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

async function handleCaptcha() {
  const captcha = Array.from(document.querySelectorAll("p.text-sm")).find((p) =>
    p.textContent.startsWith("To prevent")
  );

  if (captcha) {
    console.error("Captcha detected!");

    // Play beep sound immediately after detecting captcha
    playBeep();
    if (navigator.vibrate) navigator.vibrate([500, 500, 500]);

    console.log("Waiting for captcha to be solved manually...");
    while (document.querySelector("p.text-sm")) {
      await sleep(1000); // Wait for captcha to disappear
    }
    console.log("Captcha solved! Checking for 'Got it' button...");
    await sleep(2000); // Wait for page to stabilize

    // Retry clicking 'Got it' button for a few attempts
    for (let i = 0; i < 5; i++) {
      clickButton("Got it");
      await sleep(2000); // Retry every 2 seconds for up to 10 seconds
    }
    console.log("Captcha handling complete. Resuming process...");
  }
}

async function mainLoop() {
  console.log("Starting process...");
  while (true) {
    console.log("Attempting to click 'MINE'...");
    clickButton("MINE");

    const mineStartTime = Date.now();
    await sleep(2000);

    console.log("Checking for 'Got it' button...");
    for (let i = 0; i < 5; i++) {
      clickButton("Got it");
      await sleep(2000); // Retry every 2 seconds for up to 10 seconds
    }

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

// Start the process immediately without needing a user click
mainLoop();
