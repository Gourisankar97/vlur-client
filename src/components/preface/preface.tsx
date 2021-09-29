import { Grid, GridItem, AboutModal, TextContent, TextList, TextListItem } from '@patternfly/react-core';
import { useState } from 'react';
import GameCard from './gameCard/GameCard';
import './preface.css'

const Preface =  (props: any) => {

    const [isModalOpen, setModalOpen] = useState(false);
    const [isAboutOpen, setAboutOpen] = useState(false);
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
            </div>

            <div style={{position:'fixed', bottom:'10px'}}>
                <Grid>
                    <GridItem span={5}>  </GridItem>
                    <GridItem span={1} className={"con-abt"} onClick={()=>handleContactToggle(true)}> Contact </GridItem>
                    <GridItem span={1} className={"con-abt"} onClick={()=>handleAboutToggle(true)}> About us</GridItem>
                    <GridItem span={5}>  </GridItem>
                </Grid>
            </div>
        </>)
}

export default Preface;