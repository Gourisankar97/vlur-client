import React, { useEffect, useState } from 'react';
import { Grid, GridItem } from '@patternfly/react-core';
import { useSelector } from 'react-redux';
import './players.css';
const Players = () => {

    const players = useSelector((state:any) => state.players);
    console.log("PLA : "+players);
    const [p, setP] = useState([]);

    useEffect(()=>{
        setP(players);
    },[]);
    

    return( 
        <>
            <Grid>
                <GridItem span={6} > players </GridItem>
                <GridItem span={6} > score </GridItem>
            </Grid>
            <Grid>
                <GridItem span={6}>
                    {p.map((data: any)=> {
                        <div className="player-card">{data.name}r</div>
                    })}
                    
                </GridItem>

                <GridItem span={6}>
                    {p.map((data: any)=> {
                        <div className="score-card">{data.score}</div>
                    })}
                </GridItem>
            </Grid>
        </>
    )
}

export default Players;