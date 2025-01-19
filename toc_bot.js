function t(t){return new Promise((e=>setTimeout(e,t)))} // Delay function
function e(t){const e=Array.from(document.querySelectorAll("button")).find((e=>e.textContent.trim()===t));e&&e.click()} // Click function
function o(){ // Sound function for feedback
  const t=new(window.AudioContext||window.webkitAudioContext),e=t.createOscillator(),o=t.createGain();e.type="square",e.frequency.setValueAtTime(440,t.currentTime),o.gain.setValueAtTime(.1,t.currentTime),e.connect(o),o.connect(t.destination),e.start(),e.stop(t.currentTime+.75)}
async function n(){ // Captcha detection and handling
  const n=Array.from(document.querySelectorAll("p.text-sm")).find((t=>t.textContent.startsWith("To prevent")));
  if(n){
    const r=n.textContent;
    if(r.includes("result of the following calculation:")){ // Math captcha
      console.error("Math Captcha Arrived.");
      o();
      await t(2000);
      const n=Array.from(document.querySelectorAll("button")).find((t=>"Close"===t.querySelector("span")?.textContent.trim()));
      if(n) {
        n.click();
        console.log("Captcha Closed.");
      }
      await t(10000);
      await e("MINE"); // Click "MINE" again after closing
      return false;
    }
    if(r.includes("How many stars do you see:")){ // Star captcha
      console.error("Star captcha detected!");
      if(Array.from(document.querySelectorAll("div.text-sm")).find((t=>t.textContent.startsWith("Verification failed.")))){ // Handle failed captcha
        console.error("Captcha Failed!");
        o();
        await t(10000);
        const n=Array.from(document.querySelectorAll("button")).find((t=>"Close"===t.querySelector("span")?.textContent.trim()));
        if(n) {
          n.click();
          console.log("Buggy Captcha Closed.");
        }
        await t(10000);
        await e("MINE");
        return false;
      }
      await t(2000);
      const starCount = await async function(){ // Function to count the stars
        const t=document.querySelector("canvas");
        if(t){
          const n=t.getContext("2d"),
                r=t.width,
                c=t.height,
                a=n.getImageData(0,0,r,c).data;
          function e(t,e,o,n){return t<50&&e<50&&o<50&&n>200} // Filter for stars
          let l=0;
          const i=new Set,s=[[0,1],[1,0],[0,-1],[-1,0]];
          function o(t,o){
            const n=[[t,o]];
            for(;n.length>0;){
              const[t,o]=n.pop(),l=4*(o*r+t);
              if(t>=0&&o>=0&&t<r&&o<c&&!i.has(`${t},${o}`)&&e(a[l],a[l+1],a[l+2],a[l+3])){i.add(`${t},${o}`);for(const[e,r]of s)n.push([t+e,o+r])}}}
          for(let d=0;d<c;d++)for(let f=0;f<r;f++){const m=4*(d*r+f);e(a[m],a[m+1],a[m+2],a[m+3])&&!i.has(`${f},${d}`)&&(l++,o(f,d))}
          const u=Math.round(l/7); 
          return console.log(`Found ${u} stars.`),u;
        } else {
          throw new Error("Canvas not found.");
        }
      }();
      
      const inputBox = Array.from(document.querySelectorAll("input")).find((t=>"result"===t.placeholder));
      inputBox.value = `${starCount}`;
      inputBox.dispatchEvent(new Event("input",{bubbles:!0})); // Set input to star count
      await t(2000); // Wait before clicking Verify
      const verifyButton = Array.from(document.querySelectorAll("button")).find((t=>"Verify"===t.textContent.trim()));
      if(verifyButton) {
        verifyButton.click();
        console.log("Star Captcha solved!");
      }
      return true;
    }
  }
  return false;
}

async function startMining() {
  console.log("Starting process...");
  while(true){
    await e("MINE");
    console.log("Pressed MINE");
    await t(2000);
    const blockedMessage = Array.from(document.querySelectorAll("p.text-sm")).find((t=>t.textContent.includes("You're temporarily blocked")));
    if(blockedMessage){
      console.error("You are blocked!");
      const match = blockedMessage.textContent.match(/(\d+)\s+minutes/);
      if(match){
        const blockTime = parseInt(match[1], 10);
        console.log(`Sleeping for ${blockTime} minute(s)...`);
        await t(60 * blockTime * 1000);
        const closeButton = Array.from(document.querySelectorAll("button")).find((t=>"Close"===t.querySelector("span")?.textContent.trim()));
        if(closeButton) {
          closeButton.click();
          console.log("Captcha Closed.");
        }
        console.log("Block time passed. Retrying...");
      }
    }
    if(Array.from(document.querySelectorAll("p.text-sm")).find((t=>t.textContent.includes("You have started")))){
      await e("Got it");
      console.log("Pressed Got it");
      await t(57000); // Wait for 57 seconds
      await e("Mine more!");
      console.log("TOC Claimed");
      await t(1500); // Small delay before next mine
    } else {
      await n(); // Handle captcha
    }
  }
}

startMining();

