import React from 'react';
import styles from './ArrowButton.module.css';
import arrowSvg from "../../assets/arrow.svg";

function RoundButton({ direction = 'left', onClick, size }) {
    const directions = {
        "left": 0,
        "up": 90,
        "right": 180,
        "down": 270
    };
    const rotate = directions[direction];

    return (
        <button className={styles.roundButton} onClick={onClick} style={{ width: size, height: size }}>
            <img 
                src={arrowSvg} 
                alt={`${direction} arrow`}
                style={{ 
                    width: '60%', 
                    height: '60%',
                    transform: `rotate(${rotate}deg)`,
                    transition: 'transform 0.2s ease'
                }}
            />
        </button>
    );
};

export default RoundButton;