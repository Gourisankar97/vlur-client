import { Grid, GridItem } from '@patternfly/react-core';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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

    const icon1  = 'https://i.ibb.co/SKj0Z4Z/kochikame.png';
    const icon2  = 'https://i.ibb.co/mGgp6sC/goku-orange.png';
    const icon3  = 'https://i.ibb.co/mS0Sskn/bignose.png';
    const icon4  = 'https://i.ibb.co/KwPbX0C/bunny.png';

    const icon5  = 'https://i.ibb.co/99B7rPV/cat.png';
    const icon6  = 'https://i.ibb.co/Sr1Jz5k/cherry.png';
    const icon7  = 'https://i.ibb.co/nL01hzP/doraemon.png';
    const icon8  = 'https://i.ibb.co/8g6Wtqf/goku-power.png';

    const icon9  = 'https://i.ibb.co/tHRRKNy/goku.png';
    const icon10 = 'https://i.ibb.co/SdSkxxR/mario.png';
    const icon11 = 'https://i.ibb.co/rZ60Wjk/mili.png';
    const icon12 = 'https://i.ibb.co/r5VLSVq/naruto.png';
    const icon13 = 'https://i.ibb.co/5hjCF18/nobita.png';
    const icon14 = 'https://i.ibb.co/NYStCDX/pikachu.png';

    const wait = () => new Promise(res=>setTimeout(res,1000));
    const currentUrl = window.location.href.split("/");
    const dispatcher = useDispatch();
    const roomInvalid = useSelector((state: any) => state.invalidRoom);


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

    var [invalidRoom, setInvalidRoom] = useState(false);

    
    



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
                                        setInvalidRoom(prevState => false);
    
                                        user = res.data;
                                        dispatcher({type:'SET_USER', name:res.data.name, playerId:res.data.playerId, score:res.data.score==null?0:user.score, avatar: res.data.avatar, isAdmin:res.data.isAdmin});
                                        setUser(user);
                                        // await wait();
                                        console.log("USERS : "+user);
                                        acknowledge();
                                        dispatcher(showRoom());
                                        
                                        })
                        .catch(async (e)=>
                        
                        {
                            
                            await setInvalidRoom((prevState) => {return true});
                            dispatcher({type:'PREFACE'});
                            dispatcher({type:'VALID', invalid:true});
                            console.log(e)
                        });
    
            }
            catch (e) {
                await setInvalidRoom((prevState) => {return true});
                dispatcher({type:'PREFACE'});
                dispatcher({type:'VALID', invalid:true});
                console.log(e)
            
            }
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
                                                <img src={icon1} className={"avatar-icons"} alt={"icon"}/>
                                            </div>
                            
                                            <div onClick={()=>setAvatar(icon2)}>
                                                <img src={icon2} className={"avatar-icons"} alt={"icon"}/>
                                            </div>
                                            <div onClick={()=>setAvatar(icon3)}>
                                                <img src={icon3} className={"avatar-icons"} alt={"icon"}/>
                                            </div>
                                            <div onClick={()=>setAvatar(icon4)}>
                                                <img src={icon4} className={"avatar-icons"} alt={"icon"}/>
                                            </div>

                                            <div onClick={()=>setAvatar(icon5)}>
                                                <img src={icon5} className={"avatar-icons"} alt={"icon"}/>
                                            </div>
                            
                                            <div onClick={()=>setAvatar(icon6)}>
                                                <img src={icon6} className={"avatar-icons"} alt={"icon"}/>
                                            </div>
                                            <div onClick={()=>setAvatar(icon7)}>
                                                <img src={icon7} className={"avatar-icons"} alt={"icon"}/>
                                            </div>
                                            <div onClick={()=>setAvatar(icon8)}>
                                                <img src={icon8} className={"avatar-icons"} alt={"icon"}/>
                                            </div>

                                            <div onClick={()=>setAvatar(icon9)}>
                                                <img src={icon9} className={"avatar-icons"} alt={"icon"}/>
                                            </div>
                            
                                            <div onClick={()=>setAvatar(icon10)}>
                                                <img src={icon10} className={"avatar-icons"} alt={"icon"}/>
                                            </div>
                                            <div onClick={()=>setAvatar(icon11)}>
                                                <img src={icon11} className={"avatar-icons"} alt={"icon"}/>
                                            </div>
                                            <div onClick={()=>setAvatar(icon12)}>
                                                <img src={icon12} className={"avatar-icons"} alt={"icon"}/>
                                            </div>
                                            <div onClick={()=>setAvatar(icon13)}>
                                                <img src={icon13} className={"avatar-icons"} alt={"icon"}/>
                                            </div>
                            
                                            <div onClick={()=>setAvatar(icon14)}>
                                                <img src={icon14} className={"avatar-icons"} alt={"icon"}/>
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
                                                
                                                setInvalidRoom((state) => {
                                                    if(!state) {
                                                        console.log("SETTING USERS");
                                                        
                                                        dispatcher({type:'SET_USER', name:playerName, playerId:user.playerId, score:user.score==null?0:user.score, avatar: avatar, isAdmin: user.isAdmin});
                                                        acknowledge();
                                                        dispatcher(showRoom());
                                                    }
                                                    return state;
                                                });
                                                // dispatcher(showRoom());

                                            }
                                            else {
                                                await joinRandom();
                                            }
                                            
                                            }}>{ ROOMID.charAt(0) === '?' ? "Enter room" : "Play"} </div>
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
                                            
                                            }}>Create Room</div>

                    </div>

                    {  roomInvalid ? <span style={{color:'rgba(255, 0,0)', fontWeight:'bold'}}>Invalid Room Id</span> : ''}
                </GridItem>
                <GridItem span={3}></GridItem>
            </Grid>
        </div>
    )
}

export default GameCard;