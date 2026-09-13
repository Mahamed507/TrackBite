import UserStyle from '../Style/UserStyle.css'
import {useNavigate} from 'react-router-dom'
import React, {useState } from 'react';


function User(){





 function noti () {

     alert("Please Email mahamedaden976@gmail.com for complaints!")
    }


const [username , setUsername] = useState('');
 const [password , setPassword] = useState('');

const nav = useNavigate();

const handleLogin = async (e) => {
       e.preventDefault()
        console.log("login clicked! ")

    try {
        const response = await fetch('http://127.0.0.1:5000/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username: username, password: password})
        });

        const data = await response.json();
        console.log("response from Flask:", data)

        if (data.message === 'login was successful!') {
            localStorage.setItem('username', username);
            nav('/log', {state: {username: username}});
        } else {
            alert('Invalid username or password');
        }

    } catch(error){
        console.log("error:", error)
    }
    }




    return(

        <div className={'sign-in'}>

   <h1> Welcome to TrackBite 🏋🏽🔥💪🏼🎧!</h1>




          <form className={'form-sign'}  onSubmit={(e) => e.preventDefault()} >

              <input
                  type={'text'}
                  placeholder={'Username'}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
              />

              <input
                  type={'password'}
                  placeholder={'Password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
              />


             <button
             className={'btn'} onClick={handleLogin}>Log in</button>




              <p>Not a Member yet? </p>

          <a href={'http://localhost:3000/profile#'}>


              <p
              title={'Start Today!'}> Sign up Now!</p>


          </a>

              <p onClick={noti}>Complaints ?</p>

          </form>



        </div>
    );
}

export default User;