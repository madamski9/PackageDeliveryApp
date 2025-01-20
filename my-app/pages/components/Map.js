import { useEffect, useState } from "react"

const Map = ({ selectedPackages }) => {
    const [showLockerInfo, setShowLockerInfo] = useState(false)
    const [currentPackage, setCurrentPackage] = useState(null)

    const statusOrder = ["Sent", "Accepted for execution", "On the way", "Delivered"]

    useEffect(() => {
        const storedPackage = JSON.parse(localStorage.getItem("selectedPackage"))
        if (storedPackage) {
            setCurrentPackage(storedPackage)
        }
    }, [])

    useEffect(() => {
        if (selectedPackages) {
            setCurrentPackage(selectedPackages)
        }
    }, [selectedPackages])

    if (!currentPackage) return null

    const getDotClass = (status) => {
        const packageStatusIndex = statusOrder.indexOf(currentPackage.status)
        const currentStatusIndex = statusOrder.indexOf(status)

        if (currentStatusIndex < packageStatusIndex + 1) {
            return "completed"
        } else if (currentStatusIndex === packageStatusIndex) {
            return "in-progress"
        } else {
            return ""
        }
    }

    return (
        <div className="map-div">
            <div className="map-top">
                <div className="map-package-div">
                    <img className="map-package" src="/images/package.png" />
                </div>
                <div className="map-top-status">
                    <div>{currentPackage.status}</div>
                    <div className="map-top-number">{currentPackage.number}</div>
                </div>
            </div>
            <img className="map" src="/images/map.png" />
            {currentPackage && (
                <>
                    <div className={`pl${currentPackage.packagelocker}`}>
                        <div className={`arrow-pl${currentPackage.packagelocker}`}></div>
                        <img
                            className={`pl${currentPackage.packagelocker}-img`}
                            src="/images/locker.png"
                            onMouseEnter={() => setShowLockerInfo(true)}
                            onMouseLeave={() => setShowLockerInfo(false)}
                        />
                        {showLockerInfo && (
                            <div className="locker-info2">
                                Package locker number: {currentPackage.packagelocker}
                            </div>
                        )}
                    </div>
                </>
            )}
            <div className="timeline">
                {statusOrder.map((status, index) => (
                    <div className="event" key={status}>
                        <div className={`dot ${getDotClass(status)}`} />
                        {index < statusOrder.length - 1 && <div className="line"></div>}
                        <div className="content">
                            <div className="status">{status}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Map
