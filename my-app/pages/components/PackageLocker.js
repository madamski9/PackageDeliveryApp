import { useState } from "react"
const PackageLocker = ({ fetchPackage }) => {
    const randomNumbers = JSON.parse(localStorage.getItem("random"))
    const [lockerNum, setLockerNum] = useState(0)
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
                            <button 
                                className="packages-locker"
                                onClick={() => setLockerNum(parseInt(pkg.packagelocker), 10)}
                            >
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
                        style={randomNumbers[index * lockerNum + 2] < 0.3 ? {backgroundColor: 'red', cursor: 'default'} : null}
                        onClick={randomNumbers[index * lockerNum + 2] < 0.3 ? null : () => alert(`Kliknięto szafkę numer ${index + 1}`)}
                    ></div>
                    <div 
                        className="small"
                        style={randomNumbers[index * lockerNum + 1] < 0.3 ? {backgroundColor: 'red', cursor: 'default'} : null}
                        onClick={randomNumbers[index * lockerNum + 1] < 0.3 ? null : () => alert(`Kliknięto szafkę numer ${index + 1.5}`)}
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
                    style={randomNumbers[index * lockerNum + 1] < 0.3 ? {backgroundColor: 'red', cursor: 'default'} : null}
                    onClick={randomNumbers[index * lockerNum + 1] < 0.3 ? null : () => alert(`Kliknięto szafkę numer ${index + 1}`)}
                ></div>
                )
            ))}
            </div>
        </div>
    )
}

export default PackageLocker