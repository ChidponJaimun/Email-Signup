
const express = require("express");
const mailchimp = require("@mailchimp/mailchimp_marketing");
require('dotenv').config();

const port = 3000;
const app = express();
const api = process.env.SECRET_KEY;


mailchimp.setConfig({
    apiKey: api,
    server: "us5",
});


app.use(express.static("public"))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/", (req, res) => {
    res.sendFile(__dirname + "/signup.html");
})

app.post("/", (req, res) => {
    const firstName = req.body.name;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const listId = "626639785a"
    var resID = null;



    async function run() {
        const response = await mailchimp.lists.addListMember(listId, {
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName
            }
        })

    
        resID = response.id;
        console.log(
            `Successfully added contact as an audience member. The contact's id is ${response.id
            }.`
           
        );
    }
    run().catch(e => res.send(e));
    setTimeout(function() {
        if (resID===null){
            res.sendFile(__dirname + "/failure.html")
        }else{
            res.sendFile(__dirname + "/success.html")
        }
    }, 5000);
    

})

app.listen(process.env.PORT || port, () => {
    console.log("server is running on port " + port);
})