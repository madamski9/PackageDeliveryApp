import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSearchParams } from "next/navigation";

const mainPage = () => {
    const router = useRouter()
    const [menuVisible, setMenuVisible] = useState(false)
    const [headerInput, setHeaderInput] = useState("")

    const handleMenuClick = () => {
        console.log("przycisk dziala")
        setMenuVisible(!menuVisible)
    }
    console.log(headerInput)
    
    return (
        <div className="body">
            <div className="gridContainer">
                <div className="column1">
                    <div className="mainHeader">
                        <button className="menu" onClick={handleMenuClick}>
                            menu
                        </button>
                        <input
                            type="text"
                            className="headerInput"
                            onChange={(e) => setHeaderInput(e.target.value)}
                        ></input>
                    </div>
                    <div className="main-2">main2</div>
                    <div className="main-3">main3</div>
                </div>
                <div className="column2">
                    <div className="long-div">Long Div</div>
                </div>
            </div>
            {menuVisible && (
                <div className="menuPage">
                    <button className="xButton" onClick={handleMenuClick}>
                        X
                    </button>
                </div>
            )}
        </div>
    )
}

export default mainPage