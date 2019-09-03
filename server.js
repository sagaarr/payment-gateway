const express = require('express');
const path = require('path')
const paypal = require('paypal-rest-sdk')
let app = express();




paypal.configure({
    'mode':'sandbox',
    'client_id':'your client_id',
    'client_secret':'your client_secret'
})

app.use('/',express.static(path.join(__dirname, 'public')));

app.get('/', (req,res)=>{
    res.redirect('/index.html')
})


app.get('/buy',(req,res)=>{
    // Create payment object
    let payment = {
        "intent":"authorize",
        "payer":{
            "payment_method":"paypal"
        },
        "redirect_urls":{
            "return_url":"http://127.0.0.1:3000/success",
            "cancel_url":"http://127.0.0.1:3000/err"
        },
        "transactions":[{
            "amount":{
                "total":1.00,
                "currency":"INR"
            },
            "description":"Hiii SAGAR its first payment of your through paypal"
        }]
    }

    // Call create pay method
    createPay(payment)
        .then((transaction)=>{
            let id = transaction.id
            let links = transaction.links;
            let counter = links.length;
            while(counter -- ){
                if(links[counter].method == 'REDIRECT'){
                    // redirect to paypal where user approves the transaction 
                    return res.redirect( links[counter].href )
                }
            }

        })
        .catch( ( err ) => { 
            console.log( err ); 
            res.redirect('/err');
        });
})

// success page 
app.get('/success' , (req ,res ) => {
    console.log(req.query); 
    res.redirect('/success.html'); 
})

// error page 
app.get('/err' , (req , res) => {
    console.log(req.query); 
    res.redirect('/err.html'); 
})

// helper functions
var createPay = ( payment ) => {
    return new Promise( ( resolve , reject ) => {
        paypal.payment.create( payment , function( err , payment ) {
         if ( err ) {
             reject(err); 
         }
        else {
            resolve(payment); 
        }
        }); 
    });
}						
		

app.listen(3000, ()=>{
    console.log("Payment Gateway Started")
})