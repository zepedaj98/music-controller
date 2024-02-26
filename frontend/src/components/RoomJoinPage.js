import React, { Component , useState } from "react";
import { TextField, Button, Grid, Typography } from "@material-ui/core";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function RoomJoinPage(){

    const navigate = useNavigate();
    const [roomCode, setRoomCode] = useState("");
    const [error, setError] = useState("");

    const handleTextFieldChange = (e) => {
        setRoomCode(e.target.value)
    }

    const roomButtonPressed = () => {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                code: roomCode
            })
        };
    fetch('/api/join-room', requestOptions)
        .then((response)=>{
            if (response.ok){
                navigate(`/room/${roomCode}`);
            } else {
                setError("Room not found.")
            }
        })
        .catch((error) => {
            console.log(error);
        });
    };


/* class based component 
export default class RoomJoinPage extends Component {
    constructor(props){
        super(props);
        this.state = {
            roomCode: "", 
            error: false,
        };
    this.handleTextFieldChange = this.handleTextFieldChange.bind(this);
    this.roomButtonPressed = this.roomButtonPressed.bind(this);
    }
*/
    return (
        <Grid container spacing={1}>
            <Grid item xs={12} align="center">
                <Typography variant="h4" component="h4">
                    Join a Room
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <TextField
                    error={!!error}
                    label="Code"
                    placeholder="Enter a Room Code"
                    value={roomCode}
                    helperText={error}
                    variant="outlined"
                    onChange={handleTextFieldChange}
                />
            </Grid>
            <Grid item xs={12} align="center">
                <Button variant="contained" color="primary" onClick={roomButtonPressed}>
                    Enter Room
                </Button>
            </Grid>
            <Grid item xs={12} align="center">
                <Button variant="contained" color="secondary" to="/" component={Link}>
                    Back
                </Button>
            </Grid>
        </Grid>
    );
    }
    
/*
    handleTextFieldChange(e){
        this.setState({
            roomCode: e.target.value,
        });
    }
    roomButtonPressed(){
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                code: this.state.roomCode
            })
        };
        fetch('/api/join-room', requestOptions).then((response)=>{
            if (response.ok){
                this.props.history.push(`/room/${this.state.roomCode}`)
            } else {
                this.setState({error: "Room not found."})
            }
        }).catch((error) => {
            console.log(error);
        });
    }
}*/