import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSearchParams } from "next/navigation";

const mainPage = () => {
    const router = useRouter()
    const [menuVisible, setMenuVisible] = useState(false)

    const handleMenuClick = () => {
        console.log("przycisk dziala")
        setMenuVisible(!menuVisible)
    }
    
    return (
        <div className="body">
            <div className="mainHeader">
                <button 
                    className="menu"
                    onClick={handleMenuClick}
                >
                    menu
                </button>
            </div>
            <div className="mainPage">
                <div className="main-1">

                </div>
                <div className="main-2">

                </div>
                <div className="main-3">

                </div>
            </div>
            {menuVisible && (
                <div className="menuPage">
                    menu
                </div>
            )}
        </div>
    )
}

export default mainPage