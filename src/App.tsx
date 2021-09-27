import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import './App.css';
import Game from './components/Game/game'
import { Loading } from './components/loading/loading';
import Logo from './components/preface/logo/Logo';
import Preface from './components/preface/preface'
import { Room } from './components/Room/room';


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
        <Logo></Logo>
       { page==='PREFACE' ?  ( <Preface></Preface> ) : '' }
        { page==='ROOM' ? ( <Room></Room> ) : '' }
        { page==='GAME' ? (<Game></Game>) : '' } 
        { page==='LOADING' ? (<Loading></Loading>) : ''}
    </div>
  );
}

export default App;