const token = localStorage.getItem('token');
const groupList = document.getElementById('group-list');

const logoutButton = document.getElementById('logout-btn');
logoutButton.addEventListener('click', logout);

function logout() {
    const confirmLogout = confirm('Are you sure you want to logout?');
    if (confirmLogout) {
      localStorage.clear(); 
      alert('User logged out successfully')
      window.location.href = '../login/login.html'; 
    }
  }



window.addEventListener('DOMContentLoaded', getGroups);

async function createGroup(event) {
    event.preventDefault();

    const group_name = event.target.grpname.value;

    const grpname = {
        group_name,
    }

    try {

        const res = await axios.post(`http://localhost:3000/group/creategroup`,
        grpname,
            {
                headers: { Authorization: token }
            });

        //console.log(res);
        await addToGroup(res.data.message.userId, res.data.message.id, true);
        event.target.grpname.value = '';
        getGroups();
    }

    catch (err) {
        console.log(err);
    }
}


async function addToGroup(userId, groupId, isAdmin) {
    

    const addUser = {
        userId,
        groupId,
        isAdmin,
    }

    try {

        const res = await axios.post(`http://localhost:3000/group/addUser`,
        addUser,
            {
                headers: { Authorization: token }
            });

         console.log(res);
    }

    catch (err) {
        console.log(err);
    }
}


async function getGroups(){
    try {
        const res = await axios.get(`http://localhost:3000/group/getgroups`,
        {
            headers: { Authorization: token }
        });
        //document.getElementById('user-id').innerHTML = Id;

        console.log(res);
        
            groupList.innerHTML = '';
            groupList.innerHTML =  '<h2>Groups<h2/>'
            for (let i = 0; i < res.data.message.length; i++) {
                // console.log("printed");
                const element = res.data.message[i];
                showGroupOnScreen(element);
            }
    } catch (err) {
        console.log(err);
    }
}


async function showGroupOnScreen(data) {

    const childHTML = `<div id="${data.groupId}"><button onclick="openGroupChat('${data.groupId}','${data.group.group_name}','${data.isAdmin}','${data.userId}')">${data.group.group_name}</button></div>`; 
    groupList.innerHTML += childHTML;
  
}

async function openGroupChat(groupId, group ,isAdmin, userId){
localStorage.setItem("groupId", groupId);
localStorage.setItem("group_name", group);
localStorage.setItem("isAdmin", isAdmin);
localStorage.setItem("userId", userId);
// localStorage.removeItem('messages');

(window.location.href="../chatapp/chatapp.html"); 
}
