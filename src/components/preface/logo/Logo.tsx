import { useDispatch } from 'react-redux';
// import logo from '../../../assets/images/logo.gif';
import './logo.css'
import { home } from '../../../store/Action/actions';
import { clientUrl } from '../../../env';
import { Grid, GridItem } from '@patternfly/react-core';
import { Link, BrowserRouter as Router } from 'react-router-dom';

const Logo = () => {

    const dispatcher = useDispatch();
    return(
        <Grid>
            <GridItem span={11}>
                <a href={clientUrl}>
                    <img src={'logo.gif'} className={"logo"} alt={"vlur.online"} onClick={ ()=>{dispatcher(home()) } }></img>
                </a>
            </GridItem>
            <GridItem span={1}>

                    <Link to="/blog"><p className="blog">Blog</p> </Link>

            </GridItem>
        </Grid>
    )
}

export default Logo;