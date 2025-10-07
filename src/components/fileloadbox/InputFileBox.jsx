import React, { useRef, useState } from "react";
import styles from "./InputFileBox.module.css"
import PlusButton from "../plusButton/PlusButton";

function InputFileBox({width, height}){

    const [file, setFile] = useState(null);
    const inputBoxRef = useRef();

    const handleFileBoxChg = (evt) => {
        let newFile = evt.target.file[0];
        setFile(newFile)
    }
    const handleDragDrop = (evt) =>{
        evt.preventDefault();
        let newFile = evt.dataTransfer.file[0];
        setFile(newFile)
    }
    const handlePickFile = () => inputBoxRef.current.click();



    return(
        <div className={styles.container} style={{width:width, height:height}}>
            <div className={styles.card}>
                <h2>Ingrese su CSV</h2>
                <div className={styles.dropZone}
                onDrop={handleDragDrop}
                onClick={handlePickFile}>
                    <PlusButton width={"5rem"} height={"5rem"} action={null}></PlusButton>
                    {file && <p>{file.name}</p>}
                </div>
                <input
                type="file"
                ref={inputBoxRef}
                onChange={handleFileBoxChg}
                style={{display:"none"}}
                accept=".csv"/>
                <button className={styles.loadButton}>Cargar Datos</button>
            </div>
        </div>
    )
}

export default InputFileBox
