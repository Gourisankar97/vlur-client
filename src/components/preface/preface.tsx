import { Grid, GridItem, AboutModal, TextContent, TextList, TextListItem } from '@patternfly/react-core';
import { useState } from 'react';
import { Helmet } from 'react-helmet';
import GameCard from './gameCard/GameCard';
import './preface.css'

const Preface =  (props: any) => {

    const [isModalOpen, setModalOpen] = useState(false);
    const [isAboutOpen, setAboutOpen] = useState(false);
    const [isDisclaimerOpen, setDisclaimerOpen] = useState(false);
    const handleContactToggle = (type: boolean) => {
        setModalOpen((state)=> {
            return type;
        })
    }

    const handleAboutToggle = (type: boolean) => {
        setAboutOpen((state)=> {
            return type;
        })
    }

    const handleDisclaimerToggle = (type: boolean) => {
        setDisclaimerOpen((state)=> {
            return type;
        })
    }


    return(
        <>
            <GameCard></GameCard>

        <div className={"modal"}>
            <AboutModal
                    isOpen={isAboutOpen}
                    onClose={()=>handleAboutToggle(false)}
                    trademark="&nbsp; &nbsp;  &nbsp;copyright@vlur.online 2021 "
                    brandImageSrc={'logo.gif'}
                    brandImageAlt="Modal"
                    // backgroundImageSrc={img}
                    >
                    <TextContent>
                        <TextList component="dl">
                            <TextListItem component="dt">&nbsp; &nbsp;  &nbsp; Who are we: </TextListItem>
                            <TextListItem component="dd">Some energetic programmers, always makes work fun :)   &nbsp; &nbsp;  &nbsp; </TextListItem>
                        </TextList>
                    </TextContent>
            </AboutModal>

            <AboutModal
                    isOpen={isModalOpen}
                    onClose={()=>handleContactToggle(false)}
                    trademark="&nbsp; &nbsp;  &nbsp; copyright@vlur.online 2021       "
                    brandImageSrc={'logo.gif'}
                    brandImageAlt="Modal"
                    // backgroundImageSrc={img}
                    >
                    <TextContent>
                        <TextList component="dl">
                            <TextListItem component="dt">&nbsp; &nbsp;  &nbsp; Email:</TextListItem>
                            <TextListItem component="dd">vlur.contact@gmail.com  &nbsp; &nbsp;  &nbsp; </TextListItem>
                        </TextList>
                    </TextContent>
            </AboutModal>

            <AboutModal
                    isOpen={isDisclaimerOpen}
                    onClose={()=>handleDisclaimerToggle(false)}
                    trademark="&nbsp; &nbsp;  &nbsp; copyright@vlur.online 2021       "
                    brandImageSrc={'logo.gif'}
                    brandImageAlt="Modal"
                    // backgroundImageSrc={img}
                    >
                    <TextContent>
                        <TextList component="dl">
                            <TextListItem component="dt">&nbsp; &nbsp;  &nbsp; <b>Disclaimer</b></TextListItem>
                            <TextListItem component="dd">
                                # The images are for fair use only and belongs to the respected copyright owners.
                            </TextListItem>
                            
                            <br></br>
                            <TextListItem component="dd">
                                # We have taken permission from the owners of the images/photos for fair use here.
                            </TextListItem>
                            <br></br>

                            <TextListItem component="dd">
                                # We are not responsible for any kind of user generated content or text message on the chat/game.
                            </TextListItem>
                            <br></br>

                            <TextListItem component="dd">
                                # For any other query, feel free to drop a mail @ <i> <b>vlur.contact@gmail.com </b></i>
                            </TextListItem>

                        </TextList>
                    </TextContent>
            </AboutModal>


            </div>

            <div style={{position:'fixed', bottom:'10px'}}>
                <Grid>
                    <GridItem span={4} className={"con-abt"} onClick={()=>handleContactToggle(true)}> Contact </GridItem>
                    <GridItem span={4} className={"con-abt"} onClick={()=>handleAboutToggle(true)}> About us</GridItem>
                    <GridItem span={4} className={"con-abt"} onClick={()=>handleDisclaimerToggle(true)}> Disclaimer </GridItem>
                </Grid>
            </div>
        </>)
}

export default Preface;