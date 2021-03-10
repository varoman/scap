const puppeteer = require('puppeteer');
const { parse } = require('node-html-parser');
const Handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');
const { sendMail } = require('./mailing');
const { login_email, login_password, web_url, response_url } = process.env;


const scrap = async () => {
    console.log('started scrapping...')
    const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});

    const page = await browser.newPage();
    await page.goto(web_url, {waitUntil: 'networkidle0'})
        .catch(e => console.error(e, 'page.goto'));

    await page.type('#user_login', login_email);
    await page.type('#user_pass', login_password);

    await page.click('#wp-submit')
        .catch(e => console.error(e, 'wp-submit'));

    await page
        .waitForNavigation({ waitUntil: 'networkidle0' })
        .catch((e) => console.error(e, 'waitForNavigationError'));
    await page.click('button[type="submit"]')

    const firstResponse = await page.waitForResponse(response => response.url() === response_url && response.status() === 200);
    const secondResponse = await page.waitForResponse(response => response.url() === response_url && response.status() === 200);
    const a = await firstResponse.text();
    const b = await secondResponse.text();

    const root = parse(a).querySelectorAll('td').length > parse(b).querySelectorAll('td').length ? parse(a) : parse(b);
    const list = generateChunkedList(root.querySelectorAll('td'));
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
    await sendMail(fileBuffer);
    await browser.close();

    console.log('finished scrapping...');
}

const generateChunkedList = (list, chunkSize = 3) => {

    const titles = ['Акции', 'Фьючерсы', 'Валюта'];
    const chunkedList = [];
    const odds = list.filter((_, i) => i % 2 !== 0);
    const even = list.filter((_, i) => i % 2 === 0);
    const values = odds.map((it, i) => ({ name: even[i].rawText, value: it.rawText }));
    for (let i = 0; i < values.length; i += chunkSize) {
        chunkedList.push({
            data: values.slice(i, i + chunkSize),
            title: titles[chunkedList.length],
        });
    }
    return chunkedList;
}


module.exports.scrap = scrap;
