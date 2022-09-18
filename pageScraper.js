const scraperObject = {
  async scraper(browser, data) {
    for (const d of data.entries) {
        let page = await browser.newPage();
        let htmlV = '';
        let ht = ''; 
        await page.goto(d.url);
        const text = await page.$eval('h1', element=>element.textContent)
        try { 
          const html = await page.content();
          for (let index = 0; index < 15; index++) {
             ht = ht+html[index]; 
          }
          if (ht == '<!DOCTYPE html>' ) {
            htmlV = 'Html 5';
          } else {
            htmlV= 'Less than 5'
          }  
        } catch (e) {
          console.log({"404": "Can't check html version"});
        }
        try {
          const a = await page.$$eval('a', element=>element.length)
          const hrefs = await Promise.all((await page.$$('a')).map(async a => {
            return await (await a.getProperty('href')).jsonValue();
          }));
          let int = 0;
          let ext = 0;
          let urlToFilter  = d.url;
          let urlsToVisit  = await page.$$eval('a', (links, urlToFilter) => links.map(link => link.href).filter(link => link.startsWith(urlToFilter)), urlToFilter);  
          int = urlsToVisit.length
          ext = a - int;
          console.table({"Url:": d.url, "Html version:":  htmlV, "Page Title: " : text, "External links:" : ext, "Internal links:" : int })
        } catch (e) {
          console.log({"404": "Não é possível fazer a contagem dos links(href)"});
        }
    }
    browser.close();
  },
};
 
module.exports = scraperObject;
