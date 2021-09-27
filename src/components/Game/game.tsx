import { Grid, GridItem } from "@patternfly/react-core";
import './game.css'
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import io from 'socket.io-client';
import first from '../../assets/images/first.png';
import second from '../../assets/images/second.png';
import third from '../../assets/images/third.png';
import sound from '../../assets/images/sound.png';
import mute from '../../assets/images/mute.png'
import { serviceUrl } from "../../env";
import { UserPlusIcon } from "@patternfly/react-icons";
import HashMap from 'hashmap';


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
    var [skipRound, setSkipRound] = useState(false);


    const wait = (seconds: number) => new Promise(res=> setTimeout(res, seconds)); 
    const dispatcher = useDispatch();

    const ansAudio = new Audio(`sounds/correct.mp3`);
    const joinAudio = new Audio(`sounds/join.mp3`);
    const disconnectAudio = new Audio(`sounds/right_answer.mp3`);

    const generatedLink =   'http://localhost:3000/?'+roomId;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedLink);
        setLinkCopied(true);
    }
    

    const HandleSubmit = (e: any) => {
        e.preventDefault();
        console.log("&&&&&&&&___+++++++++=======>  : "+e.target.msg.value);
        let text = e.target.msg.value;
        if(!text.trim()) return;
        
        
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

    useEffect(()=> {

        messageList = chats;
        setMessageList(messageList);

        socket.on('connect', function () {
          console.log("CONNECTED");
          socket.emit('join', {roomId: roomId });
        });
      
        socket.on("message", function(data) {
          console.log("MESSAGE FROM WEBSOCKET : "+data.msg );
        });

        socket.on("join-room", function(data) {


            if(data && data.players) {
                dispatcher({type:'SET_PLAYERS', players: data.players});
            }
            
          });

        socket.on("room-chat", function(data) {
            messageList = chats;
            setMessageList(messageList);
        });

        showPic();
      },[]);

      useEffect(()=>{
            messageList = chats;
            if(messageList && messageList[messageList.length-1] && messageList[messageList.length-1].message === ans)  ansSound();
            setMessageList(messageList);
            
            
      }, [chats])


      useEffect(()=> {

        if(players.length < playerCount) {
            setPlayerCount(players.length);
            disconnectSound();
        }
        else if(players.length > playerCount) {
            setPlayerCount(players.length);
            joiningSound();
        }


        var pMap = new HashMap<string, number>();
        playersBackup.map(  async (player: any)=>{
            pMap.set(player.playerId, player.score);
        });
        

        players.map( async (player: any) => {

            if(player.isAdmin && player.playerId === user.playerId) {
                dispatcher({type:'SET_USER', name: user.name, playerId: user.playerId, score: player.score, avatar:  user.avatar, isAdmin: true});
            }
            if(pMap.has(player.playerId)) {
                
                
                let oldScore = pMap.get(player.playerId);
                console.log("OLD SCORE : "+oldScore+"    NEW SCORE : "+player.score);
                if(oldScore !== undefined && oldScore < player.score)
                {
                    setTotalPlayerAnswered( (state)=> {
                        return state+1;
                    });
                }
            }
        });


        
        setTotalPlayerAnswered( (state)=> {
            if(state === players.length) {
                skipRound = true;
                setSkipRound(skipRound);
            }
            return state;
        });

        setPlayersBackup(players);

      }, [players]);


    const chat = async (text: string) => {
        if(text === ans && !ansGiven) {
            setAnsGiven(true);
            let point = time*5;
            await socket.emit("update-score", {roomId:roomId, playerId: user.playerId, points: point});
        }
        console.log("ROOMID :" + roomId );
        
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
        await wait(3000);
        setHideRoundShutter(prevState => !prevState);
    }

    const showPic = async () => {

        var currentRound_sub = currentRound.sub;

        try {

            let length = game.length;

            if(currentRound)
                for(let i = currentRound.sup; i<=length; i++) {
                    let r = game[i-1];
                    setTime(TIME);

                    for(let j = currentRound_sub; j<= r.length; j++) {
                        setBlur(true);
                        setAnsGiven(false);
                        if(user.isAdmin) await syncRound(i,j);

                        setRound(i+'.'+j);
                        setShutterRound(i);
                        setCurrentPic(r[j-1].link);
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
                                    console.log('SKIPPING');
                                    
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
                                    console.log('SKIPPING');
                                    
                                    setTime(0);
                                    break;
                                }
                                console.log('skipRound : '+skipRound);
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



    const ansSound = () => {
        if(enableAudio)
            ansAudio.play();
    }

    const joiningSound = () => {
        if(enableAudio)
            joinAudio.play();
    }

    const disconnectSound = () => {
        if(enableAudio)
            disconnectAudio.play();
    }


    const toggleAudio = () =>{
        setEnableAudio(!enableAudio);
    }


    
    return( 
        <>
         <Grid>
                <GridItem span={4}><img src={enableAudio ? sound : mute} className={"sound-icon"} onClick={()=>toggleAudio()} alt={"sound"} ></img></GridItem>
                <GridItem span={4}></GridItem>
                <GridItem span={4}>
                    <div className={"round-card"}>
                        Round {round} 
                    </div>
                </GridItem>
            </Grid>
        <Grid>
            <GridItem span={4}>
                <div className="side-panel-left">
                    <div id="chat-window" className="chat-box">

                        {messageList.map((data:any, i:number)=>
                            <div className={i%2===0 ? 'msg-card blue' : 'msg-card white'}>
                                <b>{data.from}:</b> 
                                <span className={data.message === ans ? 'right-ans' : ''}>
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

                {gameFinished ? <div className={"play-again"}> <a className={'play-again-btn'} href={"http://localhost:3000/"} >Play again!</a>  </div> 
                : <div>
                
                <div className={"main-screen"} >
                    <img src={currentPic} onLoad={()=>console.log("IMAGE LOADED")}   className={toggleBlur ? "image-blur" : "image-clear"} alt="logo"/>
                    {/* <img src={'https://lh3.googleusercontent.com/l1VOxbA4SDQ50J1nhjmo2q43U1mWUXfQ3iTHCycOmHH7VjSCdCew9rEiUDPmkwT2LOKpVqYEhDBYdQ1-sV7QMmSWdg7H5_OAy2_jjPPKapddf3_XvI8B7azdqxGYrESJsbDeOMVuoKCba-JFOyxeynf8jCTuDaTPNFQ0yx3OZPTu8L2DDSGE9UYoU4yrUtXQk0pt3et2Jwt-o4-ONzuivHSIVcSUQRWtbbrsBPZ5GjQNR6xA8Lma9nghdWquwF5ti4_Ct5Drfqg6I0Kjdgn9JPeTT7FOqLoAjA3mxiIE5EfNhu56kaN5P_wqJHazr8qex85nngwIDLsayx8aQ_BoQAo1hFJuI3ZS9hxQbkCZbI4GwUpIR4tw8wQxGpk9FwHYjvK1mEvyTj65gbU3o3_9TtqobyZIVMUiONh5PIYLqDBl9Al4X_ehXpbCh9cunq5JrWDJjaELyx493KWjWMdjStCeOZLMXk1D26VOdehORDgFInSHFeqN3HYCjJT5LK0X3Bes26QWt60NURKfLmL3y8Es-E0AY9KQDGHXFijWMBMms5L68belboP1uGPSr7IWOHSlFXwfYxqBPGE-cAgb2YtTYjVBXU1kWphkqvJeHoyq6oqbb2gl3_rxOIyCfjEnYz-Ld__NaXnsr_IaoH76Bqii5C02rt80QsONDAIODGLSgbBrJI3mcCwv-k60bTSOXXrKPCJlLYsSYQu_X2bQqT3D=w348-h528-no?authuser=0'} onLoad={()=>console.log("IMAGE LOADED")}   className={toggleBlur ? "image-blur" : "image-clear"} alt="logo"/> */}
                </div>
                

                <div>
                    <div className="clock-circle">
                        <div className="space" >
                            {time}
                        </div>
                    </div>
                </div>

                <div className={"ans-div"}>
                      {toggleBlur ? ANS_HIDDEN() : ANS_SHOWN()}
                </div>

                <br></br>
                <br></br>
                <br></br>
                <div className={"hint-div"}>
                <i className="icon-lightbulb"></i> Hint: {hint}
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
                        {players.map((data: any, rank: number)=><div>

                                <div className={rank%2===0 ? "player-card-even" : "player-card-odd"}>
                                <span className="player-name">
                                    {rank===0 && data.score > 0 ? <img src={first} style={{width:'30px'}} alt={"rank1"} ></img> 
                                    : rank===1 && data.score > 0 ?  <img src={second} style={{width:'30px'}} alt={"rank2"}></img> 
                                    : rank===2 && data.score > 0? <img src={third} style={{width:'30px'}} alt={"rank3"}></img> 
                                    : rank+1} &nbsp;  <img style={{width:'20px', height:'20px', borderRadius:'10px' }} src={data.avatar} alt={"icon"}></img>
                                    &nbsp;  {data.name} {user.playerId === data.playerId ? '(You)':''} </span>
                                    <div>
                                        <span className="player-score">score: {data.score}</span>
                                    </div>
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