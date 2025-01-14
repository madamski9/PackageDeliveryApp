const Header = ({ handleLogout, handleMenuClick, handleUserInfoClick, setHeaderInput, userInfoVisible }) => {
    return (
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
    )
}
export default Header