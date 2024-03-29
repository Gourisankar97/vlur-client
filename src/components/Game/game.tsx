import { Grid, GridItem, Tooltip } from "@patternfly/react-core";
import './game.css'
import React from 'react';
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import io from 'socket.io-client';
import sound from '../../assets/images/sound.png';
import mute from '../../assets/images/mute.png'
import { serviceUrl, inProduction, clientUrl } from "../../env";
import { OutlinedLightbulbIcon, OutlinedQuestionCircleIcon, UserPlusIcon } from "@patternfly/react-icons";
import HashMap from 'hashmap';
import { ansSound, disconnectSound, joiningSound } from "./gmaeSound";


const socket = io(serviceUrl, {
    upgrade: false, transports: ['websocket']
});


const Game = () => {

    const [toggleBlur, setBlur] = useState(true);
    var [message, setMessage] = useState<string>();
    var [messageList, setMessageList] = useState([{message:'',from:''}]);
    var [skipped, setSkipped] = useState(false);

    const TIME = 60;

    const roomId =  useSelector((state:any)=>state.roomLink);
    const currentRound:{sup:number, sub:number} =  useSelector((state:any)=>state.round);
    const user = useSelector((state:any)=> state.user);
    const chats = useSelector((state: any)=> state.messageList);
    const players = useSelector((state:any) => state.players);
    const game = useSelector((state:any) => state.game);
    var skipTime = useSelector((state:any)=> state.skipTime);

    const [round, setRound] = useState('0');
    const [currentPic, setCurrentPic] = useState();
    const [ans, setAns] = useState('');
    const [playerCount, setPlayerCount] = useState(players.length);
    var [time, setTime] = useState(0);
    const [hint, setHint] = useState();
    const [gameFinished, setGameFinished] = useState(false);
    const [ansGiven, setAnsGiven] = useState(false);
    const [enableAudio, setEnableAudio] = useState(true);
    const [showRoundShutter, setRoundShutter] = useState(false);
    const [hideRoundShutter, setHideRoundShutter] = useState(true);
    const [shutterRound, setShutterRound] = useState(1);
    const [linkCopied, setLinkCopied] = useState(false);

    const [playersBackup, setPlayersBackup] = useState([]);
    const [totalPlayerAnswered, setTotalPlayerAnswered] = useState(0);
    const [isAdmin, setIsAdmin] = useState(false);
    var [skipRound, setSkipRound] = useState(false);


    const wait = (seconds: number) => new Promise(res=> setTimeout(res, seconds)); 
    const dispatcher = useDispatch();

    

    const generatedLink =   clientUrl+'/?'+roomId;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedLink);
        setLinkCopied(true);
    }
    

    document.title = "vlur.online";

    const HandleSubmit = (e: any) => {
        e.preventDefault();
        let text = e.target.msg.value;
        if(!text.trim()) return;
        
        text = text.trim();
        chat(text.toLowerCase());
        message = '';
        setMessage(message);
        var chatWindow = document.getElementById('chat-window'); 
        
        
        if(chatWindow) {
            var xH = chatWindow.scrollHeight; 
            chatWindow.scrollTo(0, xH+100);
        }
    }

    /*
     * ROOM JOINING STUFF
     */

    useEffect( ()=> {
        setIsAdmin((state)=>{
            return user.isAdmin;
        })
    }, []);

    useEffect(()=> {
        setIsAdmin((state)=>{
            return user.isAdmin;
        });
    },[user]);

    useEffect(()=> {

        messageList = chats;
        setMessageList(messageList);
        showPic();
      },[]);

      useEffect(()=>{
            if(chats && chats.length && chats[chats.length-1].message === ans)  ansSound(enableAudio);
            if(chats.length) setMessageList( prevState => prevState.concat(chats[chats.length-1]));
            
            
      }, [chats]);


      const processTotalAnswers = async () => {
        var pMap = new HashMap<string, number>();
        await playersBackup.map(  async (player: any)=>{
            pMap.set(player.playerId, player.score);
        });
        

        await players.map( async (player: any) => {

            if(player.isAdmin && player.playerId === user.playerId) {
                await dispatcher({type:'SET_USER', name: user.name, playerId: user.playerId, score: player.score, avatar:  user.avatar, isAdmin: true});
            }
            if(pMap.has(player.playerId)) {
                let oldScore = pMap.get(player.playerId);
                if(oldScore !== undefined && oldScore < player.score)
                {   
                    setTotalPlayerAnswered( (state)=> {
                        return 1+state;
                    });
                }
            }
        });



        await setTotalPlayerAnswered( (state)=> {
            if(state === players.length) {
                skipRound = true;
                setSkipRound(skipRound);
            }
            return state;
        });

        await setPlayersBackup(players);
      }


      useEffect( ()=> {


        if(players.length < playerCount) {
            setPlayerCount(players.length);
            disconnectSound(enableAudio);
        }
        else if(players.length > playerCount) {
            setPlayerCount(players.length);
            joiningSound(enableAudio);
        }
        
        processTotalAnswers();

      }, [players]);


    const chat = async (text: string) => {
        if(text === ans && !ansGiven) {
            setAnsGiven(true);
            let point = time*5;
            await socket.emit("update-score", {roomId:roomId, playerId: user.playerId, points: point});
        }
        if(!inProduction) console.log("ROOMID :" + roomId );
        
        if(user)
            await socket.emit("chat", {roomId:roomId, from: user.name, playerId:user.playerId, content: text});
    }

    const ANS_HIDDEN = () => {

        const chars = ans.split('');
        
        return (<> {chars.map((character: any)=>{return <span className={ character===' ' ?"" : "ans-hidden"}>{ character===' ' ?" " : "?"}</span>})}</>);
    }

    const ANS_SHOWN = () => {

        const chars = ans.split('');
        return (<> {chars.map((character: any)=>{return <span className={ character===' ' ?"" : "ans-hidden"}>{ character }</span>})} </> );
    }


    const syncRound = async (sup: number, sub: number) => {        
        await socket.emit("update-round", {roomId: roomId, currentRound: {sup: sup, sub: sub}});
    }

    const roundBanner = async () => {
        setRoundShutter(prevState => !prevState);
        setHideRoundShutter(prevState => !prevState);
        await wait(3000);
        setRoundShutter(prevState => !prevState);
        await wait(2700);
        setHideRoundShutter(prevState => !prevState);
    }

    const showPic = async () => {

        var currentRound_sub = currentRound.sub;

        try {

            let length = game.length;

            if(currentRound)
                for(let i = currentRound.sup; i<=length; i++) {
                    let r = game[i-1];
                    for(let j = currentRound_sub; j<= r.length; j++) {
                        setBlur(true);
                        setAnsGiven(false);
                        setIsAdmin(  (state )=> {
                            if(state) {
                                syncRound(i,j);
                            }
                            return user.isAdmin;
                        });

                        setRound(i+'.'+j);
                        setShutterRound(i);
                        setCurrentPic(r[j-1].link);
                        setTime(60);
                        setAns(r[j-1].name);
                        setHint(r[j-1].hint);
                        if(j === 1 && skipTime === 0) {
                            setShutterRound(i);
                            await roundBanner();
                        }
                        if(!skipped && skipTime > 0) {
                            for(let k = TIME-skipTime+1; k>=0; k--) {

                                let x = false;
                                setSkipRound((state)=>{
                                    x = state;
                                    return state;
                                });


                                if(x) {
                                    setTime(0);
                                    break;
                                }

                                setTime(k);
                                await wait(1000);
                            }
                            dispatcher({type:'SET_SKIP', skip: 0});
                            skipTime = 0;
                        }
                        else {
                            if(j !== 1) await wait(3000);

                            for(let k = TIME; k>=0; k--) {

                                let x = false;
                                setSkipRound((state)=>{
                                    x = state;
                                    return state;
                                });


                                if(x) {
                                    setTime(0);
                                    break;
                                }
                                setTime(k);
                                await wait(1000);
                            }
                        }


                        skipped = true;
                        setSkipped(skipped);
                        setSkipRound((state)=>{
                            return false;
                        });
                        setBlur(false);
                        await wait(5000);
                        setTotalPlayerAnswered(preState => preState-preState);
                        
                    }

                    

                    currentRound_sub = 1;
                }

            setGameFinished(true);
        }
        catch (e) {}
    }






    const toggleAudio = () =>{
        setEnableAudio(!enableAudio);
    }

    
    return( 
        <>
         <Grid>
                <GridItem span={4}>
                    <Grid>
                        <GridItem span={3}>
                            <img src={enableAudio ? sound : mute} className={'mute'} onClick={()=>toggleAudio()} alt={"sound"} ></img>
                        </GridItem>
                        <GridItem span={3}></GridItem>
                        <GridItem span={6}>
                            <div className="clock-circle">
                                <div className="space" >
                                    {time}
                                </div>
                            </div>
                        </GridItem>

                    </Grid>
                </GridItem>
                <GridItem span={4}></GridItem>
                <GridItem span={4}>
                    <Grid>
                        <GridItem span={10}>
                                <div className={"round-card"}>
                                    Round {round} / {game.length}
                                </div>
                        </GridItem>
                        <GridItem span={2} style={{textAlign:'left'}}>
                        <div style={{color:'white', marginLeft:'5px'}}>
                        <Tooltip
                        position="top"
                        content={
                            <div>1. Max 12 players in a room <br></br>
                                 2. Each round has 3 images <br></br>
                                 3. If any Image mismatch the <br></br> 
                                 other players, please  <br></br> re-enter the game.
                            </div>
                        }
                        >
                        <OutlinedQuestionCircleIcon />
                        </Tooltip>
                    </div>

                        </GridItem>
                    </Grid>
                    

                </GridItem>
            </Grid>
        <Grid>
            <GridItem span={4}>
                <div className="side-panel-left">
                    <div id="chat-window" className="chat-box">

                        {messageList.map((data:any, i:number)=>
                            <div id={data.message+"#"+i} className={i%2===0 ? 'msg-card blue' : 'msg-card white'}>
                                <b>{data.from}:</b> 
                                <span  id={data.message+"$"+i} className={data.message === ans ? 'right-ans' : ''}>
                                    {data.message === ans?'guessed it right':data.message}
                                </span>
                            </div>
                        )}
                    </div>
                    <div className="input-box">
                        <form onSubmit={HandleSubmit}> 
                            <input name="msg" value={message} onChange={(val)=>{setMessage(val.target.value)}} placeholder="type you guess here.." autoComplete="off" /> {/* value={message} onChange={(val)=>setMessage(val.target.value)} */} 
                        </form>  
                    </div>
                    <br></br>

                </div>
            </GridItem>

            <GridItem span={4}>
                   { !hideRoundShutter ? <div className={ showRoundShutter ? "each-round-show" : "each-round-hide"}>
                        Round &nbsp; {shutterRound}
                    </div> : ''}

                {gameFinished ? <div className={"play-again"}> <a className={'play-again-btn'} href={clientUrl} >Play again!</a>  </div> 
                : <div>
                
                <div className={"main-screen"} >
                    <img src={currentPic} onLoad={()=>{ if(!inProduction) console.log("IMAGE LOADED") }}   className={toggleBlur ? "image-blur" : "image-clear"} alt="logo"/>
                </div>

                <div className={"ans-div"}>
                      {toggleBlur ? ANS_HIDDEN() : ANS_SHOWN()}
                </div>

                <br></br>

                <div className={"hint-div"}>
                <OutlinedLightbulbIcon></OutlinedLightbulbIcon> Hint: { time > 40 ? 'will show after first 20 sec' : hint} 
                </div>
                </div>}
            
            </GridItem>
            
                <GridItem span={4}>
                    <div className="side-panel-right">
                    <Grid>
                        <GridItem span={12} > score board </GridItem>
                    </Grid>
                <Grid>
                    <GridItem span={12}>
                        {players.map((data: any, rank: number)=><div id={data.playerId+"#"}>

                                <div className={rank%2===0 ? "player-card-even" : "player-card-odd"}>
                                    <table className={"table"}>
                                        <tr>
                                            <td rowSpan={2}><img className={"avatar"} src={data.avatar} alt={"icon"}></img></td>
                                            <td className={'name'}>{data.name} {user.playerId === data.playerId ? '(You)':''}</td>
                                            <td rowSpan={2} className={'rank'}>#{rank+1} </td>

                                        </tr>
                                        <tr>
                                            <td className={"score"}>score: {data.score}</td>
                                        </tr>
                                    </table>
                                </div>
                                
                            </div> )}
                            <div>
                                { user.isAdmin ? <div className={"invite-btn"} 
                                    onClick={()=>{copyToClipboard()}}
                                >
                                    <UserPlusIcon></UserPlusIcon>
                                </div> : ''}
                               {linkCopied ?  <span style={{color:'green', fontSize:'1rem'}}>Link copied</span> : ''}
                            </div>
                    </GridItem>
                </Grid>
                </div>
            </GridItem>
        </Grid>
        </>
    )
}

export default Game;