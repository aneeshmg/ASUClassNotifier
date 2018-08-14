module.exports = rawJSON => {
    let clean = rawJSON.filter(e => e.name.length > 0 && 
        e.instructor.length > 0 &&
        e.total.length > 0 &&
        e.available.length > 0)
    
    console.log(clean)
}