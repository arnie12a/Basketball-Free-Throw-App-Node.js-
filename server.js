
const express = require('express');
const app = express();

data = [];

app.set('view-engine', 'ejs');

// Api Middelwares
app.use(express.json()); // th is is to accept data in json format
app.use(express.urlencoded()); // this is basically to decode the data sent through html form
app.use(express.static('public')); // this to serve out publiv folder as a static folder


// API ROUTES

app.get('/', (req, res) => {
    res.render('index.ejs', {name: 'Arnav Karnik'})
})

app.get('/addData', (req, res) => {
    res.render('form.ejs')
});

app.get('/dashboard', (req, res) => {
    let made = 0
    let total = 0
    for(let i=0; i<data.length; i++){
        made = made + Number(data[i][0]);
        total = total + Number(data[i][1]);
    }
    let percentage;
    if(data.length == 0){
        percentage = 0;
    }
    else{
        percentage = Math.round((made/total)*100)
    }
    
    res.render('dashboard.ejs', {shootingPercentage: percentage})
});

app.get('/error', (req, res) => {
    res.render('error.ejs');
});

app.post('/addData', (req, res) => {
    let freeThrowsMade = req.body.FTmade;
    let freeThrowsAttempted = req.body.FTattempted;
    try{
        // checks to see if FT made is more than total FT attempted
        if(freeThrowsMade>freeThrowsAttempted){
            throw "FT made > total FT attempted";
        }

        // checks if either input is negative
        if(!(freeThrowsAttempted>0 && freeThrowsMade>0)){
            throw "Input is negative";
        }
    } catch (error) {
        next(error);
    } 
    var temp = [];
    temp.push(freeThrowsMade);
    temp.push(freeThrowsAttempted);
    data.push(temp);
    
    res.writeHead(301, {"Location": "/dashboard"});
    return res.end(); 
});


app.use((error, req, res, next) => {
    res.redirect('/error');
});

app.listen(4000, () => console.log("http://localhost:4000"))

