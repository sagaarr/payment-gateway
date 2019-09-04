const express = require('express');
const path = require('path')
const paypal = require('@paypal/checkout-server-sdk');
let app = express();


let CLIENT_ID = ''
let CLIENT_SECRET = '';
let environment = new paypal.core.SandboxEnvironment(CLIENT_ID, CLIENT_SECRET);
let client = new paypal.core.PayPalHttpClient(environment);



app.use('/',express.static(path.join(__dirname, 'public')));

app.get('/', (req,res)=>{
    res.redirect('/index.html')
})


app.get('/buy',(req,res)=>{

    let request = new paypal.orders.OrdersCreateRequest();
   
    request.requestBody({
        "intent": "CAPTURE",
        "purchase_units": [
            {
                "amount": {
                    "currency_code": "INR",
                    "value": "1.00"
                }
            }
         ]
    });

    // Call API with your client and get a response for your call
let createOrder  = async function(){
    let response = await client.execute(request);
    let something = new paypal.orders.OrdersCaptureRequest(response.result.id);
    something.requestBody({});
    console.log(something)
    console.log(`Response: ${JSON.stringify(response, null, 2)}`);
    // If call returns body in response, you can get the deserialized version from the result attribute of the response.
   
   res.redirect(response.result.links[0].href);
}

createOrder();
})

// success page 
app.get('/success' , (req ,res ) => {
console.log(" From Success ")
 
})

// error page 
app.get('/err' , (req , res) => {
    console.log(" From  Error")
  
})

		

app.listen(3000, ()=>{
    console.log("Payment Gateway Started")
})