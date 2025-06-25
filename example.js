const puppeteer = require("puppeteer");

// Basic setup function
async function setupBrowser() {
  const browser = await puppeteer.launch({
    headless: false, // Set to true for production
    slowMo: 50, // Slow down by 50ms between actions
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  return { browser, page };
}

// 1. CLICKING ELEMENTS
async function clickExamples() {
  const { browser, page } = await setupBrowser();

  try {
    await page.goto("https://example.com");

    // Click by selector
    await page.click("button");
    await page.click("#submit-btn");
    await page.click(".my-class");

    // Click with wait
    await page.waitForSelector("button", { visible: true });
    await page.click("button");

    // Click coordinates
    await page.mouse.click(100, 200);

    // Right click
    await page.click("button", { button: "right" });

    // Double click
    await page.click("button", { clickCount: 2 });

    // Click with modifier keys
    await page.click("a", { modifiers: ["Control"] }); // Ctrl+click
  } finally {
    await browser.close();
  }
}

// 2. FORM FILLING
async function formExamples() {
  const { browser, page } = await setupBrowser();

  try {
    await page.goto("https://example.com/form");

    // Type text
    await page.type("#username", "myusername");
    await page.type("#password", "mypassword");

    // Clear and type
    await page.click("#email", { clickCount: 3 }); // Select all
    await page.type("#email", "new@email.com");

    // Type with delay
    await page.type("#slow-field", "slow typing", { delay: 100 });

    // Select dropdown
    await page.select("#country", "US");

    // Select multiple options
    await page.select("#multi-select", ["option1", "option2"]);

    // Check checkbox
    await page.check("#agree-terms");

    // Uncheck checkbox
    await page.uncheck("#newsletter");

    // Radio button
    await page.check("#male");

    // File upload
    const fileInput = await page.$("#file-upload");
    await fileInput.uploadFile("/path/to/file.pdf");

    // Submit form
    await page.click("#submit");
  } finally {
    await browser.close();
  }
}

// 3. WAITING AND NAVIGATION
async function waitingExamples() {
  const { browser, page } = await setupBrowser();

  try {
    // Wait for navigation
    await page.goto("https://example.com");

    // Wait for selector
    await page.waitForSelector("#dynamic-content");

    // Wait for element to be visible
    await page.waitForSelector(".modal", { visible: true });

    // Wait for element to be hidden
    await page.waitForSelector(".loading", { hidden: true });

    // Wait for function
    await page.waitForFunction(() => {
      return document.querySelector("#data").innerText.includes("loaded");
    });

    // Wait for network to be idle
    await page.goto("https://spa-app.com", { waitUntil: "networkidle2" });

    // Wait for timeout
    await page.waitForTimeout(2000); // Wait 2 seconds

    // Wait for navigation after click
    await Promise.all([
      page.waitForNavigation(), // Wait for navigation
      page.click("#next-page"), // Click that triggers navigation
    ]);
  } finally {
    await browser.close();
  }
}

// 4. SCROLLING AND HOVER
async function scrollHoverExamples() {
  const { browser, page } = await setupBrowser();

  try {
    await page.goto("https://example.com");

    // Scroll to element
    await page.evaluate(() => {
      document.querySelector("#bottom-element").scrollIntoView();
    });

    // Scroll by pixels
    await page.evaluate(() => {
      window.scrollBy(0, 500);
    });

    // Scroll to bottom
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });

    // Hover over element
    await page.hover("#menu-item");

    // Focus element
    await page.focus("#search-input");
  } finally {
    await browser.close();
  }
}

// 5. DATA EXTRACTION
async function extractionExamples() {
  const { browser, page } = await setupBrowser();

  try {
    await page.goto("https://example.com");

    // Get text content
    const title = await page.$eval("h1", (el) => el.textContent);

    // Get attribute
    const link = await page.$eval("a", (el) => el.href);

    // Get multiple elements
    const allLinks = await page.$$eval("a", (links) =>
      links.map((link) => ({
        text: link.textContent,
        href: link.href,
      }))
    );

    // Get element properties
    const isVisible = await page.$eval("#element", (el) => {
      const style = window.getComputedStyle(el);
      return style.display !== "none" && style.visibility !== "hidden";
    });

    // Screenshot
    await page.screenshot({ path: "page.png", fullPage: true });

    // PDF
    await page.pdf({ path: "page.pdf", format: "A4" });

    console.log({ title, link, allLinks, isVisible });
  } finally {
    await browser.close();
  }
}

