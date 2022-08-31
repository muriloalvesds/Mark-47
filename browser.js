const puppeteer = require("puppeteer-extra");
const pluginStealth = require("puppeteer-extra-plugin-stealth");
const RecaptchaPlugin = require("puppeteer-extra-plugin-recaptcha");

puppeteer.use(pluginStealth());
puppeteer.use(
  RecaptchaPlugin({
    provider: {
      id: "2captcha",
      token: "",
    },
    visualFeedback: true,
  })
);

async function startBrowser() {
  let browser;
  try {
    browser = puppeteer.launch({
      headless: true,
    });
  } catch (err) {
    console.log("Couldn't create browser instance => : ", err);
  }
  return browser;
}

module.exports = {
  startBrowser,
};
