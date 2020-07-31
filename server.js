const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const cherrio = require("cheerio");
const axios = require('axios');
const nodemailer = require("nodemailer");
const env = require('dotenv').config();

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

const res = setInterval(apiCall, 25000);
let previousItemList = [];
console.log('Here we go...');
function apiCall() {
  axios.get('https://stickthison.com/collections/morale-patches').then(urlResponse => {
  // axios.get('https://www.spiritussystems.com/shop-all/?sort=best-selling&page=1').then(urlResponse => {
    console.log('Making call to Spiritus');
    let currentItemList = [];
    const $ = cherrio.load(urlResponse.data);
    // $('article.product-item').each((i, element) => {
      // const productTitle = $(element).find("div.product-item-details h3 a").attr('title')
      // const alertMessage = $(element).find("div.alert-message").html();
      // const OOS = $(element).find("div.product-item-details div").hasClass('alert-message')
      // currentItemList.push({title: productTitle, outOfStock: OOS});


      $('div.one-third.column').each((i, element) => {
          const productTitle = $(element).find("a div.info span.title").text();
          const OOS = $(element).find("a div.info span.price span").hasClass('sold_out')
          currentItemList.push({title: productTitle, outOfStock: OOS});
    })

    if (previousItemList.length === 0) {
      console.log('Starting script');
      previousItemList = currentItemList;
      // return 'first loop wont work';
    } else {
      let inventoryChange = currentItemList.filter(function (item, index) {
        return !(item.outOfStock === previousItemList[index].outOfStock);
      });
      // let inventory = currentItemList.filter(function (item, index) {
      //     return (item.outOfStock === previousItemList[index].outOfStock);
      // });

      if (inventoryChange.length === 0) {
        console.log('no change!');
        // return 'No Change In Inventory!';
        io.emit('Spiritus Broadcast', `No Change In Inventory`)

        // console.log(inventory);
      } else {
        // console.log(inventoryChange);
        for (let i = 0; i < inventoryChange.length; i++) {
          let name = inventoryChange[i].title;
          let oos = inventoryChange[i].outOfStock;
          console.log('INVENTORY ALERT: ' + name + ' is now ' + (oos ? 'out of stock :(' : 'IN STOCK -- GOGOGO'));
          io.emit('Spiritus Broadcast', ('INVENTORY ALERT: ' + name + ' is now ' + (oos ? 'out of stock :(' : 'IN STOCK -- GOGOGO')))
          main('INVENTORY ALERT: ' + name + ' is now ' + (oos ? 'out of stock :(' : 'IN STOCK -- GOGOGO')).catch(console.error);

          // return ('INVENTORY ALERT: ' + name + ' is now ' + (oos ? 'out of stock :(' : 'IN STOCK -- GOGOGO'));
        }
        previousItemList = currentItemList;
      }
    }

  })
}







// async..await is not allowed in global scope, must use a wrapper
async function main(message) {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  // let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    // host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      // user: 'mallory.rosenbaum@ethereal.email', // generated ethereal user
      user: process.env.MAIL_UN, // generated ethereal user
      // pass: 'txNRfQjMA2aGzXtqnc', // generated ethereal password
      pass: process.env.MAIL_PW, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    // from: 'mallory.rosenbaum@ethereal.email', // sender address
    from: 'imovertheinternet@gmail.com', // sender address
    to: "eurofraid@gmail.com", // list of receivers
    subject: "Spiritus Inventory Check", // Subject line
    text: message, // plain text body
    // text: "Hello world?", // plain text body
    // html: "<b>Hello world?</b>", // html body
    html: message, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

// main('nomg whatt').catch(console.error);





io.on('connection', (socket) => {
  console.log('a user connected');
  // console.log('here is res from setinval', res);

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('test message', (msg) => {
    console.log('TEST MESSAGE HERE IS COMES' + msg);
    io.emit('my broadcast', `server: ${msg}`)
  });
});
http.listen(3000, () => {
  console.log('listening on *:3000');
});
