import React, { useState, Component } from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Collapse } from "@mui/material";
import { Alert } from "@mui/material";

export default function CreateRoomPage(props) {
  const navigate = useNavigate();
  CreateRoomPage.defaultProps = {
    votesToSkip: 2,
    guestCanPause: true,
    update: false,
    roomCode: null,
  };

  const [defaultVotes, setdefaultVotes] = useState(2);
  const [successMsg, setsuccessMsg] = useState("");
  const [errorMsg, seterrorMsg] = useState("");
  const [guestCanPause, setguestCanPause] = useState(props.guestCanPause);
  const [votesToSkip, setgvotesToSkip] = useState(props.votesToSkip);

  const handleVotesChange = (event) => {
    setgvotesToSkip(event.target.value);
  };

  const handleGuestCanPauseChange = (event) => {
    if (event.target.value === "false") {
      setguestCanPause(false);
    } else {
      setguestCanPause(true);
    }
  };

  const renderCreateButtons = () => {
    return (
      <Grid container spacing={1}>
        <Grid
          item
          xs={12}
          align="center"
          style={{ marginTop: "", marginBottom: "-5%" }}
        >
          <Button
            color="secondary"
            variant="contained"
            onClick={handleRoomButtonPressed}
          >
            Create Room
          </Button>
        </Grid>
        <Grid item xs={12} align="center" style={{ marginTop: "-8%" }}>
          <Button color="primary" variant="contained" to="/" component={Link}>
            Back
          </Button>
        </Grid>
      </Grid>
    );
  };

  const renderUpdateButtons = () => {
    return (
      <Grid
        item
        xs={12}
        align="center"
        style={{ marginTop: "5%", marginBottom: "-5%" }}
      >
        <Button
          color="secondary"
          variant="contained"
          onClick={handleUpdateButtonPressed}
        >
          Update Room
        </Button>
      </Grid>
    );
  };

  const handleRoomButtonPressed = () => {
    const requestOptions = {
      method: "POST",
      withCredentials: "true",
      credentials: "include",
      crossorigin: true,

      headers: {
        Accept: "application/json",

        "Content-Type": "application/json",
        
      },
      body: JSON.stringify({
        votes_to_skip: votesToSkip,
        guest_can_pause: guestCanPause,
      }),
    };

    fetch("http://127.0.0.1:8000/api/create-room", requestOptions)
      .then((response) => response.json())
      .then((data) => navigate("/room/" + data.code));
  };

  const handleUpdateButtonPressed = () => {
    const requestOptions = {
      method: "PATCH",
      withCredentials: "true",
      credentials: "include",
      crossorigin: true,

      headers: {
        Accept: "application/json",

        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        votes_to_skip: votesToSkip,
        guest_can_pause: guestCanPause,
        code: props.roomCode,
      }),
    };

    fetch("http://127.0.0.1:8000/api/update-room", requestOptions).then(
      (response) => {
        if (response.ok) {
          setsuccessMsg("Room updated successfully");
        } else {
          seterrorMsg("Can't update room");
        }
      }
    );
  };
  
  return (
    <Grid container rowSpacing={0}>
      <Grid item xs={12} align="center">
        <Collapse in={errorMsg != "" || successMsg != ""}>
          {successMsg != "" ? (
            <Alert
              severity="success"
              onClose={() => {
                setsuccessMsg("");
              }}
            >
              {successMsg}
            </Alert>
          ) : (
            <Alert
              severity="error"
              onClose={() => {
                seterrorMsg("");
              }}
            >
              {errorMsg}
            </Alert>
          )}
        </Collapse>
      </Grid>
      <Grid item xs={12} align="center">
        <Typography
          component="h3"
          variant="h3"
          style={{  marginBottom: "0%" }}
        >
          {props.update ? "Update Room" : "Create a Room"}
        </Typography>
      </Grid>
      <Grid item xs={12} align="center" rowSpacing={0}>
        <FormControl component="fieldset">
          <FormHelperText>
            <div align="center">Guest Control of Playback State</div>
          </FormHelperText>
          <RadioGroup
            row
            defaultValue={guestCanPause}
            onChange={handleGuestCanPauseChange}
            style={{ marginTop: "15%" }}
          >
            <FormControlLabel
              value="true"
              control={<Radio color="primary" />}
              label="Play/Pause"
              labelPlacement="bottom"
            />

            <FormControlLabel
              value="false"
              control={<Radio color="secondary" />}
              label="No Control"
              labelPlacement="bottom"
            />
          </RadioGroup>
        </FormControl>
      </Grid>
      <Grid item xs={12} align="center" style={{ marginTop: "5%" }}>
        <FormControl>
          <TextField
            required={true}
            type="number"
            onChange={handleVotesChange}
            defaultValue={props.votesToSkip}
            inputProps={{
              min: 1,
              max: 10,
              style: { textAlign: "center" },
            }}
          />
          <FormHelperText>
            <div align="center">
              Votes Required to skip song {props.guestCanPause.toString()}
            </div>
          </FormHelperText>
        </FormControl>
      </Grid>
      {props.update ? renderUpdateButtons() : renderCreateButtons()}
    </Grid>
  );
}
