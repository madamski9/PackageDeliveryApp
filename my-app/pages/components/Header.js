import { useState, useEffect } from "react";
import Notifications from "./Notifications.js";
import mqtt from "mqtt";

const Header = ({ handleLogout, handleMenuClick, setHeaderInput }) => {
    const [notificationVisible, setNotificationVisible] = useState(false);
    const [notificationNumber, setNotificationNumber] = useState(0)
    const [userInfoVisible, setUserInfoVisible] = useState(false)
    console.log("notificationNumber: ", notificationNumber)

    const handleUserInfoClick = () => {
        if (notificationVisible) {
            setNotificationVisible(!notificationVisible)
        }
        setUserInfoVisible(!userInfoVisible)
    }

    const handleRemoveClick = () => {
        localStorage.removeItem("messages")
        setNotificationVisible(!notificationVisible)
        setNotificationNumber(0)
    }
    useEffect(() => {
        const client = mqtt.connect(process.env.NEXT_PUBLIC_MQTT_BROKER_URL)

        client.on("connect", () => {
            console.log("Header connected to MQTT")
            client.subscribe(process.env.NEXT_PUBLIC_MQTT_TOPIC, (err) => {
                if (!err) {
                    console.log(`header subscribing ${process.env.NEXT_PUBLIC_MQTT_TOPIC}`)
                }
            })
        })
        client.on("message", (topic, msg) => {
            if (msg) {
                setNotificationNumber(prevNum => prevNum + 1)
            }
            console.log("liczba: ", notificationNumber)
        })
    }, [])

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
                            <div style={{color: 'white', marginLeft: '4.5px', fontSize: '12px'}}>{notificationNumber}</div>
                        </div>
                    ) : (
                        <div style={{display: 'none'}}>{notificationNumber}</div>
                    )}
                <button
                    className="notificationButton"
                    onClick={() => userInfoVisible ? setUserInfoVisible(!userInfoVisible) : setNotificationVisible(!notificationVisible)}
                >
                    <img className="bell" src="/images/notification.png" />
                </button>
                <div className="transparent-div">
                    <Notifications setNotificationNumber={setNotificationNumber} />
                </div>
                {notificationVisible && (
                    <>
                        <div className="notification-div">
                            <Notifications setNotificationNumber={setNotificationNumber} />
                            {notificationNumber > 0 ? (
                                <button
                                    className="clearNotificationButton"
                                    onClick={() => handleRemoveClick()}
                                >
                                    Clear
                                </button>
                            ) : (
                                <p>You dont have any notifications</p>
                            )}
                        </div>
                        <div
                            className="exitBigDiv2"
                            onClick={() => setNotificationVisible(!notificationVisible)}
                        ></div>
                    </>
                )}
                <button
                    className="profile"
                    onClick={() => handleUserInfoClick()}
                >
                <img className="user" src="/images/user.png" />
                </button>
                {userInfoVisible && (
                <>
                    <div className="userInfo">
                        <button
                            className="buttonLogout"
                            onClick={() => handleLogout()}
                        >
                            Logout
                            <img className="logoutImg" src="/images/logout.png" />
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
    );
};

export default Header;