// 6. HANDLING ALERTS AND POPUPS
async function alertExamples() {
  const { browser, page } = await setupBrowser();

  try {
    await page.goto("https://example.com");

    // Handle alert dialog
    page.on("dialog", async (dialog) => {
      console.log("Dialog message:", dialog.message());
      await dialog.accept(); // or dialog.dismiss()
    });

    // Handle new page/tab
    page.on("popup", async (popup) => {
      await popup.waitForLoadState();
      console.log("Popup URL:", popup.url());
      await popup.close();
    });
  } finally {
    await browser.close();
  }
}

// 7. KEYBOARD ACTIONS
async function keyboardExamples() {
  const { browser, page } = await setupBrowser();

  try {
    await page.goto("https://example.com");

    // Press single key
    await page.keyboard.press("Enter");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Escape");

    // Press key combination
    await page.keyboard.down("Control");
    await page.keyboard.press("a"); // Ctrl+A
    await page.keyboard.up("Control");

    // Type text
    await page.keyboard.type("Hello World");

    // Clear input field
    await page.focus("#input");
    await page.keyboard.down("Control");
    await page.keyboard.press("a");
    await page.keyboard.up("Control");
    await page.keyboard.press("Backspace");
  } finally {
    await browser.close();
  }
}

// 8. ADVANCED INTERACTIONS
async function advancedExamples() {
  const { browser, page } = await setupBrowser();

  try {
    await page.goto("https://example.com");

    // Drag and drop
    await page.dragAndDrop("#source", "#target");

    // Set cookies
    await page.setCookie({
      name: "session",
      value: "abc123",
      domain: "example.com",
    });

    // Set headers
    await page.setExtraHTTPHeaders({
      "User-Agent": "My Custom Bot",
      Authorization: "Bearer token123",
    });

    // Intercept requests
    await page.setRequestInterception(true);
    page.on("request", (request) => {
      if (request.resourceType() === "image") {
        request.abort();
      } else {
        request.continue();
      }
    });

    // Execute JavaScript
    const result = await page.evaluate(() => {
      return {
        title: document.title,
        url: window.location.href,
        cookies: document.cookie,
      };
    });

    console.log(result);
  } finally {
    await browser.close();
  }
}

// 9. COMPLETE EXAMPLE: LOGIN AUTOMATION
async function loginExample() {
  const { browser, page } = await setupBrowser();

  try {
    // Navigate to login page
    await page.goto("https://example.com/login");

    // Fill login form
    await page.waitForSelector("#username");
    await page.type("#username", "your-username");
    await page.type("#password", "your-password");

    // Submit and wait for navigation
    await Promise.all([page.waitForNavigation(), page.click("#login-button")]);

    // Verify login success
    await page.waitForSelector("#dashboard", { timeout: 5000 });
    console.log("Login successful!");

    // Navigate to another page
    await page.click("#profile-link");
    await page.waitForSelector("#profile-info");

    // Extract user data
    const userData = await page.evaluate(() => {
      return {
        name: document.querySelector("#user-name")?.textContent,
        email: document.querySelector("#user-email")?.textContent,
      };
    });

    console.log("User data:", userData);
  } catch (error) {
    console.error("Login failed:", error);
  } finally {
    await browser.close();
  }
}

// Export functions for use
module.exports = {
  clickExamples,
  formExamples,
  waitingExamples,
  scrollHoverExamples,
  extractionExamples,
  alertExamples,
  keyboardExamples,
  advancedExamples,
  loginExample,
};

// Run examples
if (require.main === module) {
  // Uncomment the function you want to test
  // clickExamples();
  // formExamples();
  // loginExample();
}
