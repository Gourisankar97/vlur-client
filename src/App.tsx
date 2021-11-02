import { useSelector } from 'react-redux';
import './App.css';
import { Article_1 } from './blog/Articles/Article_1_Image_Guessing_Quiz';
import Game from './components/Game/game'
import { Loading } from './components/loading/loading';
import Logo from './components/preface/logo/Logo';
import Preface from './components/preface/preface'
import { Room } from './components/Room/room';


function App() {

  const page = useSelector( (state:any) => state.page);


  return (
    <div className="App">
       { page==='PREFACE' ?  ( <Preface></Preface> ) : '' }
        { page==='ROOM' ? ( <Room></Room> ) : '' }
        { page==='GAME' ? (<Game></Game>) : '' } 
        { page==='LOADING' ? (<Loading></Loading>) : ''}

        <Article_1/>
    </div>
  );
}

export default App;