import React from 'react';
import styles from './ArrowButton.module.css';
import arrowSvg from "../../assets/arrow.svg";

function RoundButton({direction = 'left', onClick, size}){
    const directions = {
        "left": 0,
        "up": 90,
        "right": 180,
        "down": 270
    };
    const rotate = directions[direction];

    return (
        <button className={styles.roundButton} onClick={onClick} style={{width: size, height: size}}>
            <svg 
                width="60%" 
                height="60%" 
                viewBox="0 0 20 20" 
                fill="currentColor"
                style={{ transform: `rotate(${rotate}deg)` }}
            >
            <path d="M5 5L15 10L5 15" stroke="currentColor" strokeWidth="2" fill="none"/>
        </svg>
        </button>
    );
};

export default RoundButton