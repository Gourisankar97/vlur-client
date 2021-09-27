import { useDispatch } from 'react-redux';
import logo from '../../../assets/images/my-com-logo.png';
import { home } from '../../../store/Action/actions';

const Logo = () => {

    const dispatcher = useDispatch();
    return(
        <>
            <a href="http://localhost:3000/">
                <img src={logo} style={{height:'100px', cursor:'pointer'}} alt={"logo"} onClick={ ()=>{dispatcher(home()) } }></img>
            </a>
        </>
    )
}

export default Logo;