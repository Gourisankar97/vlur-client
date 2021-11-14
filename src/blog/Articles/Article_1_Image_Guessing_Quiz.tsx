import { Flex, Label, Tooltip } from '@patternfly/react-core';
import { CloseIcon, ExternalLinkAltIcon } from '@patternfly/react-icons';
import React, { useState } from 'react';
import './article.scss'


export const Article_1 = () => {


    const [close, setClose] = useState(false);
    const tags = ['quiz'
                ,'guess the picture game'
                ,'picture guessing'
                ,'buzzfeed quizzes'
                ,'quiz questions'
                ,'quizz'
                ,'gk questions'
                ,'friends quiz'
                ,'online quiz'
                ,'quizup'
                ,'answers today'
                ,'general knowledge questions'
                ]

    const getTags = () => {

        return(
            <Flex>
                {
                tags.map((tag: any, index: number) => {
                    return <Flex> <Label color='orange'>{tag}</Label></Flex>
                })
                }
            </Flex>
        );
    }
document.title = 'Play friends quiz and quiz questions on VLUR.ONLINE. How To Play It?';

    return (<>
        { !close ? <div className="template">
            <div style={{float:'right', cursor:'pointer'}} onClick={() => {setClose(true)}}> 
                <Tooltip
                    content={
                        <div>
                            Close
                        </div>
                    }
                    >
                    <CloseIcon/> 
                </Tooltip>
            </div>
            <div className="title">
                Play friends quiz and quiz questions on VLUR.ONLINE. How To Play It?
            </div>

            <div className="body">
                <p>
                    Before reading this article, we would like to recommend you to explore the <a href="https://vlur.online" target="_blank">GAME <ExternalLinkAltIcon/></a> first! 
                </p>

                <p>
                    This game is developed by an useless :) software engineer on free time to engage friends in some interesting quiz games. Here you can add upto 12 friends to this game and also play with 
                    random guys also.

                    <br/>
                    <br/>

                    This game is all about guessing the blur images with hint. The interesting fact is that, you can play this game alone or with multiple friends.

                </p>
                    <br/>
                <p>
                    <h3>Conclusion</h3>
                    <hr/>

                    How to play the game?<br/>
                    Ans. <br/>
                    1. There you can type your name or it will give you a default name. <br/>
                    2. Now choose an avatar that you like. <br/>
                    3. Now there are 2 options, Play and Create Room. <br/><br/>
                    Play:<br/>
                    This option will take you to a random game. if any game is already running you will automatically enter the game or the system will create a new game for you and assign to you as admin.<br/>
                    <br/>
                    Create Room:<br/> 
                    This option will create a new room for you and you can add friends and choose the number of round you want to play.
                </p>
            </div>

            <div>
                {getTags()}
            </div>
            
        </div> : ''}
        </>
    );
}
