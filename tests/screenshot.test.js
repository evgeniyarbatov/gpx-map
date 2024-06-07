const puppeteer = require('puppeteer');
const path = require('path');

const URL = 'http://localhost:3000';

describe('Screenshot tests', function() {
  let browser;
  let page;

  const locations = [
    { name: 'home', latitude: 1.3095707398376149, longitude: 103.8943942558364 },
  ];

  before(async () => {
    browser = await puppeteer.launch();

    // Give geolocation permission
    const context = browser.defaultBrowserContext();
    await context.overridePermissions(URL, ['geolocation']);

    page = await browser.newPage();

    // Emulate mobile phone
    await page.setViewport({ width: 240, height: 320, isMobile: true });
  });

  after(async () => {
    await browser.close();
  });

  locations.forEach(({ name, latitude, longitude }) => {
    it(`take a screenshot for ${name}`, async () => {
      await page.setGeolocation({
        latitude: latitude, 
        longitude: longitude,
      });

      await page.goto(URL);

      await page.waitForSelector('#map', { visible: true });

      // Evaluate the map's state to wait for the 'rendercomplete' event
      await page.evaluate(() => {
        return new Promise((resolve) => {
          const mapElement = document.getElementById('map');
          const map = mapElement.mapInstance;

          if (map) {
            if (map.get('loadStatus') === 'complete') {
              resolve();
            } else {
              map.once('rendercomplete', () => {
                resolve();
              });
            }
          } else {
            console.error('Map instance is not found.');
          }
        });
      });

      await page.screenshot({ path: path.join(__dirname, 'images', `${name}.png`) });
    });
  });
});