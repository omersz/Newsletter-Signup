const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const { response } = require("express");

const app = express();

//css ve resimler gibi statik dosyaları sunabilmesi için
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

// anasayfaya gittiklerinde ilk olarak gösterilen yer
app.get("/",function(req,res){
    res.sendFile(__dirname + "/signup.html");
});

app.post("/",function(req,res){
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    console.log(firstName, lastName, email);

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName,
                }
            }
        ]
    };


    const jsonData = JSON.stringify(data);

    const url = "https://us17.api.mailchimp.com/3.0/lists/078826188e";
    
    const options = {
        method: "POST",
        auth: "omer_sz:e08d041d478d915e2700a146c179fadb-us17"
    }
    
    const request = https.request(url, options, function(response){
        
        if (response.statusCode === 200) {
            res.sendFile(__dirname+ "/success.html");
        } else {
            res.sendFile(__dirname+ "/failure.html");
        }
        
        response.on("data", function(data){
            console.log(JSON.parse(data));
        })
    })
    request.write(jsonData);
    request.end();
}); 

app.post("/failure", function(req, res){
    res.redirect("/");
})


app.listen(process.env.PORT || 3000, function(){
    console.log("server is running on port 3000");
});