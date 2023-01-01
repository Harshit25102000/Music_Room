import React, { Component} from 'react';
import {useState,useEffect} from 'react';
import './App.css';
import CreateRoomPage from './Components/CreateRoomPage';
import HomePage from './Components/HomePage';
import RoomJoinPage from './Components/RoomJoinPage';
import Room from './Components/Room';
import { ReactDom } from "react-dom/client";
import {
  BrowserRouter,
  RouterProvider,
  Route,
  Routes,
  Link,
  Navigate,
} from "react-router-dom";








function App() {
  const [roomCode, setroomCode] = useState(null)




const func=()=>{
  fetch('http://127.0.0.1:8000/api/user-in-room',{method:'GET',credentials: 'include',})
            .then((response) => response.json())
            .then((data) => {
                setroomCode(data.code);
                console.log("app",roomCode)
            })
}
func();

  return (
    <>
  
    <BrowserRouter>
    
        <Routes>
        { roomCode!=null && 
         <Route path="/"element={<Navigate to={`/room/${roomCode}`} replace={true}/>}/>
      
       }
        <Route path="/"element={<HomePage/>}/>
        <Route path="/create-room"  element={<CreateRoomPage guestCanPause={true}/>}/>
        <Route path="/join" element={<RoomJoinPage/>}/>
        <Route path="/room/:roomCode"  element={<Room/>}/>
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
