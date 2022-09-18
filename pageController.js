const pageScraper = require("./pageScraper");

async function scrapeAll(browserInstance, data) {
  let browser;
  try {
    browser = await browserInstance;
    await pageScraper.scraper(browser, data);
  } catch (e) {
    console.log("Could not resolve the browser instance => ", e);
  }
}

module.exports = (browserInstance, data) => scrapeAll(browserInstance, data);
