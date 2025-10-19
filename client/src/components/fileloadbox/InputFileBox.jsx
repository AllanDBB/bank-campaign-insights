import React, { useRef, useState, useEffect } from "react";
import styles from "./InputFileBox.module.css"
import PlusButton from "../plusButton/PlusButton";

function InputFileBox({width, height, btnText, action, onFileSelect}){

    const [file, setFile] = useState(null);
    const [buttonSize, setButtonSize] = useState('7rem');
    const inputBoxRef = useRef();

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 480) {
                setButtonSize('4rem');
            } else if (window.innerWidth <= 768) {
                setButtonSize('5.5rem');
            } else {
                setButtonSize('7rem');
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleFileBoxChg = (evt) => {
        let newFile = evt.target.files[0];
        setFile(newFile);
        if (onFileSelect) {
            onFileSelect(newFile);
        }
    }
    const handleDrag = (evt) => {evt.preventDefault()}
    const handleDrop = (evt) =>{
        evt.preventDefault();
        let newFile = evt.dataTransfer.files[0];
        setFile(newFile);
        if (onFileSelect) {
            onFileSelect(newFile);
        }
    }
    const handlePickFile = () => inputBoxRef.current.click();



    return(
        <div className={styles.container} style={{width:width, height:height}}>
            <div className={styles.card}>
                <h2>Ingrese su CSV</h2>
                <div className={styles.dropZone}
                onDrop={handleDrop}
                onDragOver={handleDrag}
                onClick={handlePickFile}>
                    {file?<p>📄{file.name}</p>:<PlusButton width={buttonSize} height={buttonSize} action={null}></PlusButton>}
                </div>
                <input
                type="file"
                ref={inputBoxRef}
                onChange={handleFileBoxChg}
                style={{display:"none"}}
                accept=".csv"/>
                <button className={styles.loadButton} onClick={action}>{btnText}</button>
            </div>
        </div>
    )
}

export default InputFileBox
