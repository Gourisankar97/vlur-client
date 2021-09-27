export const showGame = () => {
    return {
      type: 'SHOWGAME'
    }
  }
  
export const showRoom = () => {
  return {
    type: 'SHOWROOM'
  }
}

export const home = () => {
  return {
    type: 'PREFACE'
  }
}


export const loading = () => {
  return {
    type: 'LOAD'
  }
}


export const setRoomLink = (roomId: string) => {
  return {
    type: 'roomId',
    room: roomId
  }
}