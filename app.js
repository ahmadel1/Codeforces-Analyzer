const express = require('express');
const bodyParser = require("body-parser");
const https = require('https');

const app = express();
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("public"));
app.set('view engine', 'ejs');

let problemsStats =  {total : 0, OK:0 , WRONG_ANSWER:0, TIME_LIMIT_EXCEEDED: 0, RUNTIME_ERROR: 0, MEMORY_LIMIT_EXCEEDED : 0, other : 0};
let problemsRatings = [];
let xValues = [];
let checked = {};
let yValues = [];
let userNotFound = false;

app.get("/", (req, res)=>{
    res.render("home", {userNotFound:userNotFound});
})

app.get("/stats" , (req,res)=>{
    if(req.body.userHandle === "") res.redirect("/")
    const statueValue = ["OK", "WRONG_ANSWER", "TIME_LIMIT_EXCEEDED", "RUNTIME_ERROR", "MEMORY_LIMIT_EXCEEDED", "other"];
    const statueTitle= ["Accepted" , "Wrong Answer", "Time Limit", "Runtime error", "Memory Limit", "Other"];
    res.render("stats", {data: problemsStats, xValues: xValues, yValues: yValues, statueValue : statueValue, statueTitle :statueTitle});
})

app.post("/", (req, res)=>{
    var apiKey = "";
    var handle = req.body.userHandle
    handle = handle.trim(); //remove white space from begining and ending of the input

    const url = "https://codeforces.com/api/user.status?handle="+handle+"&from=1&count=10000000";
    const infoUrl = "https://codeforces.com/api/user.info?handles="+handle;
    
    https.get(url, (response)=>{
        console.log(response.statusCode);
        let data = "";
        userNotFound = false;

        response.on("data", (chunk)=>{
            data += chunk;
        });

        response.on("end", ()=>{
            try {
                const userData = JSON.parse(data);
                console.log(userData);
                //reset variables every new search
                for (let key in problemsStats) {
                    problemsStats[key] = 0;
                }
                problemsRatings = [];
                xValues = [];
                yValues = [];
                checked = {};

                generateProblemStats(userData);
                generateChartData();
                res.redirect("/stats");
                   
            } catch (error) {
                userNotFound = true;
                console.log(`Error parsing JSON: ${error}`);
                res.redirect("/")
            }
        });
    });
});


app.listen(3000, (req,res)=>{
    console.log("running on port 3000");
})



function generateProblemStats(userData){
    for(let i = 0; userData.result.length>i; i++){
        var state = userData.result[i].verdict;
        var rating = userData.result[i].problem.rating;
        problemsStats["total"]++;
        
        var problemID = userData.result[i].problem.contestId + userData.result[i].problem.index;
        
        if(rating in problemsRatings && state==="OK" && check(problemID))problemsRatings[rating]++;
        else if(state === "OK" && !(rating in problemsRatings) )  problemsRatings[rating] = 1; 

        if (state in problemsStats) problemsStats[state]++;
        else  problemsStats.other ++;                      
    }
}

function check(problem){
    if(problem in checked)return false;
    else{
        checked[problem] = true;
        return true;
    }
}

function generateChartData(){
    for(let key in problemsRatings){
        console.log(key + ": " + problemsRatings[key]);
        if(key === "undefined")continue;
        xValues.push(key);
        yValues.push(problemsRatings[key]);
    }
};
                