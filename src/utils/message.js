const generateMessage = function(text,userName){
    return {
        userName,
        text,
        createdAt:new Date()
    }
}

const generateLocationMessage = function(text){
    return {
        text,
        createdAt:new Date()
    }
}


module.exports = {generateLocationMessage,generateMessage};