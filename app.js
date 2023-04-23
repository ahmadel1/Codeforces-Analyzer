const express = require('express');
const bodyParser = require("body-parser");
const request = require("request");
const https = require('https');
const { urlencoded } = require('body-parser');



const app = express();
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("public"));


app.get("/", (req, res)=>{
    res.sendFile(__dirname + "/index.html");    
})

app.post("/", (req, res)=>{
    var apiKey = "";
    var handle = req.body.userHandle
    console.log(handle);
    const url = "https://codeforces.com/api/user.info?handles="+handle;
    console.log(url);
    https.get(url, (response)=>{
        console.log(response.statusCode);
        let data = "";
        response.on("data", (chunk)=>{
            data += chunk;
        });
        response.on("end", ()=>{
            try {
                const userData = JSON.parse(data);
                console.log(userData.result[0].lastName);  
            } catch (error) {
                console.log(`Error parsing JSON: ${error}`);
            }
        });
    });
});

app.listen(3000, (req,res)=>{
    console.log("running on port 3000");
})
    //"https://codeforces.com/api/user.status?handle="+name+"&from=1&count=1000000000"
