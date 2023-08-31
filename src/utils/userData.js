const users = []


const storeUser = function(user){
       users.push(user)
}


const getUser = function(_id){
    console.log(_id)
    const match = users.find((user)=>{
        return user._id === _id;
    })
    return match;
}

module.exports = {storeUser,getUser}