const express = require('express');
const bodyParser = require("body-parser");
const request = require("request");
const https = require('https');
const { urlencoded } = require('body-parser');



const app = express();
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("public"));
app.set('view engine', 'ejs');


app.get("/", (req, res)=>{
    res.sendFile(__dirname + "/index.html");    
})

app.post("/", (req, res)=>{
    var apiKey = "";
    var handle = req.body.userHandle
    console.log(handle);
    const url = "https://codeforces.com/api/user.status?handle="+handle+"&from=1&count=100000000";
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
                const problemsStats =  {total : 0, other : 0};
                
            
                for(let i = 0; userData.result.length>i; i++){
                    var current = userData.result[i].verdict;
                    problemsStats["total"]++;
                    if (current in problemsStats) problemsStats[current]++;
                    else  problemsStats[current] = 1;                      
                }
                problemsStats.other = problemsStats.total - (problemsStats.WRONG_ANSWER + problemsStats.OK + problemsStats.TIME_LIMIT_EXCEEDED + problemsStats.MEMORY_LIMIT_EXCEEDED + problemsStats.RUNTIME_ERROR)              
                res.render("home", {data: problemsStats});
                  

            } catch (error) {
                console.log(`Error parsing JSON: ${error}`);
            }
        });
    });
});

app.listen(3000, (req,res)=>{
    console.log("running on port 3000");
})


