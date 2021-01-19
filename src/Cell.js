import React from 'react'

export default function Cell({type}) {
    let color
    switch (type) {
        case 1: color = 'blue'; break;
        case 2: color = 'red'; break;
        default: color = '#aaa'; break;
    }
    
    const dimension = 20
    return (
        <div style={{ width:dimension, height:dimension, backgroundColor:color, margin:2 }}>
        </div>
    )
}
