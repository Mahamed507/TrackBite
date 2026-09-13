import Pro from '../Style/Pro.css'
import React, {useState , useEffect } from 'react';
import {useNavigate} from 'react-router-dom';

function Profile(){

   // use Mifflin - St.Jeor equation to find BMR


    // for males
    // BMR = (10 × kg) + (6.25 × cm) − (5 × age) + 5

    // for Females
   // BMR = (10 × kg) + (6.25 × cm) − (5 × age) − 161


    /*Since your inputs are in lbs and ft/inches, convert first:
    * kg  = lbs / 2.205
cm  = (feet × 12 + inches) × 2.54
*
* Step 2 — Multiply by Activity Multiplier (TDEE):
* Light (1–3x/week)× 1.375
* Moderate (4–5x/week) *1.55
* Active(daily/ intense 3-4x) *1.725
* very Active(intense 6-7x)  *1.9
*/


// use a Map for the activity multiplyer



 const activityMultiplier = {
  light : 1.375,
  moderate :  1.55,
  active : 1.725,
  veryActive : 1.9

 }



 const goalFunctions = {
        lose: loseWeight,
        maintain: maintainWeight,
        gain: gainWeight,
    };




// useState
const[gender , setGender] = useState("");
const[weight , setWeight] = useState("");
const[age , setAge] = useState();
const[inch , setInch] = useState();
const[feet , setFeet] = useState();
const[cal , setCal] = useState(0);

const[username , setUsername] = useState("");
const[password , setPassword] = useState();


const[activity , setActivity] = useState("");


const[goal , setGoal] = useState("");

useEffect(() => {
    // code to run

    if(goal){

        goalFunctions[goal]();



    }


    }, [goal , activity , weight , feet , inch , age , gender]);





//  this function is to calculate if you want to lose weight.

    function loseWeight(){
// first calculate using bmr
        let BMR;
// use age , gender , weight , height, and also figure out the avt level and goal.
        // first convert height into cm for calculation
        const cm = (Number(feet) * 12 + Number(inch)) * 2.54;

        // convert weight into KG
        const kg = Number(weight) / 2.205;


        // if the users pick Female then do this calculation
        if (gender === "Female"){
            // for Females
            // BMR = (10 × kg) + (6.25 × cm) − (5 × age) − 161
            BMR = (10 * kg) + (6.25 * cm) - (5 * Number(age)) - 161

        }
        else{

            // for males
            // BMR = (10 × kg) + (6.25 × cm) − (5 × age) + 5

            BMR = (10 * kg) + (6.25 * cm) - (5 * Number(age)) + 5;

        }

        // then multiply the TDEE activiy Multiplyer


      const tdee = BMR * activityMultiplier[activity];

        return setCal(Math.round(tdee - 500));







    }

    // this function is to maintain weight.

    function maintainWeight(){


        // first calculate using bmr
        let BMR;
// use age , gender , weight , height, and also figure out the avt level and goal.
        // first convert height into cm for calculation
        const cm = (Number(feet) * 12 + Number(inch)) * 2.54;

        // convert weight into KG
        const kg = Number(weight) / 2.205;


        // if the users pick Female then do this calculation
        if (gender === "Female"){
            // for Females
            // BMR = (10 × kg) + (6.25 × cm) − (5 × age) − 161
            BMR = (10 * kg) + (6.25 * cm) - (5 * Number(age)) - 161

        }
        else{

            // for males
            // BMR = (10 × kg) + (6.25 × cm) − (5 × age) + 5

            BMR = (10 * kg) + (6.25 * cm) - (5 * age) + 5;

        }

        // then multiply the TDEE activiy Multiplyer


        const tdee = BMR * activityMultiplier[activity];

        return setCal(Math.round(tdee));

    }

    // this function is to gain weight

    function gainWeight(){


        // first calculate using bmr
        let BMR;
// use age , gender , weight , height, and also figure out the avt level and goal.
        // first convert height into cm for calculation
        const cm = (Number(feet) * 12 + Number(inch)) * 2.54;

        // convert weight into KG
        const kg = Number(weight) / 2.205;


        // if the users pick Female then do this calculation
        if (gender === "Female"){
            // for Females
            // BMR = (10 × kg) + (6.25 × cm) − (5 × age) − 161
            BMR = (10 * kg) + (6.25 * cm) - (5 * Number(age)) - 161

        }
        else{

            // for males
            // BMR = (10 × kg) + (6.25 × cm) − (5 × age) + 5

            BMR = (10 * kg) + (6.25 * cm) - (5 * age) + 5;

        }

        // then multiply the TDEE activiy Multiplyer


        const tdee = BMR * activityMultiplier[activity];

        return setCal(Math.round(tdee + 500));


    }




const navigate = useNavigate();

    const handleBegin = async () => {

        console.log("sending:" , { username, age, weight, feet, inch, gender, activity, goal, cal})
// create the user account
        const response = await fetch('http://127.0.0.1:5000/signup', {
                method: 'POST',
                headers: {'Content-Type' : 'application/json'},
                body: JSON.stringify({ username: username, password: password })



            });


        // save their profile
        await fetch('http://127.0.0.1:5000/profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: username,
                age: age,
                weight: weight,
                height: `${feet}ft ${inch}in`,
                gender: gender,
                activity_lvl: activity,
                goal: goal,
                daily_cal: cal
            })
        });


        localStorage.setItem('username', username);


        navigate('/log', { state: { calories: cal } });


    };








    return(

        <div className={'profile'}>

            <form>

                <label><h1>Create username and password</h1></label>



                <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    type={'text'}
                    placeholder={'username'}/>

                <input
                    value={password}
                    onChange={(e) =>setPassword(e.target.value)}
                    type={'password'}
                    placeholder={'password'}/>
            </form>






            <h1>Create your Profile Account and Goal</h1>

    <div className={'info'}>
            <form>
                <label>Age</label>

                <input
                    value={age}
                    onChange={(e) =>setAge(e.target.value)}
                    type={'number'}
                />

                <label>Gender</label>
               <select value={gender} onChange={(e) => setGender(e.target.value)}>
                   <option>-</option>
                   <option value={"Male"}>Male</option>
                   <option value={"Female"}>Female</option>
               </select>

                <label>Weight(LBS)</label>
                <input

                    type={'number'}
                    step={"0.1"}
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                   />



                <label>Height:</label>

                <div style={{display: 'flex' , gap: '12px'}}>
                <input value={feet} onChange={(e)=> setFeet(e.target.value)} type="number" name={"feet"} min="0" max="8" placeholder="ft"/>
                <input value={inch} onChange={(e)=>setInch(e.target.value)} type="number" name="inches" min="0" max="11" placeholder="in"/>
                </div>


            </form>

    </div>

            <div className={'activity-status'}>

               <form> <h2>Activity Level? </h2>

                   <select value={activity} onChange={(e) => setActivity(e.target.value)}>
                       <option>-</option>
                       <option value={"light"}>Light: exercise 1-3 times/week </option>
                       <option value={"moderate"} >Moderate: exercise 4-5 times/week </option>
                       <option value={"active"}>Active: daily exercise or intense exercise 3-4 times/week </option>
                       <option value={"veryActive"}>Very Active: intense exercise 6-7 times/week </option>
                   </select>

               </form>


                <div className={'goal'}>

                   <label><h2> Goal</h2></label>

                    <select value={goal} onChange={(e) =>setGoal(e.target.value)}>
                        <option>-</option>
                        <option value={"gain"}>Gain Weight</option>
                        <option value={"maintain"}>Maintain Weight</option>
                        <option value={"lose"}>Lose Weight</option>
                    </select>
                </div>


                <div className={'calculation-goal'}>

                    <label><h1>Calculation</h1></label>
                    <h2 >{cal}</h2>
                    <h2>Calories</h2>




                    <button onClick={handleBegin}>Begin!</button>


                </div>



            </div>



        </div>
    );
}


export default Profile;



//*Note to self
//
//
// learn useEffect
// review and understand the code make sure to understand.*//