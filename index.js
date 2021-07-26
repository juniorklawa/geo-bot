const fetch = require("node-fetch");
const puppeteer = require("puppeteer");

async function main() {
  const download = require("download-chromium");
  const os = require("os");
  const tmp = os.tmpdir();

  const executablePath = await download({
    revision: 694644,
    installPath: `${tmp}/.local-chromium`,
  });

  const browser = await puppeteer.launch({
    executablePath,
    headless: false,
    defaultViewport: null,
  });

  const Blocker = require("@cliqz/adblocker-puppeteer");

  Blocker.PuppeteerBlocker.fromPrebuiltAdsAndTracking(fetch).then((blocker) => {
    blocker.enableBlockingInPage(page);
  });

  const page = await browser.newPage();
  await page.goto("https://generator.email/");

  const pages = await browser.pages();
  if (pages.length > 1) {
    await pages[0].close();
  }

  const email = await page.evaluate(async () => {
    function delay(time) {
      return new Promise(function (resolve) {
        setTimeout(resolve, time);
      });
    }
    const generatedEmail = document.querySelector("#email_ch_text").textContent;
    delay(1000);
    return generatedEmail;
  });

  const axios = require("axios");

  await axios.post("https://www.geoguessr.com/api/v3/accounts/signup", {
    email,
  });

  await page.waitForTimeout(5000);

  await page.click("#refresh > button");

  await page.waitForTimeout(1000);

  const newAccountLinkToken = await page.evaluate(() => {
    function delay(time) {
      return new Promise(function (resolve) {
        setTimeout(resolve, time);
      });
    }
    delay(1000);
    const button = document.querySelector(
      "#email-table > div.e7m.row.list-group-item > div.e7m.col-md-12.ma1 > div.e7m.mess_bodiyy > div > div > div:nth-child(3) > a"
    );

    return button.href;
  });

  const newAccountPage = await browser.newPage();
  await newAccountPage.goto(newAccountLinkToken);

  await page.close();

  await newAccountPage.waitForSelector(
    "#__next > div > main > form > section > section.grid__column.grid__column--span-2 > div > div:nth-child(1) > div.form-field__field > input"
  );
  await newAccountPage.type(
    "#__next > div > main > form > section > section.grid__column.grid__column--span-2 > div > div:nth-child(1) > div.form-field__field > input",
    "123123"
  );

  await newAccountPage.waitForSelector(
    "#__next > div > main > form > section > section.grid__column.grid__column--span-2 > div > div:nth-child(2) > div.form-field__field > input"
  );

  await newAccountPage.type(
    "#__next > div > main > form > section > section.grid__column.grid__column--span-2 > div > div:nth-child(2) > div.form-field__field > input",
    "123123"
  );

  await newAccountPage.waitForTimeout(200);

  await newAccountPage.evaluate(() => {
    document.querySelectorAll("button")[1].click();
  });

  await newAccountPage.waitForTimeout(1500);
  await newAccountPage.click(
    "#__next > div > div > header > div.header__left > a"
  );
}

main();
