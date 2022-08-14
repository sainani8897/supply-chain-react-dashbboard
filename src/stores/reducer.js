import { useReducer } from 'react'
import './App.scss'


function reducer(state, action) {
    switch (action.type) {
        case 'ADD': return { count: state.count + 1 }
        case 'SUB': return { count: state.count - 1 }
        case 'ADD10': return { count: state.count + 10 }
        case 'SUB10': return { count: state.count - 10 }
        case 'RESET': return { count: 0 }
        default: return state
    }
}


export default reducer