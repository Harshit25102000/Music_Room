import React, { Component } from 'react'
import CreateRoomPage from './CreateRoomPage';
import RoomJoinPage from './RoomJoinPage';
import { ReactDom } from "react-dom/client";
import {
  BrowserRouter,
  RouterProvider,
  Route,
  Routes,
  Link,
  redirect,
  Navigate,
} from "react-router-dom";
import { Grid, Button, ButtonGroup,Typography} from "@mui/material";

export default class HomePage extends Component {
    constructor(props){
        super(props);
        this.State={
            roomCode:null,
        }
    }

 //async componentDidMount(){
 //   fetch('http://127.0.0.1:8000/api/user-in-room',{method:'GET',credentials: 'include',}).then((response)=>response.json()).then((data)=>{
 //       this.setState({
 //           roomCode:data.code
 //       })
 //      
 //      
 //   });
    
//}


    render(){
   
        return  <>
        
            <Grid container spacing={3}>
                <Grid item xs={12} align="center">
                    <Typography variant ="h3" compact="h3"> 
                        Music Room
                    </Typography> 
                </Grid>
                <Grid item xs={12} align="center"> 
                    <ButtonGroup disableElevation variant="contained" color="primary"> 
                        <Button color="secondary" to='/join' component={Link}> 
                        Join a Room 
                        </Button>
                        <Button color="primary" to='/create-room' component={Link}> 
                        {`Create a room${this.State}`}
                        </Button>
                    </ButtonGroup>
                </Grid>
            </Grid>
        </>
       
    
}
}