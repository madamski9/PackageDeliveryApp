import { useState, useEffect } from "react"

const Notifications = ({ userId }) => {
    const [userNotifications, setUserNotifications] = useState([])

    useEffect(() => {
        if (!userId) return
        const storedPackages = JSON.parse(localStorage.getItem("packages")) || []
        const userPackages = storedPackages.filter(pkg => pkg.userId === userId)
        setUserNotifications(userPackages)
    }, [userId])

    return (
        <div className="notification-list">
            {userNotifications.length > 0 ? (
                userNotifications.map((pkg, index) => (
                    <div key={index} className="notification-item">
                        <p>
                            {pkg.packageInfo ? (
                                JSON.parse(pkg.packageInfo).message
                            ) : (
                                <span>No valid messages available.</span>
                            )}
                        </p>
                    </div>
                ))
            ) : (
                <p>You don't have any notifications.</p>
            )}
        </div>
    )
}

export default Notifications
