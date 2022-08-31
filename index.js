const browserObject = require("./browser");
const scraperController = require("./pageController");
const fs = require("fs");

var dataFile = null;

process.argv.forEach(function (val, index, array) {
  console.log(index + ": " + val);
  if (index == 2) {
    dataFile = val;
  }
});

if (dataFile == null) {
  return false;
}

let rawData = fs.readFileSync(dataFile);
let data = JSON.parse(rawData);

if (!data) {
  return false;
}

// //Start the browser and create a browser instance
let browserInstance = browserObject.startBrowser();

// //Pass the browser instance to the scraper controller
scraperController(browserInstance, data);
