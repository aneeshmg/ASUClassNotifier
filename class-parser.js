const jsdom = require("jsdom")
const { JSDOM } = jsdom
const cleaner = require('./cleaner')

let formatted = []

module.exports = (rawHTMLData, config) => {
        console.log('pages - ' + rawHTMLData.length)
        rawHTMLData.map(e => {
                let parsedData = new JSDOM(e)
                let allRows = parsedData.window.document.querySelector("#CatalogList tbody").rows
                let rows = Object.keys(allRows).map(key => allRows[key])
                rows.map(e => {
                        // This is specifically written to search for CSE courses, may not work for others ie will require modification in the parsing below.
                        let subjectCode = e.cells[0].innerHTML.split("\n").filter(e => e.search(config.dept) > 0)
                        let subjectName = e.cells[1].innerHTML.split("\n")[8].replace('\t', '').trim()
                        let subjectInstructor = e.cells[3].innerHTML.split("\n")
                        let subjectSeatsOpen = e.cells[10].innerHTML.split("\n")[6].replace('\t', '').trim()
                        let subjectSeatsTotal = e.cells[10].innerHTML.split("\n")
                        let f = {}
                        if(subjectCode.length > 0)
                                f.code = subjectCode[0].replace('\t', '').trim()
                        f.name = subjectName
                        if(subjectInstructor.length <= 7) f.instructor = "Select instructor during enrollment"
                        else if (e.cells[3].innerHTML.split("\n").length == 24) f.instructor = subjectInstructor[16].replace('\t', '').trim()
                        else f.instructor = subjectInstructor[11].replace('\t', '').trim()
                        if(subjectSeatsTotal.length < 44) f.total = subjectSeatsTotal[12].replace('\t', '').trim()
                        else f.total = ''
                        f.available = subjectSeatsOpen
                        formatted.push(f)
                })
        })
        cleaner(formatted, config)
}
