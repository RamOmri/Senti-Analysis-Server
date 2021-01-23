const puppeteer = require("puppeteer");
var xpath = require("xpath"),
  dom = require("xmldom").DOMParser;
  const { spawn } = require("child_process");

const SentimentAnalysis = async (query, country, noLinks) =>{
    var outputs = [];
    var parsedData;
    var stringdata
    let articlesLinks = await collectAllLinks(query, country, noLinks);
    articlesLinks = JSON.stringify(articlesLinks);

    try {
        await new Promise((resolve, reject) => {
            
          const python = spawn("python3", ["sentiment.py"]);
    
          python.stdout.on("data", function (data) {
            stringdata = data.toString();
    
           /* let outputs = parsedData.res[0];
           let pos_words = parsedData.res[1];
           let neg_words = parsedData.res[2];
          let  failedConnections = parsedData.res[3];
          let  article_text = parsedData.res[4]; */
           /*  var fs = require("fs");
    
            var file = fs.createWriteStream("articles_text.txt");
            file.on("error", function (err) {
              console.log("!!!!!!!!!!!" + err);
            });
            file.write(JSON.stringify(article_text));
            file.end();
            console.log(pos_words);
            console.log(neg_words);
            console.log(
              "failed to extract content from: " + failedConnections + " articles"
            ); */
            
        resolve()
          
          });
          python.stdout.on("end", function () {
            console.log("end");
          });
          python.stdin.write(articlesLinks);
          python.stdin.end();
        });
      } catch (err) {
        console.log(err);
      }
      console.log(stringdata + ' .......')
      return stringdata
}



  const collectAllLinks = async (query, country, noLinks) => {
    var googleIndex = 0;
    var links = [];
    links = await getLinksOnPage(
      `https://www.google.com/search?gl=${country}&q=${query}&start=${googleIndex}&tbm=nws&lr=lang_en`
    );
  
    googleIndex += 10;
    while (links.length <= noLinks - 10) {
      let linksToAdd = await getLinksOnPage(
        `https://www.google.com/search?gl=${country}&q=${query}&start=${googleIndex}&tbm=nws&lr=lang_en`
      );
  
      if (linksToAdd.length == 0) break;
      else links = links.concat(linksToAdd);
  
      console.log("we now have: " + links.length);
  
      googleIndex += 10;
    }
  
    return links;
  };
  

  const getLinksOnPage = async (url) => {
    const browser = await puppeteer.launch({
      args: ["--lang=en-US"],
    });
  
    const page = await browser.newPage();
  
    await page.goto(url);
    var hrefs = [];

    let bodyHTML = await page.evaluate(() => document.body.innerHTML);
  
    var doc = new dom({
      locator: {},
      errorHandler: {
        warning: function (w) {},
        error: function (e) {},
        fatalError: function (e) {
          console.error(e);
        },
      },
    }).parseFromString(bodyHTML);
    var nodes = xpath.select("//div[@class='dbsr']/a/@href", doc); 
  
    hrefs = nodes.map((value) => value.nodeValue);
  
  
    await browser.close();
    return hrefs;
  };

exports.SentimentAnalysis =  SentimentAnalysis;