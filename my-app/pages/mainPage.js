import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSearchParams } from "next/navigation";

const mainPage = () => {
    const router = useRouter()
    const [menuVisible, setMenuVisible] = useState(false)
    const [headerInput, setHeaderInput] = useState("")
    const [activePage, setActivePage] = useState("Overview")
    const [fetchPackage, setfetchPackage] = useState([])
    const [fetchUser, setFetchUser] = useState([])

    const handleMenuClick = () => {
        console.log("przycisk dziala")
        setMenuVisible(!menuVisible)
    }

    const fetchPackages = async () => {
        try {
            const response = await fetch(`http://localhost:3001/api/getPackage`, {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            })
            if (response.ok) {
                const data = await response.json()
                setfetchPackage(data)
                console.log(data)
            }
        } catch (error) {
            console.error("error fetching packages", error)
        }
    }
    const fetchUserData = async () => {
        const userId = localStorage.getItem("userId")
        try {
            const response = await fetch(`http://localhost:3001/api/getUserData?userId=${userId}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            })
            if (response.ok) {
                const data = await response.json()
                setFetchUser(data)
                console.log(data)
            } else {
                if (response.status === 500) {
                    console.error("Something wrong while fetching user data - error 500")
                }
            }
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        if (activePage === "Overview") {
            fetchPackages()
            fetchUserData()
        }
    }, [activePage])

    const renderContent = () => {
        renderContentLongDiv()
        switch (activePage) {
            case "Overview":
                return (
                        <div className="overview-grid">
                            <div className="overview-main-1">
                                <p>Add new package</p>
                                <button
                                    className="addPackageButton"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        router.push("/addPackage")
                                    }}
                                >
                                    +
                                </button>
                                <img className="truck" src="/images/box-truck-2.png"/>
                            </div>
                            <div className="overview-main-2">
                                <p>User data</p>
                                {fetchUser.length > 0 ? (
                                    fetchUser.map((user, index) => (
                                        <div key={index}>
                                            <p>Name: {user.name}</p>
                                            <p>Surname: {user.surname}</p>
                                            <p>Phone: {user.phone}</p>
                                            <p>Address: {user.addres}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p>No user data</p>
                                )}
                            </div>
                            <div className="overview-main-3"><p>Your packages</p>
                                {fetchPackage.length > 0 ? (
                                    fetchPackage.map((pkg, index) => (
                                        <div key={index}>
                                            <p>Package Number: {pkg.number}</p>
                                            <p>Package name: {pkg.name}</p>
                                            <p>Package status: {pkg.status}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p>No packages avaible</p>
                                )}
                            </div>
                        </div>
                    )
            case "History":
                return <div>History</div>
            case "Something":
                return <div>Something</div>
        }
    }
    const renderContentLongDiv = () => {
        switch (activePage) {
            case "Overview":
                return (
                    <div className="long-div-overview">Long Div Overview</div>
                )
            case "History":
                return <div className="long-div-history">Long Div History</div>
            case "Something":
                return <div className="long-div">Long Div Something</div>
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
                                placeholder="Search by track number"
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
                    <div>{renderContentLongDiv()}</div>
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