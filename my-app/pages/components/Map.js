import { useEffect, useState } from "react";

const Map = ({ selectedPackages }) => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) return null

    return (
        <div className="map-div">
            <img className="map" src="/images/map.png" />
            {selectedPackages && (
                <>
                    <div className={`pl${selectedPackages.packagelocker}`}>
                        <div className={`arrow-pl${selectedPackages.packagelocker}`}></div>
                        <img className={`pl${selectedPackages.packagelocker}-img`} src="/images/locker.png" />
                    </div>
                    <div className="package-info">
                            <p>Number: {selectedPackages.number}</p>
                            <p>Name: {selectedPackages.name}</p>
                            <p>Status: {selectedPackages.status}</p>
                            <p>Package locker number: {selectedPackages.packagelocker}</p>
                    </div>
                </>
            )}
        </div>
    );
};

export default Map;
