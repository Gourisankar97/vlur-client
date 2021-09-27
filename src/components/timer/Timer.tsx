import { useState } from "react";
import './timer.css'

const Timer = ( props: any ) => {

    var [time, setTime] = useState(0);
    const wait = (seconds: number) => new Promise(res=> setTimeout(res, seconds)); 

    const startGame = async () => {
        props.timeOff(false);
        for(let i = 10; i>=0; i--) {
            setTime(i);
            await wait(1000);
            if(i === 0) {
                props.timeOff(true);
            }
            
        }
    }
    if(props.start) {
        startGame();
    }

    return(
        <div>
            <div className="clock-circle">
                <div className="space" >
                    {time}
                </div>
            </div>
        </div>
        
    )
}


export default Timer;