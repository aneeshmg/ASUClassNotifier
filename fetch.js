// Use prompt if login is required
/* const prompt = require('prompt')
// TODO: Move this login stuff into separate file/module
const promptSchema = {
    properties : {
        asuid : {
            pattern : /^[a-zA-Z]+$/,
            message : 'ASU ID can only be letters',
            required : true
        },
        passkey : {
            hidden : true,
            replace : '*',
            required : true,
            message : 'Enter password',
            pattern : /^\w+$/
        }
    }
}

prompt.start()

prompt.get(promptSchema, (err, data) => {
    // asu id and pass available here
})
*/

const classParser = require('./class-parser')
const puppeteer = require('puppeteer')

let pages = []

// IFFY execution
module.exports = async context => {
    const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']})
    const page = await browser.newPage()

    const baseUrl = "https://webapp4.asu.edu/catalog/myclasslistresults"
    let urlParams = `t=${context.term}&s=${context.dept}&hon=F&promod=F&e=all`
    urlParams += context.kik? `&n=${context.number}` : ''
    const url = `${baseUrl}?${urlParams}`

    /* Uncomment for login
     * await page.goto('https://my.asu.edu/')
     * await page.type('#username', '')
     * await page.type('#password', '')
     * await page.click('.submit')
     */

    // Use for testing
    const testUrl1 = "http://localhost:8000/index1.html"
    const testUrl2 = "http://localhost:8000/index2.html"
    const testUrl3 = "http://localhost:8000/index3.html"
    // await page.goto(testUrl1)
    // pages.push(await page.content())
    // await page.goto(testUrl2)
    // pages.push(await page.content())
    // await page.goto(testUrl3)
    // pages.push(await page.content())

    if (context.kik) {
        console.log(url)
        await page.goto(url)
        pages.push(await page.content())
        pages = []
    } else {
        // If a scheduled job triggers it
        await page.goto(`${url}&page=1`)
        pages.push(await page.content())
        await page.goto(`${url}&page=2`)
        pages.push(await page.content())
        await page.goto(`${url}&page=3`)
        pages.push(await page.content())
    }

    /* If you need a screenshot of the loaded page(s)
     * await page.waitForSelector('.pagination')
     * await page.screenshot({ path: 'asu.png', fullPage: true })
     */

    await browser.close()

    classParser(pages, context)
}

