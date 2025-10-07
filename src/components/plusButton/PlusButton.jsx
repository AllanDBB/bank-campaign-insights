import React from "react";

function PlusButton({height, width, action}){
    let buttonStyle = {
        fontSize: '250%',
        backgroundColor: 'var(--primaryLight)',
        borderRadius: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        border: 'none',
        padding: '1rem',
        width: width,
        height: height
    }

    return(
        <button style={buttonStyle}
            onClick={action}>+</button>
    )
}

export default PlusButton