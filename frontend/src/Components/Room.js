import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Grid, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CreateRoomPage from "./CreateRoomPage";
import MusicPlayer from "./MusicPlayer";

export default function Room(props) {
  let navigate = useNavigate();
  const [showSettings, setshowSettings] = useState(false);
  const [votesToSkip, setVotesToSkip] = useState(2);
  const [guestCanPause, setGuestCanPause] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [spotifyAuthenticated, setspotifyAuthenticated] = useState(false);
  const[song,setSong]=useState([]);
  const { roomCode } = useParams();

  const authenticateSpotify = () => {
    fetch("http://127.0.0.1:8000/spotify/is-authenticated", {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("status", data.status);
        setspotifyAuthenticated(data.status);
        if (!data.status) {
          fetch("http://127.0.0.1:8000/spotify/get-auth-url", {
            credentials: "include",
          })
            .then((response) => response.json())
            .then((data) => {
              window.location.replace(data.url);
            });
        }
      });
  };

  const getRoomDetails = () => {
    fetch("http://127.0.0.1:8000/api/get-room" + "?code=" + roomCode, {
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          //props.leaveRoomCallback();
          navigate("/");
        }
        return response.json();
      })
      .then((data) => {
        setVotesToSkip(data.votes_to_skip);
        setGuestCanPause(data.guest_can_pause);
        setIsHost(data.is_host);
      });
    if (isHost) {
      authenticateSpotify();
    }
  };
  getRoomDetails();
  const getCurrentSong=()=>{
    fetch('http://127.0.0.1:8000/spotify/current-song',{credentials:'include'}).then((response)=>{
      if (!response.ok){
        return {};
      }else{
        return response.json();
      }
    }).then((data)=>{setSong(data);
      console.log(song);
    });
   
  }
  useEffect(() => {
    
    const interval = setInterval(getCurrentSong,1000);

    return ()=>{
      clearInterval(interval);
    }
  });

  const leaveButtonPressed = () => {
    const requestOptions = {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    };
    fetch("http://127.0.0.1:8000/api/leave-room", requestOptions).then(
      (_response) => {
        //props.leaveRoomCallback();
        navigate("/");
      }
    );
  };

  const updateShowSettings = (value) => {
    setshowSettings(value);
  };

  const renderSettings = () => {
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <CreateRoomPage
            update={true}
            votesToSkip={votesToSkip}
            guestCanPause={guestCanPause}
            roomCode={roomCode}
          />
        </Grid>
        <Grid item xs={12} align="center">
          <Button
            variant="contained"
            color="secondary"
            onClick={() => updateShowSettings(false)}
          >
            Close
          </Button>
        </Grid>
      </Grid>
    );
  };

  const renderSettingsButton = () => {
    return (
      <Grid item xs={12} align="center">
        <Button
          variant="contained"
          color="primary"
          onClick={() => updateShowSettings(true)}
        >
          Settings
        </Button>
      </Grid>
    );
  };

  if (showSettings) {
    return renderSettings();
  } else {
    console.log(spotifyAuthenticated);
    
    return (
      <>
        <Grid container spacing={1}>
          <Grid item xs={12} align="center">
            <Typography variant="h4" component="h4">
              Code: {roomCode}
            </Typography>
          </Grid>
         <MusicPlayer {...song}/>

          {isHost ? renderSettingsButton() : null}

          <Grid item xs={12} align="center">
            <Button
              variant="contained"
              color="secondary"
              onClick={leaveButtonPressed}
            >
              Leave Room
            </Button>
          </Grid>
        </Grid>
      </>
    );
  }
}
