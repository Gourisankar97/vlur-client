import { Grid, GridItem } from '@patternfly/react-core';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { loading, showGame, showRoom } from '../../../store/Action/actions';
import './game-card.css'
import { Names } from '../../../utils/random-names'
import { inProduction, serviceUrl } from '../../../env';
import axios from 'axios';

import io from 'socket.io-client';
const socket = io(serviceUrl, {
    upgrade: false, transports: ['websocket']
});
const GameCard =  () => {

    const icon1  = 'https://thumbs2.imgbox.com/cc/4d/RKBiekbw_t.png';
    const icon2  = 'https://thumbs2.imgbox.com/a5/1f/r86EVsfA_t.png';
    const icon3  = 'https://thumbs2.imgbox.com/b7/1f/K2qkuZ3u_t.png';
    const icon4  = 'https://thumbs2.imgbox.com/6c/38/s9wzaUsr_t.png';

    const icon5  = 'https://thumbs2.imgbox.com/26/1d/FWmNmHzy_t.png';
    const icon6  = 'https://thumbs2.imgbox.com/5b/dd/6uQID2Eb_t.png';
    const icon7  = 'https://thumbs2.imgbox.com/3e/7e/Q8GsOgQo_t.png';
    const icon8  = 'https://thumbs2.imgbox.com/d8/7b/JzTPSWmj_t.png';

    const icon9  = 'https://thumbs2.imgbox.com/88/82/0DMhNW38_t.png';
    const icon10 = 'https://thumbs2.imgbox.com/a2/ba/DHrl75qW_t.png';
    const icon11 = 'https://thumbs2.imgbox.com/a3/34/VDWTYA8g_t.png';
    const icon12 = 'https://thumbs2.imgbox.com/08/8d/OcSQyOJa_t.png';
    const icon13 = 'https://thumbs2.imgbox.com/78/92/wiEkIt39_t.png';
    const icon14 = 'https://thumbs2.imgbox.com/6b/9b/Dz7WWiDe_t.png';

    const wait = () => new Promise(res=>setTimeout(res,1000));
    const currentUrl = window.location.href.split("/");
    const dispatcher = useDispatch();


    const ROOMID = currentUrl[currentUrl.length-1];

    const checkIfRoomIsThere = async (roomId: string) => {

        dispatcher({type:'roomId', payload:roomId});
        await wait();
    }

    if(ROOMID.charAt(0) === '?') {
        checkIfRoomIsThere(ROOMID.substring(1));
    }

    const [avatar, setAvatar] = useState(icon1);

    var [playerName, setPlayerName] = useState('');
    var [roomId, setRoomId] = useState('');
    var [user, setUser] = useState({
        playerId: '',
        name: '',
        score: 0,
        avatar:'',
        isAdmin:false
    });

    var [players, setPlayers] = useState([{
        playerId: '',
        name: '',
        score: 0,
        avatar:'',
        isAdmin:false
    }]);

    
    const createRoom =  async () => {
        try {

            await axios.post(serviceUrl+'/room', { name: playerName, avatar: avatar})
                .then( async (res) => {  
                                roomId = res.data.roomId; 
                                setRoomId((state)=> {
                                    return roomId;
                                });
                                user = res.data.players[0]; 
                                setUser((state)=> {return user});
                                players = res.data.players;
                                setPlayers((state)=> {return players});

                                } )
                .catch((e)=>console.log(e));
        }
        catch (e) {}
    }
    const joinRoom = async () => {

        try {

            await axios.post(serviceUrl+'/room/'+ROOMID.substring(1), { name: playerName, avatar: avatar})
                    .then(async res => {

                                    user = res.data;
                                    dispatcher({type:'SET_USER', name:res.data.name, playerId:res.data.playerId, score:res.data.score==null?0:user.score, avatar: res.data.avatar, isAdmin:res.data.isAdmin});
                                    setUser(user);
                                    // await wait();
                                    })
                    .catch((e)=>console.log(e));

        }
        catch (e) {dispatcher({type:'PREFACE'});}
    }

    const joinRandom = async () => {

        try {

            await axios.post(serviceUrl+'/join-random', { name: playerName, avatar: avatar})
                    .then(async res => {
                        let data = res.data;
                        if(data.roomId) {
                            roomId = data.roomId; 
                            
                            setRoomId(roomId);
                            user = data.player;
                            dispatcher({type:'roomId', payload: roomId});
                            dispatcher({type:'SET_USER', name:data.player.name, playerId:data.player.playerId, score:0, avatar: data.player.avatar, isAdmin:data.player.isAdmin});
                            setUser(user);

                            await joinRandomEmit();
                        }
                        else {
                            dispatcher({type:'PREFACE'});
                        }
                    })
                    .catch(async (e)=> { 
                        console.log(e);
                        await dispatcher({type:'PREFACE'});
                        });
            }
            catch(e) {await dispatcher({type:'PREFACE'});}
    }



    const customSort = async (players: any) => {

        try {

            await players.sort((player1: any, player2: any)=>{
                if(player1.score > player2.score) {
                    return -1;
                }
                else if(player1.score < player2.score) {
                    return 1;
                }
                else {
                    return 0;
                }
            });
    
            return players;

        }
        catch(e) {
            return players;
        }

    }


    


    
        /*
        * web-socket stuff
        */
        useEffect(()=> {
            socket.on('connect', function () {
              console.log("CONNECTED");
            });
          
            socket.on("message", function(data) {
              if(!inProduction) console.log("MESSAGE FROM WEBSOCKET : "+data.msg );
            });

            socket.on("join-room", async function(data) {


                if(data.gameStarted) {
                    let players = await customSort(data.players);
                    dispatcher({type: 'SET_GAME', game: data.game});
                    dispatcher({type:'SET_PLAYERS', players: players});
                    dispatcher({type:'SET_SKIP', skip: data.skipTime});
                    dispatcher({type: "SET_ROUND", currentRound: data.currentRound});
                    dispatcher(showGame());
                }
                else {
                    if(data.players) {
                        dispatcher({type:'SET_PLAYERS', players: data.players});
                    }
                }
                
              });

              socket.on("start-game", function(data) {
                if(data && data.game) dispatcher({type: 'SET_GAME', game: data.game});
                if(data && data.start) dispatcher(showGame());
            });

            socket.on("room-chat", async function(data) {
                if(data) { 
                    dispatcher({type:'ADD_MESSAGE', from: data.from, message: data.message, playerId: data.playerId});
                }
            });

            socket.on("score", async function(data) {
                if(data.players) {
                    let players = await customSort(data.players);
                    dispatcher({type:'SET_PLAYERS', players: players});
                } 
            });

            socket.on("join-random", async function(data) {

                if(data) {
                    let players = await customSort(data.players);
                    dispatcher({type: 'SET_GAME', game: data.game});
                    dispatcher({type:'SET_PLAYERS', players: players});
                    dispatcher({type: "SET_ROUND", currentRound: data.currentRound});
                    dispatcher({type:'SET_SKIP', skip: data.skipTime});
                    dispatcher(showGame());
                }
                else {
                    dispatcher({type: 'PREFACE'});
                }
            });

            socket.on("someone-disconnected", async function(data) {

                if(data.players) {
                    let players = await customSort(data.players);
                    dispatcher({type:'SET_PLAYERS', players: players});
                }
            });
          },[]);


        const acknowledge = async ()=> {

            if(ROOMID.charAt(0) === '?') {
                socket.emit('join', {roomId: ROOMID.substring(1), playerId: user.playerId});
            }
            else {
                socket.emit('join', {roomId: roomId, playerId: user.playerId});
            }
        };

        const joinRandomEmit = async () => {
            if(roomId && user) await socket.emit('join-random', {roomId: roomId, playerId: user.playerId});
        }


    return(
        <div className="main-div">
            <Grid>
                <GridItem span={3}></GridItem>
                <GridItem span={6} >
                    <div className="card">
                        <input  className={ "name-input" } placeholder="Type you name" name="name" autoComplete="off" 
                            onChange={ (text)=>{setPlayerName(text.target.value)} }></input>
                        <div className={ "avatar-div" }>
                            <Grid>
                                <GridItem span={6}>
                                    <div className="avatar">
                                        <img  className="avatar" src={avatar} alt="ss" />
                                    </div>
                                </GridItem>
                                <GridItem span={6}>
                                    <div className="dropdown">
                                        <button className="dropbtn">
                                            Avatar
                                        </button>
                                        
                                        <div className="dropdown-content">
                                            <div onClick={()=>setAvatar(icon1)}>
                                                <img src={icon1} width="20" height="15" alt={"icon"}/>
                                            </div>
                            
                                            <div onClick={()=>setAvatar(icon2)}>
                                                <img src={icon2} width="20" height="15" alt={"icon"}/>
                                            </div>
                                            <div onClick={()=>setAvatar(icon3)}>
                                                <img src={icon3} width="20" height="15" alt={"icon"}/>
                                            </div>
                                            <div onClick={()=>setAvatar(icon4)}>
                                                <img src={icon4} width="20" height="15" alt={"icon"}/>
                                            </div>

                                            <div onClick={()=>setAvatar(icon5)}>
                                                <img src={icon5} width="20" height="15" alt={"icon"}/>
                                            </div>
                            
                                            <div onClick={()=>setAvatar(icon6)}>
                                                <img src={icon6} width="20" height="15" alt={"icon"}/>
                                            </div>
                                            <div onClick={()=>setAvatar(icon7)}>
                                                <img src={icon7} width="20" height="15" alt={"icon"}/>
                                            </div>
                                            <div onClick={()=>setAvatar(icon8)}>
                                                <img src={icon8} width="20" height="15" alt={"icon"}/>
                                            </div>

                                            <div onClick={()=>setAvatar(icon9)}>
                                                <img src={icon9} width="20" height="15" alt={"icon"}/>
                                            </div>
                            
                                            <div onClick={()=>setAvatar(icon10)}>
                                                <img src={icon10} width="20" height="15" alt={"icon"}/>
                                            </div>
                                            <div onClick={()=>setAvatar(icon11)}>
                                                <img src={icon11} width="20" height="15" alt={"icon"}/>
                                            </div>
                                            <div onClick={()=>setAvatar(icon12)}>
                                                <img src={icon12} width="20" height="15" alt={"icon"}/>
                                            </div>
                                            <div onClick={()=>setAvatar(icon13)}>
                                                <img src={icon13} width="20" height="15" alt={"icon"}/>
                                            </div>
                            
                                            <div onClick={()=>setAvatar(icon14)}>
                                                <img src={icon14} width="20" height="15" alt={"icon"}/>
                                            </div>

                                        </div>
                                    </div>
                                </GridItem>
                            </Grid>
                        </div>
                        <div className={ "btn-play" } onClick={ async ()=>{
                                            if(!playerName.trim()){
                                                playerName = Names[Math.floor(Math.random()*Names.length)];
                                                setPlayerName(playerName);
                                            }
                                            
                                            dispatcher(loading());
                                            // await wait();
                                            if(ROOMID.charAt(0) === '?') {

                                                await joinRoom();
                                                // await wait();                      
                                                dispatcher({type:'SET_USER', name:playerName, playerId:user.playerId, score:user.score==null?0:user.score, avatar: avatar, isAdmin: user.isAdmin});
                                                await acknowledge();
                                                dispatcher(showRoom());
                                            }
                                            else {
                                                await joinRandom();
                                            }
                                            
                                            }}>{ ROOMID.charAt(0) === '?' ? "Enter room" :"Play random"} </div>
                        <div className={ "btn-room" } onClick={ async ()=>{ 
                                            if(!playerName.trim()) {
                                                playerName = Names[Math.floor(Math.random()*Names.length)];
                                                setPlayerName(playerName);
                                            }
                                            dispatcher(loading());
                                            await createRoom();
                                            await wait();
                                            if(!inProduction) console.log("ROOMID : "+roomId);
                                            dispatcher({type:'roomId', payload:roomId});
                                            dispatcher({type:'SET_USER', name:user.name, playerId:user.playerId, score:user.score==null?0:user.score, avatar: avatar, isAdmin: user.isAdmin});
                                            
                                            await acknowledge();

                                            dispatcher(showRoom());
                                            
                                            }}>Create room</div>

                    </div>
                </GridItem>
                <GridItem span={3}></GridItem>
            </Grid>
        </div>
    )
}

export default GameCard;