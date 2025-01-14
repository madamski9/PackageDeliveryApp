import { useState, useEffect, act } from "react";
import { useRouter } from "next/router";
import { useSearchParams } from "next/navigation";

const mainPage = () => {
    const router = useRouter()
    const [menuVisible, setMenuVisible] = useState(false)
    const [userInfoVisible, setUserInfoVisible] = useState(false)
    const [headerInput, setHeaderInput] = useState("")
    const [activePage, setActivePage] = useState("Overview")
    const [fetchPackage, setfetchPackage] = useState([])
    const [filteredPackages, setFilteredPackages] = useState([])
    const [filteredDeliveredPackages, setFilteredDeliveredPackages] = useState([])
    const [fetchUser, setFetchUser] = useState([])
    const [deliveredPackages, setDeliveredPackages] = useState([])
    console.log(headerInput)

    const handleSearchInput = (e) => {
        if (activePage === "Overview") {
            setFilteredPackages(
                e === ""
                    ? fetchPackage
                    : fetchPackage.filter(paczka => paczka.number.startsWith(e))
            )
        } else if (activePage === "History") {
            setFilteredDeliveredPackages(
                e === ""
                    ? deliveredPackages
                    : deliveredPackages.filter(paczka => paczka.number.startsWith(e))
            )
        }
    }

    const handleMenuClick = () => {
        console.log("przycisk dziala")
        setMenuVisible(!menuVisible)
    }

    const handleUserInfoClick = () => {
        setUserInfoVisible(!userInfoVisible)
    }

    const handleLogout = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_DATABASE_API}/logout`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                credentials: 'include',  
            });
            if (response.ok) {
                console.log("Logged out successfully");
                localStorage.removeItem("userId");
                router.push("/?path=home"); 
            } else {
                console.error("Logout failed");
            }
        } catch (error) {
            console.error("Error logging out:", error);
        }
    }

    const fetchPackages = async () => {
        const userId = localStorage.getItem("userId")
        console.log("userId: ", userId)
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_DATABASE_API}/api/getPackage?userId=${userId}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            })
            if (response.ok) {
                const data = await response.json()
                console.log(data)
                const delivered = data.filter(pkg => pkg.status === "Delivered")
                const notDelivered = data.filter(pkg => pkg.status !== "Delivered")

                setfetchPackage(notDelivered)
                setFilteredPackages(notDelivered)
                setDeliveredPackages(delivered)
                setFilteredDeliveredPackages(delivered)
            }
        } catch (error) {
            console.error("error fetching packages", error)
        }
    }
    const fetchUserData = async () => {
        const userId = localStorage.getItem("userId")
        console.log(userId)
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_DATABASE_API}/api/getUserData?userId=${userId}`, {
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

    useEffect(() => {
        handleSearchInput(headerInput)
    }, [headerInput])

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
                                    {filteredPackages.length > 0 ? (
                                        filteredPackages.map((pkg, index) => (
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
                        {filteredDeliveredPackages.length > 0 ? (
                            filteredDeliveredPackages.map((pkg, index) => (
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
            case "Package locker":
                //! Paczkomat
                const lockerLayout = [
                    "top",
                    "large l", "large", "large", "large", "large", "large", "large", "large r",
                    "normal l", "normal","normal","normal", "double-small", "double-small", "normal", "normal r",
                    "normal l", "normal","normal","normal", "double-small", "double-small", "normal", "normal r", 
                    "normal l", "normal","normal","normal", "double-small", "double-small", "normal", "normal r", 
                    "normal l", "normal","normal","normal", "double-small", "double-small", "normal", "normal r",
                    "normal l", "normal", "normal", "normal","double-small","double-small", "normal", "normal r",
                    "large ld", "large d", "large d", "large d", "large d", "large d", "large d", "large rd",
                  ]
                  console.log(fetchPackage)
                  return (
                    <div className="locker-main">
                        <div className="locker-packages">
                            {fetchPackage.length > 0 ? (
                                fetchPackage.map((pkg, index) => (
                                    <div key={index}>
                                        <button className="packages-locker">
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
                        <div className="locker-grid">
                        {lockerLayout.map((type, index) => (
                            type === "double-small" ? (
                            <div key={index} className="locker double-small">
                                <div 
                                    className="small"
                                    onClick={() => alert(`Kliknięto szafkę numer ${index * 20 + 1}`)}
                                ></div>
                                <div 
                                    className="small"
                                    onClick={() => alert(`Kliknięto szafkę numer ${index * 20 + 2}`)}
                                ></div>
                            </div>
                            ) : type === "top" ? (
                                <div 
                                    key={index} 
                                    className="locker top"
                                ></div>
                            ) : (
                            <div
                                key={index}
                                className={`locker ${type}`}
                                onClick={() => alert(`Kliknięto szafkę numer ${index + 1}`)}
                            ></div>
                            )
                        ))}
                        </div>
                    </div>
                  )
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
            case "Package locker":
                return <div className="long-div">Long Div Package locker</div>
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
                                onClick={() => handleUserInfoClick()}
                            >
                                <img className="user" src="/images/user.png"/>
                            </button>
                            {userInfoVisible && (
                                <>
                                    <div className="arrow"></div>
                                    <div className="userInfo">
                                        <button 
                                            className="buttonLogout"
                                            onClick={() => handleLogout()}
                                        >
                                            Logout
                                            <img className="logoutImg" src="/images/logout.png"/>
                                        </button>
                                    </div>
                                    <div 
                                        className="exitBigDiv"
                                        onClick={() => handleUserInfoClick()}
                                    ></div>
                                </>
                            )}
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
                                onClick={() => setActivePage("Package locker")}
                            >Package locker</button>
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