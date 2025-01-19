// Function to introduce a delay
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Function to click a button based on its text content
function clickButton(buttonText) {
  const button = Array.from(document.querySelectorAll("button")).find((btn) => btn.textContent.trim() === buttonText);
  if (button) {
    button.click();
    console.log(`${buttonText} button clicked.`);
  }
}

// Function to play sound on captcha detection
function playSound() {
  const context = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = context.createOscillator();
  const gainNode = context.createGain();
  oscillator.type = 'square';
  oscillator.frequency.setValueAtTime(440, context.currentTime);
  gainNode.gain.setValueAtTime(0.1, context.currentTime);
  oscillator.connect(gainNode);
  gainNode.connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + 0.75);
}

// Function to solve Math captcha
async function solveMathCaptcha() {
  console.error("Math Captcha detected.");
  playSound();
  await delay(2000);  // Wait for captcha to appear
  const captchaText = document.querySelector("p.text-sm").textContent;
  const numbers = captchaText.match(/\d+/g);
  if (numbers && numbers.length > 1) {
    const result = parseInt(numbers[0]) + parseInt(numbers[1]);
    console.log(`Math captcha result: ${result}`);
    const resultInput = Array.from(document.querySelectorAll("input")).find((input) => input.placeholder === "result");
    if (resultInput) {
      resultInput.value = result;
      resultInput.dispatchEvent(new Event("input", { bubbles: true }));
      clickButton("Verify");
    }
  }
  await delay(1500);  // Wait for verification to process
}

// Function to solve Star captcha (Star detection using canvas)
async function solveStarCaptcha() {
  console.error("Star captcha detected!");
  await delay(2000);  // Wait for captcha to appear
  
  const canvas = document.querySelector("canvas");
  if (!canvas) {
    console.error("Canvas not found for star captcha.");
    return false;
  }
  const context = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  const imageData = context.getImageData(0, 0, width, height).data;
  
  // Star detection logic: looking for white pixels on dark background (this can vary)
  function isWhitePixel(r, g, b, a) {
    return r < 50 && g < 50 && b < 50 && a > 200;
  }

  let starCount = 0;
  const visited = new Set();
  const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
  
  function exploreStar(x, y) {
    const stack = [[x, y]];
    while (stack.length) {
      const [cx, cy] = stack.pop();
      const idx = 4 * (cy * width + cx);
      if (cx >= 0 && cy >= 0 && cx < width && cy < height && !visited.has(`${cx},${cy}`) && isWhitePixel(imageData[idx], imageData[idx + 1], imageData[idx + 2], imageData[idx + 3])) {
        visited.add(`${cx},${cy}`);
        for (const [dx, dy] of directions) {
          stack.push([cx + dx, cy + dy]);
        }
      }
    }
  }
  
  // Loop through the canvas pixels and count "star-like" areas
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = 4 * (y * width + x);
      if (isWhitePixel(imageData[idx], imageData[idx + 1], imageData[idx + 2], imageData[idx + 3]) && !visited.has(`${x},${y}`)) {
        starCount++;
        exploreStar(x, y);
      }
    }
  }

  console.log(`Detected ${starCount} stars.`);
  
  // Enter the star count into the input and verify
  const starInput = document.querySelector("input[placeholder='result']");
  if (starInput) {
    starInput.value = starCount;
    starInput.dispatchEvent(new Event("input", { bubbles: true }));
    clickButton("Verify");
  }
  
  await delay(1500);  // Wait for verification to process
}

// Main logic to handle the mining process and captcha solving
async function mineProcess() {
  console.log("Starting mining process...");
  
  // Loop to continuously check and mine
  while (true) {
    // Wait for 'MINE' button to be available
    clickButton("MINE");
    console.log("Pressed MINE");

    // Wait before checking for captchas or blocks
    await delay(2000);
    
    const captchaMessage = document.querySelector("p.text-sm")?.textContent || '';
    
    // If you're temporarily blocked
    if (captchaMessage.includes("You're temporarily blocked")) {
      console.error("You are temporarily blocked!");
      const blockDuration = captchaMessage.match(/(\d+)\s+minutes/);
      if (blockDuration) {
        const blockTime = parseInt(blockDuration[1], 10) * 60 * 1000;
        console.log(`Sleeping for ${blockTime / 1000 / 60} minute(s)...`);
        await delay(blockTime);
        console.log("Block time passed, resuming...");
      }
      continue;  // Continue mining after the block is over
    }

    // Handle captcha detection
    if (captchaMessage.includes("To prevent abuse")) {
      // Math or Star Captcha handling
      if (captchaMessage.includes("result of the following calculation:")) {
        await solveMathCaptcha();
      } else if (captchaMessage.includes("How many stars do you see:")) {
        await solveStarCaptcha();
      }
    }

    // Handle 'Got it' button
    if (document.body.textContent.includes("You have started")) {
      clickButton("Got it");
      console.log("Pressed Got it");
      await delay(57000);  // Wait for 57 seconds (adjust as needed)
      clickButton("Mine more!");
      console.log("Pressed 'Mine more!'");
    }

    await delay(1500);  // Small delay to avoid rapid action
  }
}

// Start the mining process
mineProcess();

