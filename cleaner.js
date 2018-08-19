module.exports = (rawJSON, context, handler) => {
    let cleaned = rawJSON.filter(e => e.name.length > 0 && 
        e.instructor.length > 0 &&
        e.total.length > 0 &&
        e.available.length > 0).map(e => {
            return `Name: ${e.name} \n- ${e.instructor}\n 
            Available: ${e.available}\nTotal: ${e.total}` 
        }).map(e => `${e}\n` )
    
    handler.method.send(handler.context.to, handler.context.id)
}