require('dotenv').config();
import React, { useState } from "react";

const Clipboard = ({ Item }) => {
    const [text, setText] = useState(Item);

    const textareaStyling = {
        /* Filename - App.css */
        height: "50px",
        width: "80%",
        padding: 0,
        fontSize: "25px",
        borderRadius: "5px",
        margin: "auto",
        marginTop: "2%",
    }
    const shareButtonStyling = {
        // margin: "2%",
        padding: "10px",
        fontSize: "20px",
        position: "relative",
        /* // left: 30%; */
        marginTop: "50px",
        cursor: "pointer",
        color: "white",
        backgroundColor: "green",
        borderRadius: "10px",
    }

    const buttonStyling = {
        margin: "20px",
        padding: "10px",
        fontSize: "20px",
        // position: "relative",
        /* // left: 30%; */
        // marginTop: "50px",
        cursor: "pointer",
        color: "white",
        backgroundColor: "Blue",
        borderRadius: "10px",
    }

    console.log("IV: " + JSON.stringify(Item));

    const handleCopyClick = async () => {
        try {
            await window.navigator.clipboard.writeText(text);
            alert("Copied to clipboard!");
        } catch (err) {
            console.error("Unable to copy to clipboard.", err);
            alert("Copy to clipboard failed.");
        }
    };

    return (
        <div className="App">
            <a href={text}>{text} </a>
            {/* <button style={shareButtonStyling} href={text}> Test Link </button> */}
            <br />
            <button style={buttonStyling} onClick={handleCopyClick}>
                Copy to Clipboard
            </button>
        </div>
    );
};

export default Clipboard;