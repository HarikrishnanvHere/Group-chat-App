async function login(event){
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;

    const loginDetails = {
        email,
        password,
    }

    try {
     const res = await axios.post(`http://localhost:3000/user/login`, loginDetails);
     if(res.status === 200){
        alert('User logged in succcessfully');
        localStorage.setItem("token", res.data.token);
        //localStorage.setItem("userId", res.data.userId);
        (window.location.href="../dashboard/dashboard.html"); 
     }
     
    }
    catch(err){
        console.log(err);
        if(err.response.status === 400){

            alert('Password is incorrect, try again');
   
        }  
        else if(err.response.status === 404){
   
            alert('User not registered');
   
        }  
        else{
           alert('Failed to login, try again');
        }
    }
    
    event.target.email.value = '';
    event.target.password.value = '';
}