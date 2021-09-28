export const page = (state:any ='PREFACE', action: any) => {
    switch (action.type) {
      case 'SHOWGAME':
            return 'GAME';
      case 'SHOWROOM':
            return 'ROOM';
      case 'LOAD':
            return 'LOADING';
      case 'PREFACE':
            return 'PREFACE';
      default:
            return state;
    }  
}

export const roomLink = (state:string='null', action: any) => {

      switch (action.type) {
            case 'roomId':
                  return action.payload;
            default:
                  return state;
      }
      
}


export const user = (state=
            { name:'unnkown', 
              playerId:'null', 
              score: 0,
              avatar:'',
              isAdmin:false} , 
              action: any) => {
            switch (action.type) {
                  case 'SET_USER':
                        state = 
                              { name:action.name, 
                              playerId:action.playerId, 
                              score: action.score,
                              avatar: action.avatar,
                              isAdmin:action.isAdmin
                              };
                        return state;
                  default:
                        return state;
            }
}


export const players = (state=
      [{ name:'unnkown', 
        playerId:'null', 
        score: 0,
        avatar:'',
        isAdmin:false}] , 
        action: any) => {
      switch (action.type) {
            case 'SET_PLAYERS':
                  state = action.players
                  return state;
            default:
                  return state;
      }
}

export const messageList = (state = [], action: any) => {
      switch (action.type) {
            case 'ADD_MESSAGE':
                  state = state.concat(action);
                  return state;
      
            default:
                  return state;
      }
}

export const game = (state = [], action: any) => {
      switch (action.type) {
            case 'SET_GAME':
                  state = action.game;
                  return state;

            default:
                  return state;
      }
}

export const round = (state = {sup: 1, sub: 1}, action: any ) => {
      switch (action.type) {
            case "SET_ROUND":
                  state = action.currentRound;
                  return state;
            default:
                  return state;

      }
}

export const currentAnswer = (state:string='', action: any) => {
      switch (action.type) {
            case "SET_ANS":
                  state = action.ans;
                  return state;
            default:
                  return state;

      }
}

export const skipTime = (state:number=0, action: any) => {
      switch (action.type) {
            case "SET_SKIP":
                  state = action.skip;
                  return state;
            default:
                  return state;

      }
}