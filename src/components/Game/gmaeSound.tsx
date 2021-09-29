const ansAudio = new Audio(`sounds/correct.mp3`);
const joinAudio = new Audio(`sounds/join.mp3`);
const disconnectAudio = new Audio(`sounds/right_answer.mp3`);

export const ansSound = (enableAudio:boolean) => {
    if(enableAudio)
        ansAudio.play();
}

export const joiningSound = (enableAudio:boolean) => {
    if(enableAudio)
        joinAudio.play();
}

export const disconnectSound = (enableAudio:boolean) => {
    if(enableAudio)
        disconnectAudio.play();
}