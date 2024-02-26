import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Grid, Button, Typography, NativeSelect } from '@material-ui/core'; 
import { useNavigate } from 'react-router-dom';
import CreateRoomPage from './CreateRoomPage'; 
import MusicPlayer from './MusicPlayer';

export default function Room(props){
    const navigate = useNavigate();
    const [roomState, setRoomState] = useState({
        votesToSkip: 2,
        guestCanPause: false,
        isHost: false,
        showSettings: false,
        spotifyAuthenticated: false, 
        song: {}
    });
    const { roomCode } = useParams();

    useEffect(() => {
        getRoomDetails();

        //start polling for current song 
        const interval = setInterval(getCurrentSong, 1000);

        //cleanup function
        return () => clearInterval(interval)
        
    }, [roomCode]);


    const getRoomDetails = () => {
        fetch("/api/get-room" + "?code=" + roomCode)
            .then((response) => {
                if(!response.ok){
                    props.leaveRoomCallback();
                    navigate("/");
                }
                return response.json();
            })
            .then((data) => {
                console.log("room state after setting:", roomState);

                setRoomState({
                    votesToSkip: data.votes_to_skip,
                    guestCanPause: data.guest_can_pause,
                    isHost: data.is_host,
                });
                if (data.is_host){
                    console.log("user is the host. initiating spotify authentication");

                    authenticateSpotify();
                    }
                else {
                    console.error("user is not the host. skipping authentication");
                }
                
        })
        .catch((error) => {
            console.error('Error getting room details', error);
        });
    }

    const authenticateSpotify = () => {
        console.log("authenticating with spotify");

        fetch("/spotify/is-authenticated")
            .then((response) => response.json())
            .then((data) => {
                console.log("spotify authentication status:", data);

                setRoomState((prevState) => ({
                    ...prevState,
                    spotifyAuthenticated: data.status
                }));
                if (!data.status) {
                    console.log("user is not authenticated with spotify. redirecting.");
                    fetch("/spotify/get-auth-url")
                        .then((response) => response.json())
                        .then((data) => {
                            console.log("Redirect URL received", data.url);
                            window.location.replace(data.url);
                    });
                } else {console.log("user is already authenticated with spotify");}
            })
            .catch((error) => {
                console.error('error authenticating with spotify', error);
            });
        }

    const leaveButtonPressed = () => {
        const requestOptions = {
            method: "POST",
            headers: {"Content-Type": "application/json"},
        };
        fetch("/api/leave-room", requestOptions).then((_response) => {
            props.leaveRoomCallback();
            navigate('/');
        });
    
    }
    const getCurrentSong = () =>{
        fetch('/spotify/current-song')
        .then((response) => {
            if (!response.ok) {
                return {};
            } else {
                return response.json();
            }
    })
    .then((data) => {
        setRoomState((prevState) => ({
            ...prevState,
            song:data
        }));
        console.log(data);
        });    
    }

    const updateShowSettings = (value) => {
        setRoomState({
            ...roomState, //spread operator to keep other values the same and only change settings
            showSettings: value,
        });
    }

    const renderSettingsButton = () => {
        return (
            <Grid item xs={12} align="center">
                <Button variant="contained" color='primary' onClick={() => updateShowSettings(true)}>
                    Settings
                </Button>
            </Grid>
        );
    }

    const renderSettings = () => {
        return (
        <Grid container spacing={1}>
            <Grid item xs={12} align="center">
                <CreateRoomPage 
                    update={true} 
                    votesToSkip={roomState.votesToSkip} 
                    guestCanPause={roomState.guestCanPause} 
                    roomCode={roomCode} 
                    updateCallback={getRoomDetails}
                />
            </Grid>
            <Grid item xs={12} align="center">
                <Button 
                    variant='contained' 
                    color='secondary' 
                    onClick={() => updateShowSettings(false)}>
                    Close
                </Button>
            </Grid>
        </Grid>
    )}


    return (
        <>
        {roomState.showSettings ? renderSettings() : (
    
        <Grid container spacing={1}>
            <Grid item xs={12} align="center">
                <Typography variant='h4' component='h4'>
                    Code: {roomCode}
                </Typography>
            </Grid>
            <MusicPlayer {...roomState.song}/>
            {roomState.isHost ? renderSettingsButton() : null}
            <Grid item xs={12} align="center">
                <Button variant='contained' color='secondary' onClick={leaveButtonPressed}>
                    Leave Room
                </Button>
            </Grid>
        </Grid>
    )}
    </>
    );
}

