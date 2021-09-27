import { Grid, GridItem, Spinner } from "@patternfly/react-core";
import './loading.css';

export const Loading = () => {

    return (
        <>
            <Grid>
                <GridItem span={4}></GridItem>
                <GridItem span={4}>
                    <div style={{color:'white', fontWeight:'bolder'}}><Spinner isSVG diameter="80px" /> 
                        <br></br>
                        Loading ...
                    </div>
                </GridItem>
                <GridItem span={4}></GridItem>
            </Grid>
        </>
    )
}