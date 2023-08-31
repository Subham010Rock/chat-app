const socket = io();


const $messageForm = document.querySelector('form')
const $messageInput = $messageForm.querySelector('input')
const $messageButton = $messageForm.querySelector('button')
const $locationButton= document.querySelector('#sendlocation')
const $messages = document.querySelector('#messages')
const $messageTemplate = document.querySelector('#message-template').innerHTML
const $locationTemplate = document.querySelector('#location-template').innerHTML
// socket.on('clickUpdate',(count)=>{
//     console.log('count',count)
// })



// document.querySelector("#increment").addEventListener('click',()=>{
//     socket.emit('increment')
// })

const {username,room} = Qs.parse(location.search,{ignoreQueryPrefix:true});

$messageForm.addEventListener('submit',(e)=>{

    //preventing for suto submitting form
    e.preventDefault();
    console.log(room)

    //disable message button untill previous message not sent
    $messageButton.setAttribute('disabled','disabled')

    socket.emit('sendMessage',e.target.elements.message.value,()=>{
        $messageInput.value='';
        $messageInput.focus();

        //enable message button
        $messageButton.removeAttribute('disabled');
    })
})

socket.on('welcomeMessage',(message)=>{
    console.log(message)
    const html = Mustache.render($messageTemplate, {
        message:message.text,
        createdAt:moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
})
socket.on('message',(message)=>{
    console.log(message)
    const html = Mustache.render($messageTemplate, {
        message:message.text,
        createdAt:moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
})


$locationButton.addEventListener('click',()=>{

    $locationButton.setAttribute('disabled','disabled')
    if(!navigator.geolocation)
    alert("failed to get your location")

    navigator.geolocation.getCurrentPosition((position)=>{
        const gps ={
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }
        socket.emit('location',gps,()=>{
            console.log('location shared successfully');
            $locationButton.removeAttribute('disabled');
        })
})
})

socket.on('location',(location)=>{
    console.log(location)
    const html = Mustache.render($locationTemplate,
        {
            location:location.text,
            createdAt:moment(location.createdAt).format('h:mm a')
        })
    
    $messages.insertAdjacentHTML('beforeend',html)
})


socket.emit('join',{username,room})