import React, { useState } from "react";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import { Link } from "react-router-dom";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { useNavigate } from "react-router-dom";
import { Collapse } from "@material-ui/core";
import Alert from "@material-ui/lab";

const defaultProps= {
    votesToSkip: 2,
    guestCanPause: true,
    update: false,
    roomCode: null,
    updateCallback: () => {},
}

export default function CreateRoomPage(props) {


    const navigate = useNavigate();

    const [guestCanPause, setGuestCanPause] = useState(defaultProps.guestCanPause);
    const [votesToSkip, setVotesToSkip] = useState(defaultProps.votesToSkip);
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMg] = useState("");
    
    const handleVotesChange = (e) => {
        setVotesToSkip(e.target.value);
    }

    const handleGuestCanPauseChange = (e) => {
        setGuestCanPause(e.target.value === "true" ? true : false);
    }

    const handleRoomButtonPressed = () => {
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                votes_to_skip: votesToSkip,
                guest_can_pause: guestCanPause
            }),
        };
        fetch('api/create-room', requestOptions)
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                navigate('/room/' + data.code);
            })
            .catch((error) => {
                console.error('error creating room', error);
            });

    };
    const handleUpdateButtonPressed = () => {
        const requestOptions = {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                votes_to_skip: votesToSkip,
                guest_can_pause: guestCanPause, 
                code: props.roomCode, 
            }), 
        };
        fetch('/api/update-room', requestOptions)
            .then((response) => {
                if (response.ok){
                    setSuccessMg(
                        "Room updated successfully"
                    );
                } else {
                    setErrorMsg(
                    "Error updating room "
                );
            }
            props.updateCallback();
        })

    }

    const renderCreateButtons = () => { 
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <Button color="primary" variant="contained" onClick={handleRoomButtonPressed}>
                        Create a Room
                    </Button>
                </Grid>
                <Grid item xs={12} align="center">
                    <Button color="secondary" variant="contained" to="/" component={Link}>
                        Back
                    </Button>
                </Grid>
             </Grid>
        )}
    
    
    const renderUpdateButtons = () => {
        return (
        <Grid item xs={12} align="center">
                    <Button color="primary" variant="contained" onClick={handleUpdateButtonPressed}>
                        Update Room
                    </Button>
                </Grid>
    )}

        const title = props.update ? "Update Room" : "Create a Room"

        return (

        <Grid container spacing={1}>
            <Grid item xs={12} align="center">
                <Collapse in={errorMsg !== "" || successMsg !== ""}>
                    {successMsg ? <Typography>{successMsg}</Typography> : null}
                </Collapse>
            </Grid>
            <Grid item xs={12} align="center">
                <Typography component="h4" variant="h4">
                    {title}
                </Typography>
            </Grid>
             <Grid item xs={12} align="center">
                <FormControl component="fieldset">
                    
                        <Typography align='center' variant="body1">
                            Guest Control of Playback State
                        </Typography>
                    
                    <RadioGroup row defaultValue={guestCanPause.toString()} onChange={handleGuestCanPauseChange}>
                        <FormControlLabel 
                            value="true" 
                            control={<Radio color="primary"/>}
                            label="Play/Pause"
                            labelPlacement="bottom"
                        />
                        <FormControlLabel 
                            value="false" 
                            control={<Radio color="secondary"/>}
                            label="No Control"
                            labelPlacement="bottom"
                        />
                    </RadioGroup>
                </FormControl>
                
             </Grid>
             <Grid item xs={12} align="center">
                <FormControl>
                    <TextField 
                        required={true} 
                        type="number" 
                        onChange={handleVotesChange}
                        defaultValue={votesToSkip}
                        inputProps={{
                            min:1,
                            style: { textAlign: "center" },
                        }}
                    />
                    
                        <Typography align="center" variant="body1">
                            Votes Required to Skip Song
                        </Typography>
                    
                </FormControl>
             </Grid>
             {props.update
                 ? renderUpdateButtons()
                 : renderCreateButtons()}
        </Grid>
        );
    }
