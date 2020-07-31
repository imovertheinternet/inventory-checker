const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const cherrio = require("cheerio");
const axios = require('axios');
const nodemailer = require("nodemailer");
require('dotenv').config();

// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/index.html');
// });

console.log('Node Starting...');

/**
 * Query website every minute
 */
setInterval(apiCall, 60000);
let previousItemList = [];

function apiCall() {
  // axios.get('https://stickthison.com/collections/morale-patches').then(urlResponse => {
    axios.get('https://www.spiritussystems.com/shop-all/?sort=best-selling&page=1').then(urlResponse => {
    console.log('Spiritus: Making call');
    let currentItemList = [];
    const $ = cherrio.load(urlResponse.data);
    $('article.product-item').each((i, element) => {
    const productTitle = $(element).find("div.product-item-details h3 a").attr('title')
    const productLink = $(element).find("figure.product-item-thumbnail a").attr('href');
    const OOS = $(element).find("div.product-item-details div").hasClass('alert-message');
    currentItemList.push({title: productTitle, outOfStock: OOS, productLink: productLink});

    /**
     * STICKTHISON SCRAPER
     */
    // $('div.one-third.column').each((i, element) => {
    //   const productTitle = $(element).find("a div.info span.title").text();
    //   const OOS = $(element).find("a div.info span.price span").hasClass('sold_out')
    //   currentItemList.push({title: productTitle, outOfStock: OOS, productLink: 'N/A'});

    })

    if (previousItemList.length === 0) {
      console.log('Spiritus: Nothing previous to compare, script now starting...');
      previousItemList = currentItemList;
    } else {
      /**
       * If the current array of data does not match previous, then something changed...otherwise nothing changed.
       */
      let inventoryChange = currentItemList.filter(function (item, index) {
        return !(item.outOfStock === previousItemList[index].outOfStock);
      });

      // Nothing changed
      if (inventoryChange.length === 0) {
        console.log('Spiritus: No change in inventory');
        io.emit('Spiritus Broadcast', `No Change In Inventory`);
        // can remove this later just doing this so i get payload of array
        // main(currentItemList).catch(console.error);
      } else {
        console.log('Spiritus: Inventory Changed, should be getting an email');
        // console.log('INVENTORY ALERT: ' + name + ' is now ' + (oos ? 'out of stock :(' : 'IN STOCK -- GOGOGO'));
        // io.emit('Spiritus Broadcast', ('INVENTORY ALERT: ' + name + ' is now ' + (oos ? 'out of stock :(' : 'IN STOCK -- GOGOGO')))
        main(inventoryChange).catch(console.error);

        // main('INVENTORY ALERT: ' + name + ' is now ' + (oos ? 'out of stock :(' : 'IN STOCK -- GOGOGO')).catch(console.error);
        previousItemList = currentItemList;
      }
    }
  })
}


// async..await is not allowed in global scope, must use a wrapper
async function main(bundle) {
  let message = '';
  for (let i = 0; i < bundle.length; i++) {
    let name = bundle[i].title;
    let oos = bundle[i].outOfStock;
    let productLink = bundle[i].productLink;
    message += ("<b>Product Name: </b>" + name + (oos ? ' OUT OF STOCK :(' : ' IN STOCK') + ' Product Link: ' + productLink + " <br>") ;
  }

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    // host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      // user: 'mallory.rosenbaum@ethereal.email', // generated ethereal user
      // pass: 'txNRfQjMA2aGzXtqnc', // generated ethereal password
      user: process.env.MAIL_UN, // generated ethereal user
      pass: process.env.MAIL_PW, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    // from: 'mallory.rosenbaum@ethereal.email', // sender address
    from: 'imovertheinternet@gmail.com',
    to: "eurofraid@gmail.com",
    subject: "Spiritus Inventory Update 😍",
    text: message,
    html: message,
  });

  console.log("Message sent: %s", info.messageId); // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
}


/**
 * Websock for frontend
 * TODO Not sure how to best utilize this feature yet
 */
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
  // console.log('Mail UN: ', process.env.MAIL_UN);
  // console.log('Mail UN: ', process.env.MAIL_PW);
});
