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

exports.generateListPdf = functions.https.onRequest(async (req, res) => {
  // Set the content type so the browser knows how to handle the response.
  res.writeHead(200, { "Content-Type": "application/pdf" });

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(`${app_url}public/catalogue/5`, {
    waitUntil: 'networkidle2',
  });
  // By removing the `path` option, we will receive a `Buffer` from `page.pdf`.
  await page.emulateMediaType('screen');
  const buffer = await page.pdf({ 
    printBackground: true,
    preferCSSPageSize: true 
  });

  await browser.close();

  // We can directly serve this buffer to the browser.
  res.end(buffer);
})
