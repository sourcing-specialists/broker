const functions = require("firebase-functions");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const puppeteer = require("puppeteer");
const app_url = process.env.FUNCTIONS_EMULATOR ? 'http://localhost:8080/' : 'https://sps-broker.web.app/'

exports.generateListPdf = functions.runWith({memory: '1GB'}).https.onRequest(async (req, res) => {

  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Headers', '*')

  const list = req.query.list_id

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(`${app_url}public/catalogue/${list}`, {
    waitUntil: 'networkidle2',
  })
  await page.emulateMediaType('screen')
  const pdf = await page.pdf({ 
    printBackground: true,
    preferCSSPageSize: true 
  })
  await browser.close();

  res.type('application/pdf').send(pdf);
})
