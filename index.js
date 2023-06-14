const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/check', async (req, res) => {
  const { username, password } = req.query;

  // Launch a new browser instance
  const browser = await puppeteer.launch({
    headless: true, // Set to true to run in headless mode
    args: ['--no-sandbox'] // Required when running in Docker container
  });

  try {
    // Create a new page instance
    const page = await browser.newPage();

    // Navigate to Facebook.com
    await page.goto('https://www.facebook.com/');

    // Fill in the login form
    await page.type('#email', username);
    await page.type('#pass', password);
    await page.click('#u_0_5_m7');

    // Wait for the navigation to complete
    await page.waitForNavigation();

    // Check if login was successful
    const success = await page.evaluate(() => {
      return document.querySelector('div.x1i10hfl.x1qjc9v5.xjbqb8w.xjqpnuy.xa49m3k.xqeqjp1.x2hbi6w.x13fuv20.xu3j5b3.x1q0q8m5.x26u7qi.x972fbf.xcfux6l.x1qhh985.xm0m39n.x9f619.x1ypdohk.xdl72j9.x2lah0s.xe8uvvx.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.x2lwn1j.xeuugli.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x1n2onr6.x16tdsg8.x1hl2dhg.xggy1nq.x1ja2u2z.x1t137rt.x1q0g3np.x87ps6o.x1lku1pv.x1a2a7pz.x1lq5wgf.xgqcy7u.x30kzoy.x9jhf4c.x1lliihq') !== null;
    });

    // Return success or failed
    res.send(success ? 'success' : 'failed');
  } catch (error) {
    console.error(error);
    res.send('failed');
  } finally {
    // Close the browser instance
    await browser.close();
  }
});
app.get('/', async (req, res) => {
  res.send('Empty Project');
});
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
