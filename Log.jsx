import ham from '../Assets/threelines.webp'
import Logs from '../Style/Logs.css'
import React, {useState , useEffect } from 'react'
import {useLocation , useNavigate} from 'react-router-dom'
import {searchFood} from '../services/api.js';







import profile from './Profile.jsx'


function Log() {
   console.log("log page loaded!")

    const [breakfastQuery, setBreakfastQuery] = useState("");
    const [breakfastResults, setBreakfastResults] = useState([]);
    const [lunchResults , setLunchResults] = useState([]);
    const [dinnerResults , setDinnerResults] = useState([]);
    const[lunchQuery , setLunchQuery] = useState("");
    const[dinnerQuery , setDinnerQuery] = useState("");


    useEffect(() => {
        if (breakfastQuery === "") {
            setBreakfastResults([]); // clear results if input is empty
            return;
        }

        const search = async () => {
            const data = await searchFood(breakfastQuery);
            console.log("API results" , data)
            setBreakfastResults(data);
        };

        search();
    }, [breakfastQuery]); // runs every time breakfastQuery changes




    useEffect(() => {
        if (lunchQuery === "") { setLunchResults([]); return; }
        const search = async () => {
            const data = await searchFood(lunchQuery);
            setLunchResults(data);
        };
        search();
    }, [lunchQuery]);




    useEffect(() => {
        if (dinnerQuery === "") { setDinnerResults([]); return; }
        const search = async () => {
            const data = await searchFood(dinnerQuery);
            setDinnerResults(data);
        };
        search();
    }, [dinnerQuery]);




// use hook called "useNavigate" to go to a different page which is "log out"
    const n = useNavigate();









    const handleLogout = () =>{
        localStorage.removeItem('username')
       return n('/');
    }

    const handleAi = () =>{
        return n('/AiChatBot');
    }




    // logs
    const[breakfast , setBreakfast] = useState([]);
    const[lunch , setLunch] = useState([]);
    const[dinner , setDinner] = useState([]);



    function breakfastLog(){

  setBreakfast(prev => [... prev, ""]);


    }

    function lunchLog(){
        setLunch(prev => ([...prev , ""]))
    }

    function dinnerLog(){

        setDinner(prev => ([...prev , ""]))


    }


    const { state } = useLocation();
    const username = state?.username ?? localStorage.getItem('username') ?? '';
   const dailyCalories = state?.calories ?? 0;



// update the calories from 0 to something else when the user log in the food they 'ate'.
const[breakfastCal , setBreakfastCal] = useState(0);

const[lunchCal , setLunchCal] = useState(0);

const[dinnerCal , setDinnerCal] = useState(0);

// get the total calories from breakfast , lunch and dinner.

    const total = breakfastCal + lunchCal + dinnerCal



    useEffect(() => {

        const user = localStorage.getItem('username');
        console.log("fetching meals for:", user);

        if (!user) return;

        fetch(`http://127.0.0.1:5000/meals?user=${user}`)
            .then(res => res.json())
            .then(data => {

                console.log("meals from db:", data);

                    // separate meals by type
                if (data.meals) {
                    console.log("first meal:", data.meals[0])
                    const b = data.meals.filter(m => m[3] === 'breakfast');
                    console.log("breakfast meals:", b)
                    const l = data.meals.filter(m => m[3] === 'lunch');
                    const d = data.meals.filter(m => m[3] === 'dinner');
                    setBreakfast(b.map(m => ({name: m[1], calories: m[2]})));
                    setLunch(l.map(m => ({name: m[1], calories: m[2]})));
                    setDinner(d.map(m => ({name: m[1], calories: m[2]})));


                    setBreakfastCal(b.reduce((sum, m) => sum + m[2], 0));
                    setLunchCal(l.reduce((sum, m) => sum + m[2], 0));
                    setDinnerCal(d.reduce((sum, m) => sum + m[2], 0));
                }
            });
    }, []);


    return(

        <div className={'log'}>


            <header className={'Headers-ls'}>

                <nav>

                <img
                    src={ham}
                    height={'50'}
                    width={'80'}/>

                    <li>




                        <ul onClick={handleLogout}>Log out</ul>


                        <ul onClick={handleAi}>Chat Bot</ul>
                    </li>
                </nav>

                TrackBite 🔋⚡


            </header>

            <div className={'cal-tracker'}>

                <label>  Calories Consumed / Goal to Reach ⭐</label>

                <label> <h2> {total} / {dailyCalories} </h2></label>


            </div>


            <div className={'traker'}>

<label> <h2>Log</h2></label>
           <form>
               <label>Breakfast</label>
               <label> {breakfastCal} Cal</label>



               <input
                   className={'breakfast-input'}
                   placeholder={'eggs..ect'}
                   type={'text'}
                   value={breakfastQuery}
                   onChange={(e) => setBreakfastQuery(e.target.value)}

               />

               {breakfastResults.map((food, i) => {
                   const calories = food.foodNutrients.find(n => n.nutrientName === "Energy")?.value;
                   return (
                       <div key={i}
                            onClick={() => {


                                setBreakfast(prev => [...prev, { name: food.description, calories: calories }]);  // add to log
                                setBreakfastQuery("");   // clear search
                                setBreakfastResults([]);
                                setBreakfastCal(prev => prev + calories);


                                // ← add fetch call here to save to database
                                fetch('http://127.0.0.1:5000/meals', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                        food: food.description,
                                        calories: calories,
                                        mealType: 'breakfast',
                                        user: username  // ← you need the logged in username here
                                    })
                                });




                            }}

                            style={{ cursor: 'pointer' }}

                         >
                           <p>{food.description} — {calories} cal</p>
                       </div>
                   );



               })}

               <button type={'button'} onClick={breakfastLog} className={'add-food'}>+ Add Food</button>

               {breakfast.length > 0 && (
                   <div>
                       <p style={{ fontWeight: 'bold', marginTop: '10px' }}>Logged:</p>
                       {breakfast.map((item, index) => (
                           <p key={index}>{item.name} </p>
                       ))}
                   </div>
               )}







           </form>


            <form> <label>Lunch</label>
                <label> {lunchCal} Cal </label>

                <input
                    className={'lunch-input'}
                    placeholder={'Pasta..ect'}
                    type={'text'}
                    value={lunchQuery}
                    onChange={(e) => setLunchQuery(e.target.value)}/>


                {lunchResults.map((food, i) => {
                    const calories = food.foodNutrients.find(n => n.nutrientName === "Energy")?.value;
                    return (
                        <div key={i}
                             onClick={() => {
                                 setLunch(prev => [...prev, { name: food.description, calories: calories }]);  // ✅ object
                                 setLunchQuery("");
                                 setLunchResults([]);
                                 setLunchCal(prev => prev + calories)


                                 fetch('http://127.0.0.1:5000/meals', {
                                     method: 'POST',
                                     headers: { 'Content-Type': 'application/json' },
                                     body: JSON.stringify({
                                         food: food.description,
                                         calories: calories,
                                         mealType: 'lunch',
                                         user: username  // ← you need the logged in username here
                                     })
                                 });

                             }}
                             style={{ cursor: 'pointer' }}
                        >
                            <p>{food.description} — {calories} cal</p>
                        </div>

                    );
                })}

                <button type={'button'} onClick={lunchLog} className={'add-food'}>+ Add Food</button>


                {lunch.length > 0 && (
                    <div>
                        <p style={{ fontWeight: 'bold', marginTop: '10px' }}>Logged:</p>
                        {lunch.map((item, index) => (
                            <p key={index}>{item.name}</p>
                        ))}
                    </div>
                )}


            </form>

           <form><label>Dinner</label>
               <label> {dinnerCal} Cal</label>


               <input
                   className={'dinner-input'}
                   placeholder={'burger..ect'}
                   type={'text'}
                    value={dinnerQuery}
                    onChange={(e) => setDinnerQuery(e.target.value)}/>

               {dinnerResults.map((food , i) => {

                   const calories = food.foodNutrients.find(n => n.nutrientName === "Energy")?.value

                   return (
                       <div key={i}
                            onClick={() => {
                                setDinner(prev => [...prev, { name: food.description, calories: calories }]);  // ✅ object
                                setDinnerQuery("");
                                setDinnerResults([]);
                                setDinnerCal(prev => prev + calories)


                                fetch('http://127.0.0.1:5000/meals', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                        food: food.description,
                                        calories: calories,
                                        mealType: 'dinner',
                                        user: username  // ← you need the logged in username here
                                    })
                                });
                            }}
                            style={{ cursor: 'pointer' }}
                       >
                           <p>{food.description} — {calories} cal</p>
                       </div>

                   );


               })}


               <button type={'button'} onClick={dinnerLog} className={'add-food'}>+ Add Food</button>

               {dinner.length > 0 && (
                   <div>
                       <p style={{ fontWeight: 'bold', marginTop: '10px' }}>Logged:</p>
                       {dinner.map((item, index) => (
                           <p key={index}>{item.name}</p>
                       ))}
                   </div>
               )}



           </form>



            </div>



        </div>


    )
}

export default Log;

// 