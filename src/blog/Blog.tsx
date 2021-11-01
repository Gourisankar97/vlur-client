import { Grid, GridItem } from '@patternfly/react-core';
import React from 'react';
import { Link, BrowserRouter as Router, Route } from 'react-router-dom';
import './blog.scss';


export const Blog = () => {



    return (
    <div>

        {/* What is this game about? */}

        <Grid>
            <GridItem span={2}></GridItem>
            <GridItem span={8}>
                {/* <Router>
                    <Route path="/image-guessing-quiz-game" exact component ={}/>
                </Router> */}
                <Link to="/blog/image-guessing-quiz-game">
                    <div className={'article-card'}>
                        What is Image guessing quiz : vlur.online and How to play it?
                    </div>
                </Link>
                
                <div className={'article-card'}>
                    How we created this game using javascript and web sockets?
                </div>
            </GridItem>
            <GridItem span={2}></GridItem>
        </Grid>
        
    </div>
    );
}