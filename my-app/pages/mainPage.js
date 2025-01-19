import { useState, useEffect, act } from "react"
import { useRouter } from "next/router"
import Overview from "./components/Overview.js"
import History from "./components/History.js"
import PackageLocker from "./components/PackageLocker.js"
import Header from "./components/Header.js"
import Map from "./components/Map.js"
import mqtt from 'mqtt'
import ClearHistoryButton from "./components/ClearHistoryButton.js"

const mainPage = () => {
    const router = useRouter()
    const [menuVisible, setMenuVisible] = useState(false)
    const [headerInput, setHeaderInput] = useState("")
    const [activePage, setActivePage] = useState("Overview")
    const [fetchPackage, setfetchPackage] = useState([])
    const [filteredPackages, setFilteredPackages] = useState([])
    const [filteredDeliveredPackages, setFilteredDeliveredPackages] = useState([])
    const [fetchUser, setFetchUser] = useState([])
    const [deliveredPackages, setDeliveredPackages] = useState([])
    const [longDivVisible, setLongDivVisivle] = useState(false)
    const [selectedPackages, setSelectedPackages] = useState(null)

    const handlePackageSelection = (pkg) => {
        setSelectedPackages(pkg)
    }
    const handleSearchInput = (e) => {
        if (activePage === "Overview") {
            setFilteredPackages(e === "" ? fetchPackage : fetchPackage.filter(paczka => paczka.number.startsWith(e)))
        } else if (activePage === "History") {
            setFilteredDeliveredPackages(e === "" ? deliveredPackages : deliveredPackages.filter(paczka => paczka.number.startsWith(e)))
        }
    }
    const handleMenuClick = () => setMenuVisible(!menuVisible)

    const handleLogout = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_DATABASE_API}/logout`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                credentials: 'include',  
            })
            if (response.ok) {
                console.log("Logged out successfully")
                localStorage.removeItem("userId")
                router.push("/?path=home") 
            } else {
                console.error("Logout failed")
            }
        } catch (error) {
            console.error("Error logging out:", error)
        }
    }

    const fetchPackages = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_DATABASE_API}/api/getPackage`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include"
            })
            if (response.ok) {
                const data = await response.json()
                console.log("potrzbuje to", data)
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
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_DATABASE_API}/api/getUserData`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include"
            })
            if (response.ok) {
                const data = await response.json()
                setFetchUser(data)
                console.log("user data: ", data)
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
                return <Overview 
                    fetchUser={fetchUser} 
                    filteredPackages={filteredPackages} 
                    handlePackageSelection={handlePackageSelection}
                    />
            case "History":
                return <History 
                    filteredDeliveredPackages={filteredDeliveredPackages} 
                    handlePackageSelection={handlePackageSelection}
                    />
            case "Package locker":
                return <PackageLocker 
                    fetchPackage={fetchPackage} 
                    longDivVisible={longDivVisible} 
                    setLongDivVisible={setLongDivVisivle} 
                    handlePackageSelection={handlePackageSelection}
                    setfetchPackage={setfetchPackage}
                    />
        }
    }
    const renderContentLongDiv = () => {
        switch (activePage) {
            case "Overview":
                return <Map selectedPackages={selectedPackages}/>
            case "History":
                return <Map selectedPackages={selectedPackages}/>
            case "Package locker":
                return <Map selectedPackages={selectedPackages}/>
        }
    }
    
    return (
        <div className="body">
            <div className="gridContainer">
                <div className="column1">
                    <Header 
                        handleLogout={handleLogout} 
                        handleMenuClick={handleMenuClick} 
                        setHeaderInput={setHeaderInput} 
                    />
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
                            {activePage === "History" ? (
                                <ClearHistoryButton/>
                            ) : (
                                null
                            )}
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