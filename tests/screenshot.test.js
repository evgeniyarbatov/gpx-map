const fs = require('fs');
const puppeteer = require('puppeteer');
const path = require('path');

const URL = 'http://localhost:3000';

describe('Screenshot tests', function() {
  let browser;
  let page;

  const locations = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, 'data.json'), 
      'utf8',
    ),
  );

  before(async () => {
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-web-security',
        '--force-device-scale-factor=2',
      ],
    });

    // Give geolocation permission
    const context = browser.defaultBrowserContext();
    await context.overridePermissions(URL, ['geolocation']);

    page = await browser.newPage();

    await page.setViewport({
      width: 280,  // 1.3" × 216 DPI ≈ 280px
      height: 368, // 1.7" × 216 DPI ≈ 368px
      deviceScaleFactor: 2, // High quality rendering
    });
  });

  after(async () => {
    await browser.close();
  });

  locations.forEach(({ name, lat, lon, azimuth, distance }) => {
    it(`take a screenshot for ${name}`, async () => {
      await page.setGeolocation({
        latitude: lat, 
        longitude: lon,
      });

      await page.goto(`${URL}?rotation=${azimuth}&distance=${distance}`);

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

      const imagesDir = path.join(__dirname, 'images');
      if (!fs.existsSync(imagesDir)) {
        fs.mkdirSync(imagesDir);
      }

      await page.screenshot({ path: path.join(imagesDir, `${name}.png`) });
    });
  });
});