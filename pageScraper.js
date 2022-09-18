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
        let ht = ''; 
        for (let index = 0; index < 15; index++) {
           ht = ht+html[index]; 
        }
        console.log(ht)
        if (ht == '<!DOCTYPE html>' ) {
          console.log({"Log: ": "Html 5"})
        } else {
          console.log({"Log: ": "Html inferior ao 5"})
        }
        //fs.writeFileSync("site.html", html);
        const text = await page.$eval('h1', element=>element.textContent)
        const a = await page.$$eval('a', element=>element.length)
        //const links = await page.$$eval('a', element=>element.textContent)
        const hrefs = await Promise.all((await page.$$('a')).map(async a => {
          return await (await a.getProperty('href')).jsonValue();
        }));
        console.log({"Tags a: ": a})
        
        //console.log(hrefs[0])
        let int = 0;
        let ext = 0;
        hrefs.forEach(element => {
           // console.log(element)
        });
        // Defining the string to filter the results
        let urlToFilter  = d.url;

        // Getting all the <a></a> elements of a website
        let urlsToVisit  = await page.$$eval('a', (links, urlToFilter) => links.map(link => link.href).filter(link => link.startsWith(urlToFilter)), urlToFilter);  
        int = urlsToVisit.length
        ext = a - int;
        console.log({'internos': int})
        console.log({'externos': ext})
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
