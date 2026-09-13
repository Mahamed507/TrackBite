from flask import Flask, request, jsonify
import sqlite3
from flask_cors import CORS


app = Flask(__name__)
CORS(app)


# creates the database and called user table
def init_db():
    conn = sqlite3.connect('fitness.db' , timeout=10)
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )
    ''')

    c.execute ('''
    
     CREATE TABLE IF NOT EXISTS foodLog (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            food TEXT,
            calories INTEGER NOT NULL,
            mealType TEXT NOT NULL,
            user TEXT NOT NULL
    
    )
    
    ''')


    c.execute ('''
    
   create table if not exists profile (
   
   id integer primary key autoincrement ,
   username text not null,
   age integer not null ,
   weight real not null ,
   height text not null ,
   gender text not null ,
   activity_lvl text ,
   goal text ,
   daily_cal integer
   
   
   
   )
    
    
    
    ''')

    conn.commit()
    conn.close()


init_db() # runs when app starts.

# to test something for now
@app.route('/')
def home():
    return "update"



@app.route('/signup' , methods=['POST'])
def sign_ups():
    data = request.json # takes the data from 'frontend' json and comes to the backend
    # stroes the user and password
    username = data['username']
    password = data['password']

    conn = sqlite3.connect('fitness.db', timeout=10)
    c = conn.cursor()
    c.execute( ' INSERT INTO users (username , password) VALUES (? , ?)  ',
        (username , password))
    conn.commit()
    conn.close()

    return jsonify ( {'message' : 'user created!'})


@app.route('/login' , methods=['POST'])
def login():
    data = request.json
    getUsername = data['username']
    getPassword = data['password']

    conn = sqlite3.connect('fitness.db', timeout=10)
    c = conn.cursor()
    c.execute('SELECT * FROM users WHERE username = ? AND password = ?', (getUsername , getPassword))
    user = c.fetchone()
    conn.close()

    if user is None:
        return jsonify ({"message": "Invalid username OR password"}), 401
    else:
        return jsonify({"message": "login was successful!", "username": getUsername })


# when users reload it does not disappear you food log
# save meals to the database
@app.route('/meals' , methods=['POST'])

def save_meals():
    data = request.json
    food = data['food']
    calories = data['calories']
    meal_type = data['mealType']
    user = data['user']

    conn = sqlite3.connect('fitness.db', timeout=10)
    c = conn.cursor()
    c.execute('INSERT INTO foodLog (food, calories, mealType, user) VALUES (?, ?, ?, ?)',
              (food, calories, meal_type, user))
    conn.commit()
    conn.close()

    return jsonify({ "message": "Meal saved!" })




@app.route('/meals' , methods = ['GET'])
def get_meals():
    user = request.args.get('user')
    conn = sqlite3.connect('fitness.db' , timeout=10)
    c = conn.cursor()
    c.execute('SELECT * FROM foodLog WHERE user = ?', (user,))

    meals = c.fetchall()
    conn.close()

    if meals is None:
        return jsonify({"message": "Sorry empty information"})

    else:

        return jsonify({"meals": meals})




@app.route('/profile' , methods=['POST'])
def profile():
    data = request.json
    print("received data:", data)
    username = data['username']
    age = data['age']
    weight = data['weight']
    height = data['height']
    gender = data['gender']
    activtyLvl = data['activity_lvl']
    goal = data['goal']
    dailyCal = data['daily_cal']


    conn = sqlite3.connect('fitness.db', timeout=10)
    c = conn.cursor()
    c.execute(


        'insert into profile(username , age , weight , height , gender , activity_lvl , goal , daily_cal) values(? , ? , ? , ? , ?  , ?  , ? , ?)',
        (username, age, weight, height, gender, activtyLvl, goal, dailyCal)

    )





    conn.commit()
    conn.close()


    return jsonify({ 'message': 'Profile saved!' })









if __name__ == '__main__':
    app.run(debug=True)






