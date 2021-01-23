const app = require('express')
const router = app.Router()
const RunAnalysis = require('../RunAnalysis')
var nodemailer = require('nodemailer');




router.get('/:email/:query', async (req, res) =>{
    console.log(req.params.query)
    createDataToSend(req.params.query, req.params.email)
    res.status(200).send('successfully received query, please wait')
 
})


/* router.get('/', async (req, res) =>{
    if(dataToSend != null)  res.status(200).send(dataToSend)
    else{
         res.send('please come back later ' + dataToSend)
}
}) */

const createDataToSend = async (query, email) => {
    try{
    console.log(query)
    let scriptData =  await RunAnalysis.SentimentAnalysis(query, 'us', 50)
    let dataToSend = JSON.parse(scriptData).res
    var fs = require("fs");
    
    var file = fs.createWriteStream("articles_text.txt");
    file.on("error", function (err) {
      console.log("!!!!!!!!!!!" + err);
    });
    file.write(JSON.stringify(dataToSend[0]));
            file.end();

    dataToSend.shift()
    let html = createHTML(dataToSend)
   
     sendData(html, email)
    }catch(err){
        console.log('_______________________' + err + '_________________________________')
    }
   
}

const createHTML = (dataArray) =>{
  let html = ""
  html += "<br />" + "<b>Mean: </b>" +dataArray[1] + "<br /><b> median:</b> " + dataArray[2] + '<br />' + "<b>std:</b> " + dataArray[3] + '<br /><br />'
  html+= "<b>Positive articles: </b><br />"
  for(let i = 0; i < dataArray[4].length; i++){
    html += dataArray[4][i][0] + ": " + dataArray[4][i][1] + "<br />"
  }
  html+= "<b>negative articles: </b><br />"
  for(let i = 0; i < dataArray[5].length; i++){
    html += dataArray[5][i][0] + ": " + dataArray[5][i][1] + "<br />"
  }

  html+= "<br /><b>positive words: </b><br />"
  for(let i = 0; i < dataArray[6].length; i++){
    html += dataArray[6][i][0] + ": " + dataArray[6][i][1] + "<br />"
  }
  
  html+= "<br /> <b>negative words: </b><br />"
  for(let i = 0; i < dataArray[7].length; i++){
    html += dataArray[7][i][0] + ": " + dataArray[7][i][1] + "<br />"
  }

  html+= "<br /><b>Positive phrases: </b><br />"
  for(let i = 0; i < dataArray[8].length; i++){
    html += "::::::" + dataArray[8][i][0] + ":<b> " + dataArray[8][i][1] + " </b><br />"
  }
  html+= "<br /><b>negative phrases: </b><br />"
  for(let i = 0; i < dataArray[9].length; i++){
    html += "::::::" + dataArray[9][i][0] + ": <b>" + dataArray[9][i][1] + " </b><br />"
  }

  return html
}

const sendData = (html, email) =>{
  var mailOptions = {
    from: '"sentinews team" <omriyram@gmail.com>',
    to: email,
    subject: 'results for query',
    html: "<b>your query results:</b><br /> " + html
  };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
}

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: "sentinewsanalyser@gmail.com",
    pass: "1234ABC16%"
  }
  });
  
  



module.exports = router