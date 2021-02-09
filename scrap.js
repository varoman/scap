const puppeteer = require('puppeteer');
const { parse } = require('node-html-parser');
const Handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');
const { send } = require('./mailing');
const { login_email, login_password } = process.env;


const scrap = async () => {
    console.log('started scrapping...')
    const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});

    const page = await browser.newPage();
    await page.goto('https://lk.kinglab.pro/lk/', {waitUntil: 'networkidle0'});

    await page.type('#user_login', login_email);
    await page.type('#user_pass', login_password);

    await page.click('#wp-submit');

    await page
        .waitForNavigation({ waitUntil: 'networkidle0' })
        .catch((e) => console.error(e, 'waitForNavigationError'));
    await page.click('button[type="submit"]')

    const firstResponse = await page.waitForResponse(response => response.url() === 'https://lk.kinglab.pro/wp-content/themes/byblos/bootstrap-custom/trade.php' && response.status() === 200);
    const secondResponse = await page.waitForResponse(response => response.url() === 'https://lk.kinglab.pro/wp-content/themes/byblos/bootstrap-custom/trade.php' && response.status() === 200);
    const a = await firstResponse.text();
    const b = await secondResponse.text();

    const root = parse(a).querySelectorAll('td').length > parse(b).querySelectorAll('td').length ? parse(a) : parse(b);
    const list = generateList(root.querySelectorAll('td'));
    const templateStr = fs
        .readFileSync(path.resolve(__dirname, 'template.hbs'))
        .toString('utf8')

    const comp = Handlebars.compile(templateStr);
    const fin = comp({list});

    const newPage = await browser.newPage();
    await newPage.setContent(fin);
    await newPage.setViewport({
        width: 428,
        height: 926,
    });

    const fileBuffer = await newPage.screenshot();
    await send(fileBuffer);
    await browser.close();

    console.log('finished scrapping...')
}

const generateList = (trs) => {
    const values = [];
    const valuesSplicedBy3 = [];
    for (let i = 0; i < trs.length; i += 2) {
        values.push({
            name: trs[i].rawText,
            value: trs[i + 1].rawText,
        });
    }
    for (let i = 0; i < values.length; i += 3) {
        valuesSplicedBy3.push(values.slice(i, i + 3));
    }
    return valuesSplicedBy3;
}

module.exports.scrap = scrap;
