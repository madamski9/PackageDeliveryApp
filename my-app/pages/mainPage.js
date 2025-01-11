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
    const [deliveredPackages, setDeliveredPackages] = useState([])

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
                const delivered = data.filter(pkg => pkg.status === "Delivered")
                const notDelivered = data.filter(pkg => pkg.status !== "Delivered")

                setfetchPackage(notDelivered)
                setDeliveredPackages(delivered)
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
                                <p className="addNewPackage">Add new package</p>
                                <button
                                    className="addPackageButton"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        router.push("/addPackage")
                                    }}
                                >
                                    <img className="plus" src="/images/plus.png"/>
                                </button>
                                <img className="box2" src="/images/logistics.png"/>
                            </div>
                            <div className="overview-main-2">
                                <p className="yourPersDat">Your personal data</p>
                                    <div className="user-data">
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
                            </div>
                            <div className="overview-main-3">
                                <p className="addNewPackage">Your packages</p>
                                <div className="user-packages">
                                    {fetchPackage.length > 0 ? (
                                        fetchPackage.map((pkg, index) => (
                                            <div key={index}>
                                                <button className="packages-overview">
                                                    <img className="truck" src="/images/delivery.png"/>
                                                    <p>Number: {pkg.number}</p>
                                                    <p>Name: {pkg.name}</p>
                                                    <p>Status: {pkg.status}</p>
                                                </button>
                                            </div>
                                        ))
                                    ) : (
                                        <p>No packages avaible</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )
            case "History":
                return (
                    <div className="history-div">
                        {deliveredPackages.length > 0 ? (
                            deliveredPackages.map((pkg, index) => (
                                <div className="packages-history" key={index}>
                                    <button className="packages-history-button">
                                        <img className="truck" src="/images/delivery.png"/>
                                        <p>Number: {pkg.number}</p>
                                        <p>Name: {pkg.name}</p>
                                        <p>Status: {pkg.status}</p>
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p>No packages avaible</p>
                        )}
                    </div>
                )
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