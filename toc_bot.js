// Detect and Solve Captcha
function solveCaptcha() {
    try {
        const captchaText = document.querySelector('.captcha-text'); // Adjust this selector
        if (captchaText) {
            let captchaContent = captchaText.textContent.trim();
            
            // Math Captcha (e.g., "5 + 3")
            const mathMatch = captchaContent.match(/(\d+)\s*([\+\-\*\/])\s*(\d+)/);
            if (mathMatch) {
                const num1 = parseInt(mathMatch[1]);
                const operator = mathMatch[2];
                const num2 = parseInt(mathMatch[3]);
                
                let answer;
                if (operator === '+') answer = num1 + num2;
                if (operator === '-') answer = num1 - num2;
                if (operator === '*') answer = num1 * num2;
                if (operator === '/') answer = Math.floor(num1 / num2); // Integer division
                
                // Input answer to captcha
                let upButton = document.querySelector('.up');
                let downButton = document.querySelector('.down');
                
                let currentValue = 0;
                while (currentValue !== answer) {
                    if (currentValue < answer) {
                        upButton.click();
                        currentValue++;
                    } else if (currentValue > answer) {
                        downButton.click();
                        currentValue--;
                    }
                }
                return true; // Captcha solved
            }
            
            // Star Captcha (e.g., count the stars)
            const starElements = document.querySelectorAll('img[alt="star"]');
            if (starElements.length > 0) {
                let starCount = starElements.length;
                
                let upButton = document.querySelector('.up');
                let downButton = document.querySelector('.down');
                
                let currentValue = 0;
                while (currentValue !== starCount) {
                    if (currentValue < starCount) {
                        upButton.click();
                        currentValue++;
                    } else if (currentValue > starCount) {
                        downButton.click();
                        currentValue--;
                    }
                }
                return true; // Captcha solved
            }
        }
    } catch (e) {
        console.error('Captcha error:', e);
    }
    return false; // No captcha or failed
}

// Main mining loop
function mine() {
    let miningInterval = setInterval(() => {
        // Click "Mine" button
        let mineButton = document.querySelector('button:contains("Mine")');
        if (mineButton) {
            mineButton.click();
            console.log('Clicked Mine');
        }
        
        // Check if captcha appears
        let captchaSolved = solveCaptcha();
        if (captchaSolved) {
            console.log('Captcha solved!');
            setTimeout(() => {
                // Click "Got it" button after solving captcha
                let gotItButton = document.querySelector('button:contains("Got it")');
                if (gotItButton) {
                    gotItButton.click();
                    console.log('Clicked Got it');
                }

                // Wait for the block to be completed (1 minute)
                setTimeout(() => {
                    // Click "Mine more" button after completing the block
                    let mineMoreButton = document.querySelector('button:contains("Mine more")');
                    if (mineMoreButton) {
                        mineMoreButton.click();
                        console.log('Clicked Mine more');
                    }

                    // Click "Mine" again to continue mining
                    setTimeout(() => {
                        mineButton.click();
                        console.log('Clicked Mine again');
                    }, 5000); // Delay 5 seconds between actions
                    
                }, 60000); // 1 minute delay before "Mine more"
            }, 5000); // Delay 5 seconds after solving captcha
        } else {
            console.log('No captcha detected.');
            setTimeout(() => {
                // Click "Got it" button (if any) after mining
                let gotItButton = document.querySelector('button:contains("Got it")');
                if (gotItButton) {
                    gotItButton.click();
                    console.log('Clicked Got it');
                }

                // Wait for the block to be completed (1 minute)
                setTimeout(() => {
                    // Click "Mine more" button after completing the block
                    let mineMoreButton = document.querySelector('button:contains("Mine more")');
                    if (mineMoreButton) {
                        mineMoreButton.click();
                        console.log('Clicked Mine more');
                    }

                    // Click "Mine" again to continue mining
                    setTimeout(() => {
                        mineButton.click();
                        console.log('Clicked Mine again');
                    }, 5000); // Delay 5 seconds between actions
                    
                }, 60000); // 1 minute delay before "Mine more"
            }, 5000); // Delay 5 seconds
        }
    }, 60000); // Mine every 1 minute
}

mine();
