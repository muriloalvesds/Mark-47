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
        try {
           await page.goto(d.url);
        } catch (e) {
           console.log({"404":"Não é possível acessar essa url"})
        }
        const html = await page.content(); 
        fs.writeFileSync("site.html", html);
      try { 
            
      } catch (e) {
        console.log({"404":"O robo não pode interagir"});
      }
      console.log({'Log':'Finalizado'})
    }
    browser.close();
  },
};
 
module.exports = scraperObject;
