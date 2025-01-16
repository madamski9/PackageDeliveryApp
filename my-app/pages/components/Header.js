import { useState } from "react";
import Notifications from "./Notifications.js";

const Header = ({ handleLogout, handleMenuClick, handleUserInfoClick, setHeaderInput, userInfoVisible }) => {
    const [notificationVisible, setNotificationVisible] = useState(false);
    const [notificationNumber, setNotificationNumber] = useState(0)
    console.log("notificationNumber: ", notificationNumber)

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
                        {notificationNumber}
                    </div>
                ) : (
                    null
                )}
                <button
                    className="notificationButton"
                    onClick={() => setNotificationVisible(!notificationVisible)}
                >
                <img className="bell" src="/images/notification.png" />
                </button>
                {notificationVisible && (
                    <div className="notification-div">
                        <Notifications setNotificationNumber={setNotificationNumber} />
                    </div>
                )}
                <button
                    className="profile"
                    onClick={() => handleUserInfoClick()}
                >
                <img className="user" src="/images/user.png" />
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
