import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import './App.css';
import Game from './components/Game/game'
import { Loading } from './components/loading/loading';
import Logo from './components/preface/logo/Logo';
import Preface from './components/preface/preface'
import { Room } from './components/Room/room';
import {Helmet} from 'react-helmet'


function App() {

  const page = useSelector( (state:any) => state.page);

  const sound = () => {
    const audio = new Audio(`sounds/join.mp3`);
    audio.play();
  }

  const sound2 = () => {
    const audio = new Audio(`sounds/right_answer.mp3`);
    audio.play();
  }

  const sound3 = () => {
    const audio = new Audio(`sounds/correct.mp3`);
    audio.play();
  }


  const curAns = useSelector((state:any)=>state.currentAnswer);

  useEffect(() => {
    console.log("CURANS in APP : "+ curAns);
    
  }, [curAns]);
  
  
  

  return (
    <div className="App">
        <Helmet>
          <title>vlur.online : Free Multiplayer fun Image Guessing game</title>
          <meta name="description" content="vlur online is a free multiplayer image guessing game. Invite friends or join random rooms and Guess the image name with your friends and people all around the world!" />
          <meta name="keywords" content="vlur online, vlur.online, image guessing game, game, multiplayer, guessing, play with friends,  game for kids, kids play"/>
        </Helmet>
        <Logo></Logo>
       { page==='PREFACE' ?  ( <Preface></Preface> ) : '' }
        { page==='ROOM' ? ( <Room></Room> ) : '' }
        { page==='GAME' ? (<Game></Game>) : '' } 
        { page==='LOADING' ? (<Loading></Loading>) : ''}
    </div>
  );
}

export default App;