import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSearchParams } from "next/navigation";

const mainPage = () => {
    const router = useRouter()
    const [menuVisible, setMenuVisible] = useState(false)
    const [headerInput, setHeaderInput] = useState("")
    const [activePage, setActivePage] = useState("Overview")

    const handleMenuClick = () => {
        console.log("przycisk dziala")
        setMenuVisible(!menuVisible)
    }
    const renderContent = () => {
        switch (activePage) {
            case "Overview":
                return <div>Overview</div>
            case "History":
                return <div>History</div>
            case "Something":
                return <div>Something</div>
        }
    }
    
    return (
        <div className="body">
            <div className="gridContainer">
                <div className="column1">
                    <div className="mainHeader">
                        <div className="groupLeft">
                            <button className="menu" onClick={handleMenuClick}>
                                <img className="menuImg" src="/images/menu-2.png"/>
                            </button>
                            <input
                                type="text"
                                className="headerInput"
                                onChange={(e) => setHeaderInput(e.target.value)}
                            ></input>
                        </div>
                        <div className="groupRight">
                            <button
                                className="notificationButton"
                            >
                                <img className="bell" src="/images/notification.png"/>
                            </button>
                            <button
                                className="profile"
                            >
                                <img className="user" src="/images/user.png"/>
                            </button>
                        </div>
                    </div>
                    <div className="main-2">
                        <div className="nav-main-2">
                            <button 
                                className="button-main-2"
                                onClick={() => setActivePage("Overview")}
                            >Overview</button>
                            <button 
                                className="button-main-2"
                                onClick={() => setActivePage("History")}
                            >History</button>
                            <button 
                                className="button-main-2"
                                onClick={() => setActivePage("Something")}
                            >Something</button>
                        </div>
                        <div>{renderContent()}</div>
                    </div>
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