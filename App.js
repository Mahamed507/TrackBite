import Log from './Log.jsx'
import User from './User.jsx'
import Profile from './Profile.jsx'
import AiChat from './AiChat.jsx'
import {Routes, Route} from "react-router-dom"





function App() {
  return (
      <main className={'main-content'}>
          <Routes>
              <Route path={'/'} element={<User/>} />
              <Route path={'/profile'} element={<Profile/>} />
              <Route path={'/log'} element={<Log/>} />
              <Route path={'/AiChatBot'} element={<AiChat/>}/>
          </Routes>


      </main>
  );
}

export default App;
