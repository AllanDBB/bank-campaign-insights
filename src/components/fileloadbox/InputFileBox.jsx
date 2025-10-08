import React, { useRef, useState } from "react";
import styles from "./InputFileBox.module.css"
import PlusButton from "../plusButton/PlusButton";

function InputFileBox({width, height, btnText, action}){

    const [file, setFile] = useState(null);
    const inputBoxRef = useRef();

    const handleFileBoxChg = (evt) => {
        let newFile = evt.target.files[0];
        setFile(newFile)
    }
    const handleDrag = (evt) => {evt.preventDefault()}
    const handleDrop = (evt) =>{
        evt.preventDefault();
        let newFile = evt.dataTransfer.files[0];
        setFile(newFile)
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
                    {file?<p>📄{file.name}</p>:<PlusButton width={"5rem"} height={"5rem"} action={null}></PlusButton>}
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
