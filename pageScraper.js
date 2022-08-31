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
   
  //call a Pyton micro service to convetion xls in xlsx   
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
        try { } catch (e) {
        console.log("Couldn't click on this link: ver todas as movimentações" , e);
      }
      await sleep(5)
      await callPython(spawn)
      
      break
      var matriz = new Array();
      //cabeçalho      
      i = 0;
      matriz[i] = new Array();
      matriz[0][0] = "movimentação";      
      i = 1;
      matriz[i] = new Array();
      matriz[1][0] = "data";
      matriz[1][1] = "Evento";
      i = 2;

      let cont = 1;
      let v = 0;
      var validator = true;

      //await frame.waitForNavigation({ waitUntil: "networkidle0" });
      if (d.instancia==1) {
        while (validator == true) {
          matriz[i] = new Array();
          await page.waitForXPath('/html/body/table[2]/tbody/tr[1]/td[2]')      
          let movData = `/html/body/table[2]/tbody/tr[${cont}]/td[2]`;       
          const [elmovData] = await page.$x(movData);
          
          if (elmovData != undefined) {           
              await page.waitForXPath(`/html/body/table[2]/tbody/tr[${cont}]/td[2]`)      
              let movData = `/html/body/table[2]/tbody/tr[${cont}]/td[2]`;      
              const [elmovData] = await page.$x(movData);
              
          }else{
            validator = false;
            break;
          }
          
          const MovData = await elmovData.getProperty('textContent');
          const MOVdata = await MovData.jsonValue();
          matriz[i][0] = MOVdata.trim();
          //console.log(matriz[i][1])
  
          await page.waitForXPath('/html/body/table[2]/tbody/tr[1]/td[4]')      
          let movmov = `/html/body/table[2]/tbody/tr[${cont}]/td[4]`;       
          const [elmovmov] = await page.$x(movmov);
          const MovMov = await elmovmov.getProperty('textContent');
          const MOVmov = await MovMov.jsonValue();
          matriz[i][1] = MOVmov.trim();
          cont++;
          i++;
        }
        
      }
      if (d.instancia == 2) {
        while (validator == true) {
          matriz[i] = new Array();
          await page.waitForXPath('/html/body/table[2]/tbody/tr[1]/td[3]')      
          let movData = `/html/body/table[2]/tbody/tr[${cont}]/td[3]`;       
          const [elmovData] = await page.$x(movData);
          //console.log(elmovData)    
          if (elmovData != undefined) {           
              await page.waitForXPath(`/html/body/table[2]/tbody/tr[${cont}]/td[3]`)      
              let movData = `/html/body/table[2]/tbody/tr[${cont}]/td[3]`;      
              const [elmovData] = await page.$x(movData);
              const MovData = await elmovData.getProperty('textContent');
              const MOVdata = await MovData.jsonValue();
              //console.log(MOVdata)
              matriz[i][0] = MOVdata.trim();
          }else{
            validator = false;
            break;
          }
          
      
          //console.log(matriz[i][1])
                                  
          await page.waitForXPath('/html/body/table[2]/tbody/tr[1]/td[4]')      
          let movmov = `/html/body/table[2]/tbody/tr[${cont}]/td[4]`;       
          const [elmovmov] = await page.$x(movmov);
          
          if (elmovmov != undefined || elmovmov != null) {
            await page.waitForXPath('/html/body/table[2]/tbody/tr[1]/td[4]')      
            let movmov = `/html/body/table[2]/tbody/tr[${cont}]/td[4]`;       
            const [elmovmov] = await page.$x(movmov);
            const MovMov = await elmovmov.getProperty('textContent');
            MOVmov = await MovMov.jsonValue();
            console.log(MOVmov)
            matriz[i][1] = MOVmov.trim();
          }
          
          //console.log(matriz[i][2])
          cont++;
          i++;
        }  
      } else {
        console.log('Nenhuma instância valida')
      }
      
      //json export
      let Jmatriz = JSON.stringify(matriz);
      fs.writeFileSync(`TJ-MG_${d.instancia}_${d.cnj}`, Jmatriz); 

      console.log('Finalizado')
    }
    //browser.close();
  },
};

module.exports = scraperObject;
