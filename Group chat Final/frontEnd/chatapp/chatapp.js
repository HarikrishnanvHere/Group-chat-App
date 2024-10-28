const addUser = document.getElementById('addUser');
const removeUser = document.getElementById('removeUser');
const groupId = localStorage.getItem('groupId');
const token = localStorage.getItem('token');
const parentNode = document.getElementById("chat-message");
const Id = localStorage.getItem('userId');
const baseUrl = `http://localhost:3000`;


//import {io} from "socket.io-client";
const socket = io(baseUrl);
socket.on("connect", ()=>{
    console.log(`You connected with id: ${socket.id}`)
})


const Admin = JSON.parse(localStorage.getItem('isAdmin'));



if (Admin) {
    document.getElementById('addbtn').style.display = 'block';
    document.getElementById('removebtn').style.display = 'block';
}


document.getElementById('addbtn').addEventListener('click', () => {
    removeUser.style.display = 'none';
    addUser.style.display = addUser.style.display === 'none' ? 'block' : 'none';
});
document.getElementById('removebtn').addEventListener('click', () => {
    addUser.style.display = 'none';
    removeUser.style.display = removeUser.style.display === 'none' ? 'block' : 'none';
});

document.getElementById('gobackbtn').addEventListener('click', () => {
   
    (window.location.href="../dashboard/dashboard.html"); 
});


//Add another user to the group which you created.


async function addToGroup(event) {
    event.preventDefault();
    const userId = event.target.userId.value;
    const isAdmin = event.target.isAdmin.value;

    const userCreds = {
        userId,
        groupId,
        isAdmin,
    }
    //console.log(userCreds);
    try {

        let res = await axios.post(`http://localhost:3000/group/addUser`,
        userCreds,
            {
                headers: { Authorization: token }
            }).then((res)=>{
                console.log(res);
                if( res.status === 201){
                    alert('User added successfully');
                } 
            })
            

        
      
    }

    catch (err) {
        if( err.response.status === 409){
            alert('User is already in the group.');
        } else {
            alert('User not registered');
        }
    }
    event.target.userId.value ='';
    addUser.style.display = 'none';

}



//removing a user from the group


async function removeFromGroup(event) {
    event.preventDefault();
    const userId = event.target.rmuser.value;

    const userCreds = {
        userId,
        groupId,
    }

    try {

        const res = await axios.post(`http://localhost:3000/group/removeUser`,
        userCreds,
            {
                headers: { Authorization: token }
            });
            
            if (res.status === 201) {
                alert('User removed successfully');
            }

            
        }
        
        catch (err) {
        if (err.response.status === 401) {
            alert('User does not exist')
        } else{
            alert('Something went wrong')
        }
        
    }
    event.target.rmuser.value ='';
    removeUser.style.display = 'none';
}


async function sendMessage(event) {
    event.preventDefault();

    const message = event.target.message.value;
    const msg = {
        message,
        groupId
    }

    try {


        const res = await axios.post(`http://localhost:3000/message/postmessage`,
            msg,
            {
                headers: { Authorization: token }
            });
        socket.emit('send-message', msg);
        console.log(res);
        event.target.message.value = '';
        // allMsgs(groupId);
    }

    catch (err) {
        console.log(err);
    }
}


socket.on("receive-message", (message)=>{
    showMsgOnScreen(message);
})

window.addEventListener('DOMContentLoaded', () => {
    getMessages(groupId);
});

async function getMessages(groupId) {
    parentNode.innerHTML = "";

    try {
        const response = await axios.get(`http://localhost:3000/message/getmessages?groupid=${groupId}`,
            { headers: { 'Authorization': token } });
        const res = response.data//.slice(response.data.length - 10, response.data.length);
        console.log(res);
        const messages = JSON.stringify(res);
        //console.log(messages)
        // localStorage.setItem('messages', messages);

        for (let i = 0; i < response.data.length; i++) {
            const element = response.data[i];
            showMsgOnScreen(element);
        }
        //console.log(response);

    } catch (err) {
        console.log(err);
    }

const chatcontainer = document.getElementById('chat-form');
chatcontainer.scrollIntoView({ behavior: 'smooth', block: 'end' });
}


async function showMsgOnScreen(data) {
    console.log(data);

    let childHTML;
    if (data.userId == Id) {
        childHTML = `<div class="chat-message me"> <p class="user-name">${data.user.name}:</p> <p class="message-text">${data.message}</p></div>`; 
    } else {
        childHTML = `<div class="chat-message other"> <p class="user-name">${data.user.name}:</p> <p class="message-text">${data.message}</p></div>`; 

    }
    parentNode.innerHTML += childHTML;
   
}