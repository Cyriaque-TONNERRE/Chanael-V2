const cron = require('node-cron');
const puppeteer = require('puppeteer');
const {aurionEmail, aurionPassword, channelAnnounceId, guildId} = require('../config.json');
const {QuickDB} = require("quick.db");
const db = new QuickDB();

const note_db = db.table("note");

module.exports = {
    name: 'nouvelle_note',
    execute(client) {
        cron.schedule('*/15 * * * *', async () => {
            const browser = await puppeteer.launch({executablePath: '/usr/bin/chromium-browser'
                , headless: "new" //, slowMo: 100, // Uncomment to visualize test
            });
            const page = await browser.newPage();

            // Load "http://aurion.junia.com/faces/Login.xhtml"
            await page.goto('http://aurion.junia.com/faces/Login.xhtml');

            // Resize window to 1920 x 935
            await page.setViewport({ width: 1920, height: 935 });

            // Fill "Email" on <input> #username
            await page.waitForSelector('#username:not([disabled])');
            await page.type('#username', aurionEmail);

            // Fill "password" on <input> #password
            await page.waitForSelector('#password:not([disabled])');
            await page.type('#password', aurionPassword);

            // Click on <span> "Connexion" and await navigation
            await page.waitForSelector('.ui-button-text:nth-child(1)');
            await Promise.all([
                page.click('.ui-button-text:nth-child(1)'),
                page.waitForNavigation()
            ]);

            // Click on <a> "Scolarité"
            await page.waitForSelector('.submenu_44413 > [href="#"]');
            await Promise.all([
                page.click('.submenu_44413 > [href="#"]'),
                page.waitForNavigation()
            ]);
            // Click on <a> "Mes notes" and await navigation
            await page.waitForSelector('.ui-widget-content > .ui-menuitem:nth-child(2) > [href="#"]');
            await Promise.all([
                page.click('.ui-widget-content > .ui-menuitem:nth-child(2) > [href="#"]'),
                page.waitForNavigation()
            ]);
            // Click on <span> "Seek End" and await navigation
            await page.waitForSelector('.ui-icon-seek-end');
            await page.click('.ui-icon-seek-end');
            // Cherche la derniere note
            await page.waitForSelector('.ui-paginator-last.ui-state-disabled');
            const element = await page.evaluate(() => document.querySelector('.ui-datatable-tablewrapper > table > tbody > tr:last-child').attributes['data-ri'].value);
            const nbnote = parseInt(element) + 1;
            await browser.close();
            if (nbnote > await note_db.get("nbNote")) {
                client.guilds.cache.get(guildId).channels.cache.get(channelAnnounceId).send("Une nouvelle note est apparue sur Aurion !");
                await note_db.set(`nbNote`, nbnote);
            }
        },{
            scheduled: true,
            timezone: "Europe/Paris"
        });
    }
}
