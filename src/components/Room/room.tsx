import { Grid, GridItem } from "@patternfly/react-core"
import './room.css';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import io from 'socket.io-client';
import { clientUrl, serviceUrl } from "../../env";
import { CopyIcon } from "@patternfly/react-icons";

const socket = io(serviceUrl, {
    upgrade: false, transports: ['websocket']
});

export const Room = () => {

    const [copied, setCopy] = useState(false);
    const [rounds, setRounds] = useState(5);
    var [publicOpen, setOpen] = useState(false);

    const roomId =  useSelector((state:any)=>state.roomLink);
    const user = useSelector((state:any)=> state.user);

    const generatedLink =   clientUrl+'/?'+roomId;
    const players = useSelector((state:any) => state.players);
    


    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedLink);
        setCopy(true);
    }

    const handleRounds = (event: any) => {
            console.log("SELECTED : "+event.target.value);
            setRounds(event.target.value);
    }
    
    
    /*
     * GAME STARTING STUFF
     */

    const startGame = async () => {
        await socket.emit("game-start", {roomId: roomId, rounds: rounds, open: publicOpen})
    }


    return(
        <>
            <Grid>

                <GridItem span={2}></GridItem>
                <GridItem span={8}>
                    <Grid>
                        <GridItem span={2}>
                            <div className={"invite-link-baner"}>invite link</div>
                        </GridItem>
                        <GridItem span={9}>
                            <div className={"invite-link"}>
                                <span>{generatedLink}</span>
                            </div>
                        </GridItem>
                        <GridItem span={1}>
                            <div className={ copied ? "btn-copied" : "btn-copy"}>
                                <CopyIcon onClick={copyToClipboard} className="icon-copy"></CopyIcon>
                            </div>
                        </GridItem>
                    </Grid>
                    
                    <div className="players-card">
                        {players.map((player:any) => (<div id={player.playerId}  className={"player-template"}> <div 
                                    id={player.playerId+"-inner"} 
                                    style={{backgroundImage:"url("+player.avatar+")",
                                            backgroundPosition: 'center',
                                            backgroundSize: 'cover',
                                            backgroundRepeat: 'no-repeat'}} 
                                            className={"player-avatar"}> </div> <div className={"player-name"} id={player.playerId+"-inner"+player.name}  >@{player.name}{player.playerId===user.playerId? '(you)':''}</div></div>))}
                    </div>
                    <Grid>
                        <GridItem span={7}>
                               <span className="stngs-str"> settings </span>
                            <div className={"settings"}>
                                <div className={"rounds"}>Rounds:
                                    <select name="rounds" defaultValue={5} onChange={handleRounds}>
                                        <option value={5}>5 (default)</option>
                                        <option value={10}>10</option>
                                        <option value={15}>15</option>
                                        <option value={20}>20</option>
                                        <option value={25}>25</option>
                                        <option value={30}>30</option>
                                    </select>
                                </div>
                                <div className={"public-opening"}>
                                    <input type="checkbox" checked={publicOpen} onChange={()=> {publicOpen=!publicOpen; setOpen(publicOpen);} }>
                                    </input> open for public
                                </div>

                            </div>
                        </GridItem>
                        <GridItem span={5}>
                            <div className={ user.isAdmin ?"btn-start" : "btn-disabled"} 
                                onClick={()=> {
                                    if(user.isAdmin) {
                                        startGame();
                                    }
                                }}>
                                    START
                            </div>
                        </GridItem>
                    </Grid>
                </GridItem>
                <GridItem span={2}><span className={"copy"}>{copied ? 'Copied!' : ''}</span></GridItem>
            </Grid>
        </>
        );
}