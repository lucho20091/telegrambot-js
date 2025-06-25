require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const puppeteer = require("puppeteer-core");
// const puppeteer = require("puppeteer");
const url =
  "https://www.linkedin.com/jobs/search/?currentJobId=4255718007&f_E=1%2C2%2C3&f_TPR=r7200&f_WT=2&keywords=english&origin=JOB_SEARCH_PAGE_JOB_FILTER";
const url2 =
  "https://www.linkedin.com/login?fromSignIn=true&trk=guest_homepage-basic_nav-header-signin";
const token = process.env.TELEGRAM_BOT;
const userId = process.env.TELEGRAM_ID;
const email = process.env.LINKEDIN_EMAIL;
const pass = process.env.LINKEDIN_PASS;

const bot = new TelegramBot(token, { polling: true });
bot.on("message", (msg) => {
  console.log(msg);
});

async function test() {
  try {
    const browser = await puppeteer.connect({
      browserURL: "http://localhost:9222",
    });
    const page = await browser.newPage();
    await page.goto(url);
    const allLinks = await page.$$eval(".job-card-container__link", (links) =>
      links.map(
        (link, index) =>
          `${index + 1}: [${link.getAttribute("aria-label")}](${link.href})`
      )
    );
    bot.sendMessage(userId, allLinks.join("\n"), { parse_mode: "Markdown" });
    await page.close();
  } catch (err) {
    console.log(err);
  }
}
test();
