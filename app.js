const express = require('express');
const bodyParser = require("body-parser");
const request = require("request");
const https = require('https');
const { urlencoded } = require('body-parser');



const app = express();
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("public"));
app.set('view engine', 'ejs');


let problemsStats =  {total : 0, OK:0 , WRONG_ANSWER:0, TIME_LIMIT_EXCEEDED: 0, RUNTIME_ERROR: 0, MEMORY_LIMIT_EXCEEDED : 0, other : 0};
let problemsRatings = []
let xValues = []
let yValues = []

app.get("/", (req, res)=>{
    res.sendFile(__dirname + "/index.html");    
})

app.get("/stats" , (req,res)=>{
    if(req.body.userHandle === "") res.redirect("/")
    res.render("stats", {data: problemsStats, xValues: xValues, yValues: yValues});
})

app.post("/", (req, res)=>{
    var apiKey = "";
    var handle = req.body.userHandle
    console.log(handle);
    const url = "https://codeforces.com/api/user.status?handle="+handle+"&from=1&count=100000000";
    const inforUrl = "https://codeforces.com/api/user.info?handle="+handle;

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
                for (let key in problemsStats) {
                    problemsStats[key] = 0;
                }

                problemsRatings = []
                xValues = []
                yValues = []
                
                for(let i = 0; userData.result.length>i; i++){
                    var state = userData.result[i].verdict;
                    var rating = userData.result[i].problem.rating;
                    problemsStats["total"]++;
                    
                    if(rating in problemsRatings && state==="OK" )problemsRatings[rating]++;
                    else if(state === "OK" && !(rating in problemsRatings) )  problemsRatings[rating] = 1; 

                    if (state in problemsStats) problemsStats[state]++;
                    else  problemsStats.other ++;                      
                }

                
                for(let key in problemsRatings){
                    console.log(key + ": " + problemsRatings[key]);
                    if(key === "undefined")continue;
                    xValues.push(key);
                    yValues.push(problemsRatings[key]);
                }

                res.redirect("/stats");
                   
            } catch (error) {
                console.log(`Error parsing JSON: ${error}`);
                res.redirect("/")
            }
        });
    });
});


app.listen(3000, (req,res)=>{
    console.log("running on port 3000");
})


