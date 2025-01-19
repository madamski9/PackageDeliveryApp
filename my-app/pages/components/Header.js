import { useState, useEffect } from "react"
import { useRouter } from "next/router.js"
import mqtt from "mqtt"
import Notifications from "./Notifications"

const Header = ({ handleLogout, handleMenuClick, setHeaderInput }) => {
    const [notificationVisible, setNotificationVisible] = useState(false)
    const [notificationNumber, setNotificationNumber] = useState(0)
    const [userInfoVisible, setUserInfoVisible] = useState(false)
    const [userId, setUserId] = useState(null)
    const router = useRouter()

    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedUserId = localStorage.getItem("userId")
            if (storedUserId) {
                setUserId(storedUserId)
            }
        }
    }, [])

    useEffect(() => {
        if (!userId) return

        const MQTT_TOPIC = `/user/${userId}/package/delivered`  
        console.log("Subscribing to MQTT topic:", MQTT_TOPIC)

        const client = mqtt.connect(process.env.NEXT_PUBLIC_MQTT_BROKER_URL)

        client.on("connect", () => {
            console.log("Connected to MQTT")
            client.subscribe(MQTT_TOPIC, (err) => {
                if (!err) {
                    console.log(`Successfully subscribed to ${MQTT_TOPIC}`)
                } else {
                    console.error("Error subscribing to MQTT topic:", err)
                }
            })
        })

        client.on("message", (topic, msg) => {
            console.log("Received message for user", userId, "on topic", topic, ":", msg.toString())

            if (topic === MQTT_TOPIC) {
                let packages = JSON.parse(localStorage.getItem("packages")) || []
                
                const newPackage = {
                    userId,
                    packageInfo: msg.toString()  
                }
                packages.push(newPackage)
                localStorage.setItem("packages", JSON.stringify(packages))

                setNotificationNumber((prevNum) => {
                    const updatedNum = prevNum + 1
                    localStorage.setItem("notificationNumber", updatedNum.toString())
                    return updatedNum
                })
            }
        })

        client.on("error", (error) => {
            console.error("MQTT Error:", error)
        })

        return () => {
            if (client) {
                client.end()
            }
        }
    }, [userId])

    useEffect(() => {
        if (userId) {
            const storedPackages = JSON.parse(localStorage.getItem("packages")) || []
            const userPackages = storedPackages.filter(pkg => pkg.userId === userId)
            setNotificationNumber(userPackages.length)
        }
    }, [userId])

    const handleUserInfoClick = () => {
        if (notificationVisible) {
            setNotificationVisible(false)
        }
        setUserInfoVisible(!userInfoVisible)
    }

    const handleRemoveClick = () => {
        let packages = JSON.parse(localStorage.getItem("packages")) || []
        packages = packages.filter(pkg => pkg.userId !== userId)  
        localStorage.setItem("packages", JSON.stringify(packages))
        
        setNotificationNumber(0)
        localStorage.setItem("notificationNumber", "0")
        setNotificationVisible(false)
    }

    return (
        <div className="mainHeader">
            <div className="groupLeft">
                <button className="menu" onClick={handleMenuClick}>
                    <img className="menuImg" src="/images/menu-2.png" />
                </button>
                <input
                    type="text"
                    className="headerInput"
                    placeholder="Search by track number"
                    onChange={(e) => setHeaderInput(e.target.value)}
                />
            </div>
            <div className="groupRight">
                {notificationNumber > 0 ? (
                    <div className="notificationNum">
                        <div style={{ color: "white", marginLeft: "4.5px", fontSize: "12px" }}>
                            {notificationNumber}
                        </div>
                    </div>
                ) : (
                    <div style={{ display: "none" }}>{notificationNumber}</div>
                )}
                <button
                    className="notificationButton"
                    onClick={() =>
                        userInfoVisible ? setUserInfoVisible(false) : setNotificationVisible(!notificationVisible)
                    }
                >
                    <img className="bell" src="/images/notification.png" />
                </button>
                <div style={{display: 'None'}}>
                    <Notifications userId={userId}/>
                </div>
                {notificationVisible && (
                    <>
                        <div className="notification-div">
                            <Notifications userId={userId}/>
                            {notificationNumber > 0 ? (
                                <button className="clearNotificationButton" onClick={handleRemoveClick}>
                                    Clear
                                </button>
                            ) : (
                                <p>You don't have any notifications</p>
                            )}
                        </div>
                        <div className="exitBigDiv2" onClick={() => setNotificationVisible(false)}></div>
                    </>
                )}
                <button className="profile" onClick={handleUserInfoClick}>
                    <img className="user" src="/images/user.png" />
                </button>
                {userInfoVisible && (
                    <>
                        <div className="userInfo">
                            <button className="settings" onClick={() => router.push("/components/Settings")}>
                                Settings
                            </button>
                            <button className="buttonLogout" onClick={handleLogout}>
                                Logout
                                <img className="logoutImg" src="/images/logout.png" />
                            </button>
                        </div>
                        <div className="exitBigDiv" onClick={handleUserInfoClick}></div>
                    </>
                )}
            </div>
        </div>
    )
}

export default Header
