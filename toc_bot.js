function t(t) {
  return new Promise((e) => setTimeout(e, t));
}

function e(t) {
  const e = Array.from(document.querySelectorAll("button")).find((e) => e.textContent.trim() === t);
  e && e.click();
}

function o() {
  const t = new(window.AudioContext || window.webkitAudioContext),
        e = t.createOscillator(),
        o = t.createGain();
  e.type = "square";
  e.frequency.setValueAtTime(440, t.currentTime);
  o.gain.setValueAtTime(0.1, t.currentTime);
  e.connect(o);
  o.connect(t.destination);
  e.start();
  e.stop(t.currentTime + 0.75);
}

async function n() {
  const n = Array.from(document.querySelectorAll("p.text-sm")).find((t) => t.textContent.startsWith("To prevent"));
  if (n) {
    const r = n.textContent;
    if (r.includes("result of the following calculation:")) {
      console.error("Math Captcha Arrived.");
      o();
      await t(2000);
      const n = Array.from(document.querySelectorAll("button")).find((t) => "Close" === t.querySelector("span")?.textContent.trim());
      n && n.click();
      console.log("Captcha Closed.");
      await t(10000);
      await e("MINE");
      return false;
    }
    if (r.includes("How many stars do you see:")) {
      console.error("Star captcha detected!");
      if (Array.from(document.querySelectorAll("div.text-sm")).find((t) => t.textContent.startsWith("Verification failed."))) {
        console.error("Captcha Failed!");
        o();
        await t(10000);
        const n = Array.from(document.querySelectorAll("button")).find((t) => "Close" === t.querySelector("span")?.textContent.trim());
        n && n.click();
        console.log("Buggy Captcha Closed.");
        await t(10000);
        await e("MINE");
        return false;
      }

      await t(2000);

      // Check for the input field for stars
      const inputField = document.querySelector("input[placeholder='result']");
      if (inputField) {
        const starCount = prompt("Enter the number of stars you see:", "5"); // Manual input for star captcha
        if (starCount !== null) {
          inputField.value = starCount;
          inputField.dispatchEvent(new Event("input", { bubbles: true }));
        }
      } else {
        // If the input field is not there, use the up/down buttons
        const upButton = Array.from(document.querySelectorAll("button")).find((btn) => btn.textContent.trim() === "Up");
        const downButton = Array.from(document.querySelectorAll("button")).find((btn) => btn.textContent.trim() === "Down");

        if (upButton && downButton) {
          // We need to simulate button clicks based on the star count
          let starCount = prompt("Enter the number of stars you see:", "5");
          starCount = parseInt(starCount, 10);
          while (starCount > 0) {
            upButton.click();
            starCount--;
            await t(500); // Delay between clicks
          }
          while (starCount < 0) {
            downButton.click();
            starCount++;
            await t(500); // Delay between clicks
          }
        }
      }

      await e("Verify");
      console.log("Star Captcha solved!");
      await t(1500);
      return true;
    }
  }
  return false;
}

async function main() {
  console.log("Starting process...");
  while (true) {
    await e("MINE");
    console.log("Pressed MINE");
    await t(2000);
    const o = Array.from(document.querySelectorAll("p.text-sm")).find((t) => t.textContent.includes("You're temporarily blocked"));
    if (o) {
      console.error("You are blocked!");
      const e = o.textContent.match(/(\d+)\s+minutes/);
      if (!e) return console.warn("Something went wrong. Exiting..."), false;
      const o = parseInt(e[1], 10);
      console.log(`Sleeping for ${o} minute(s)...`);
      await t(60 * o * 1000);
      const n = Array.from(document.querySelectorAll("button")).find((t) => "Close" === t.querySelector("span")?.textContent.trim());
      n && n.click();
      console.log("Captcha Closed.");
      console.log("Block time passed. Retrying...");
    }
    if (Array.from(document.querySelectorAll("p.text-sm")).find((t) => t.textContent.includes("You have started"))) {
      await e("Got it");
      console.log("Pressed Got it");
      await t(57000);
      await e("Mine more!");
      console.log("TOC Claimed");
      await t(1500);
    } else {
      await n();
    }
  }
}

main();


