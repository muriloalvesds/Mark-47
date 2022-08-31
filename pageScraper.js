const path = require("path");
const downloadPath = path.resolve("./files");
const fs = require("fs")
const { promisify } = require('util')
const writeFileAsync = promisify(fs.writeFile);
const readFileAsync = promisify(fs.readFile)
const { spawn } = require('node:child_process');


async function sleep(sec) {
  return new Promise((resolve, reject) => {
      setTimeout(function() {
          resolve();
      }, sec * 1000);
  });
}

async function callPython(spawn){
  try {    
    
    
    console.log('waiting process...')
    
    const clildPython = spawn('python', [
        "-u",
        path.join(__dirname, 'fastCo.py'),      "--foo", "convert"
    ])
    
    clildPython.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`)
    });
    
     clildPython.stderr.on('data', (data) => {
      console.log(`stderr: ${data}`)
    });
    
     clildPython.on('close', (code) => {
      console.log('Python-', 'Spreadsheet to .xlsx successfully converted')
    });
    console.log( `Node-`,`Call of Python microservices is communicating`)
   

  } catch (e) {
      console.log('Python comunication lost - revew py files', e)
  }
  console.log('fim python')
}

const scraperObject = {
  async scraper(browser, data) {
    for (const d of data.entries) {
        let page = await browser.newPage();
        await page.goto(d.url);
        try { 
        //await sleep(15)
        
        // Click on <i> "close"
        //await page.waitForSelector('.btn-close > .material-icons');
        //await page.click('.btn-close > .material-icons');

        // Scroll wheel by X:0, Y:900
        await page.evaluate(() => window.scrollBy(0, 900));

        // Click on <button> "search BUSCAR"
        await page.waitForSelector('.find');
        await page.click('.find');
        await page._client.send('Page.setDownloadBehavior', {behavior: 'allow', downloadPath: downloadPath})

        // Click on <a> "cloud_download DOWNLOAD"
        await page.waitForSelector('.btn-download');
        //await page.click('#main-2 > div.container-full.mt-5.pb-3 > div > div.mb-3.d-flex.justify-between.align-items-center > div.d-flex > a > span');
        await page.evaluate(() => {
          document.querySelector('#main-2 > div.container-full.mt-5.pb-3 > div > div.mb-3.d-flex.justify-between.align-items-center > div.d-flex > a > span').click();
        });

        //await page.waitForNavigation({ waitUntil: "domcontentloaded" });
        } catch (e) {
        console.log("O robo não pode interagir" , e);
      }
      await sleep(5)
      await callPython(spawn)

      console.log('Finalizado')
    }
    browser.close();
  },
};

module.exports = scraperObject;
