module.exports = (rawJSON, context, handler) => {
    let cleaned = rawJSON.filter(e => e.name.length > 0 && 
        e.instructor.length > 0 &&
        e.total.length > 0 &&
        e.available.length > 0)
    
    handler(cleaned)
}