import { useEffect, useState } from "react";

const Map = ({ selectedPackages }) => {
    const [isClient, setIsClient] = useState(false);
    const [showLockerInfo, setShowLockerInfo] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) return null
    const statusOrder = ["Sent", "Accepted for execution", "On the way", "Delivered"];

    return (
        <div className="map-div">
            <div className="map-top">
                <div className="map-package-div">
                    <img className="map-package" src="/images/package.png"/>
                </div>
                <div className="map-top-status">
                    <div>{selectedPackages && selectedPackages.status}</div>
                    <div className="map-top-number">{selectedPackages && selectedPackages.number}</div>
                </div>
            </div>
            <img className="map" src="/images/map.png" />
            {selectedPackages && (
                <>
                    <div className={`pl${selectedPackages.packagelocker}`}>
                        <div className={`arrow-pl${selectedPackages.packagelocker}`}></div>
                        <img
                            className={`pl${selectedPackages.packagelocker}-img`}
                            src="/images/locker.png"
                            onMouseEnter={() => setShowLockerInfo(true)}
                            onMouseLeave={() => setShowLockerInfo(false)}
                        />
                        {showLockerInfo && (
                            <div className="locker-info2">
                                Package locker number: {selectedPackages.packagelocker}
                            </div>
                        )}
                    </div>
                </>
            )}
            <div className="timeline">
                {statusOrder.map((status, index) => (
                    <div className="event" key={status}>
                        <div
                            className={`dot ${
                                selectedPackages && statusOrder.indexOf(selectedPackages.status) >= index
                                    ? "completed"
                                    : ""
                            }`}
                        ></div>
                        {index < statusOrder.length - 1 && <div className="line"></div>}
                        <div className="content">
                            <div className="status">{status}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Map;
