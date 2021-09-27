import { useSelector } from 'react-redux';
import './message.css';

const MessageBox = (props:any) => {

    const chats = useSelector((state: any)=> state.messageList);

    return(
        <>
            {chats.map((data:any, index: number)=>
                <div className={ index%2===0 ? "msg-card white" : "msg-card blue"}><b>{data.from} :</b> 
                    <span className={data.message==='office'?'right-ans':''}>
                        {data.message==='office'?'player guessed it':data.message}
                    </span>
                </div>
            )}

            {/* {props.messageList.map((message:any, index: number)=>
                <div className={ index%2===0 ? "msg-card white" : "msg-card blue"}><b>{message.name}:</b> 
                    <span className={message.message==='office'?'right-ans':''}>
                        {message.message==='office'?'player guessed it':message.message}
                    </span>
                </div>
            )} */}
        </>
    )
}


export default MessageBox;