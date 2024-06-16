
export const userData = (state = [], action) =>{
    console.log("came in reduc state", action);
    switch(action.type){
        case "UPDATE" : {
            return state = action.payload;
        }
        default: return state;
    }
}