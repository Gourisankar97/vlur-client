import { useDispatch } from 'react-redux';
// import logo from '../../../assets/images/logo.gif';
import './logo.css'
import { home } from '../../../store/Action/actions';
import { clientUrl } from '../../../env';

const Logo = () => {

    const dispatcher = useDispatch();
    return(
        <>
            <a href={clientUrl}>
                <img src={'logo.gif'} className={"logo"} alt={"logo"} onClick={ ()=>{dispatcher(home()) } }></img>
            </a>
        </>
    )
}

export default Logo;