import { useState, useEffect } from "react"

const PackageLocker = ({ fetchPackage, longDivVisible, setLongDivVisible, handlePackageSelection, setfetchPackage }) => {
    const [lockerNum, setLockerNum] = useState(0)
    const [lockerInfo, setLockerInfo] = useState("")
    const [packageClicked, setPackageClicked] = useState(false)
    const [selectedLocker, setSelectedLocker] = useState(null)
    const [confirmVisible, setConfirmVisible] = useState(false)
    const [occupiedLockers, setOccupiedLockers] = useState([])
    const [randomNumbers1, setRandomNumbers1] = useState([])
    const [randomNumbers2, setRandomNumbers2] = useState([])
    const [randomNumbers3, setRandomNumbers3] = useState([])
    const [packageIdx, setPackageIdx] = useState(0)
    const [packageNumber, setPackageNumber] = useState(0)

    const getOrGenerateRandomNumbers = (key) => {
        let data = JSON.parse(sessionStorage.getItem(key))
        if (!data) {
            data = Array.from({ length: 70 }, () => Math.random())
            sessionStorage.setItem(key, JSON.stringify(data))
        }
        return data
    }

    const handlePackageClick = (e, num) => {
        setLockerNum(e)
        setLockerInfo("Choose locker you want package to be delivered to")
        setPackageClicked(true)
        setLongDivVisible(!longDivVisible)
    }

    const handleLockerClick = (idx) => {
        if (occupiedLockers.includes(idx)) return

        const result = confirm(`Are you sure you want locker number ${idx}?`)
        if (result) {
            setSelectedLocker(idx)
            setConfirmVisible(true)
        }
    }

    const handleConfirmSelection = async (idx) => {
        const updatedNumbers =
            lockerNum === 1 ? [...randomNumbers1] : lockerNum === 2 ? [...randomNumbers2] : [...randomNumbers3]
        updatedNumbers[selectedLocker] = 0

        if (lockerNum === 1) setRandomNumbers1(updatedNumbers)
        if (lockerNum === 2) setRandomNumbers2(updatedNumbers)
        if (lockerNum === 3) setRandomNumbers3(updatedNumbers)

        setConfirmVisible(false)
        setSelectedLocker(null)
        setOccupiedLockers((prevOccupied) => {
            const updatedOccupied = [...prevOccupied, idx]
            sessionStorage.setItem("occupiedLockers", JSON.stringify(updatedOccupied))
            return updatedOccupied
        })

        setfetchPackage((prevPackages = []) => {
            const updatedPackages = prevPackages
                .map((pkg) => (pkg.number === packageNumber ? { ...pkg, lockerStatus: "gray" } : pkg))
                .sort((a, b) => (a.lockerStatus === "gray" ? 1 : -1))

            return updatedPackages
        })

        savePackageToLocalStorage({ number: packageNumber, lockerStatus: "gray", packagelocker: idx })

        try {
            const result = await fetch(`${process.env.NEXT_PUBLIC_DATABASE_API}/api/addLockerNumber`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ lockernumber: idx, number: packageNumber }),
            })

            if (result.ok) {
                console.log(await result.json())
            } else {
                console.error("Błąd podczas zapisu do API")
            }
        } catch (error) {
        }
    }

    const savePackageToLocalStorage = (pkg) => {
        const userId = localStorage.getItem("userId")
        if (!userId) return

        const storedPackages = JSON.parse(localStorage.getItem(`userPackages_${userId}`)) || []

        if (!Array.isArray(storedPackages)) {
            console.error("Błąd: storedPackages nie jest tablicą!", storedPackages)
            return
        }

        const updatedPackages = [
            ...storedPackages.filter((existingPkg) => existingPkg.number !== pkg.number),
            { ...pkg, userId },
        ]

        localStorage.setItem(`userPackages_${userId}`, JSON.stringify(updatedPackages))

        console.log("Zapisano paczki dla userId:", userId, updatedPackages)
    }

    useEffect(() => {
        setLockerInfo("Choose package")

        const occupied = JSON.parse(sessionStorage.getItem("occupiedLockers")) || []
        setOccupiedLockers(occupied)

        setRandomNumbers1(getOrGenerateRandomNumbers("random_1"))
        setRandomNumbers2(getOrGenerateRandomNumbers("random_2"))
        setRandomNumbers3(getOrGenerateRandomNumbers("random_3"))
    }, [])

    useEffect(() => {
        const userId = localStorage.getItem("userId")
        if (!userId) return

        const storedPackages = JSON.parse(localStorage.getItem(`userPackages_${userId}`)) || []

        const grayPackages = storedPackages.filter((pkg) => pkg.lockerStatus === "gray" && pkg.userId === userId)

        if (grayPackages.length > 0) {
            setfetchPackage((prevPackages = []) =>
                prevPackages.map((pkg) =>
                    grayPackages.some((grayPkg) => grayPkg.number === pkg.number) ? { ...pkg, lockerStatus: "gray" } : pkg
                )
            )
        }
    }, [])

    const getLockerStyle = (index) => {
        const currentRandomNumbers =
            lockerNum === 1 ? randomNumbers1 : lockerNum === 2 ? randomNumbers2 : randomNumbers3

        if (currentRandomNumbers[index] === 0 || currentRandomNumbers[index] < 0.3 || occupiedLockers.includes(index)) {
            return { backgroundColor: "red", cursor: "default" }
        }

        if (index === selectedLocker) {
            return { backgroundColor: "green", cursor: "pointer" }
        }
        return packageClicked ? null : { cursor: "default" }
    }

    //! paczkomat mapa stylow
    const lockerLayout = [
        "top",
        "large l", "large", "large", "large", "large", "large", "large", "large r",
        "normal l", "normal", "normal", "normal", "normal", "normal", "normal", "normal r",
        "normal l", "normal", "normal", "normal", "normal", "normal", "normal", "normal r", 
        "normal l", "normal", "normal", "normal", "normal", "normal", "normal", "normal r", 
        "normal l", "normal", "normal", "normal", "normal", "normal", "normal", "normal r",
        "normal l", "normal", "normal", "normal", "normal", "normal", "normal", "normal r",
        "large ld", "large d", "large d", "large d", "large d", "large d", "large d", "large rd",
    ]

    return (
        <div className="locker-main">
            <div className="locker-packages">
                <div>
                    Packages to choose locker:
                </div>
                {fetchPackage.length > 0 ? (
                    fetchPackage.map((pkg, index) => (
                        <div key={index}>
                            <button
                                className="packages-locker"
                                style={{
                                    backgroundColor: pkg.lockerStatus === "gray" ? "gray" : "white",
                                    cursor: pkg.lockerStatus === "gray" ? "default" : "pointer",
                                }}
                                onClick={() => {
                                    if (pkg.lockerStatus !== "gray") {
                                        handlePackageSelection(pkg)
                                        handlePackageClick(parseInt(pkg.packagelocker), pkg.number)
                                        setPackageNumber(pkg.number)
                                    }
                                }}
                            >
                                <img className="truck" src="/images/delivery.png" />
                                <p>Number: {pkg.number}</p>
                                <p>Name: {pkg.name}</p>
                                <p>Status: {pkg.status}</p>
                            </button>
                        </div>
                    ))
                ) : (
                    <p>No packages available</p>
                )}
            </div>
            <div className="locker-info">
                {lockerInfo}
                {lockerNum > 0 ? (
                    <p>Package locker number: {lockerNum}</p>
                ) : (
                    <p></p>
                )}
            </div>
            {packageClicked && (
                <div className="locker-grid-main">
                    <div className="locker-grid">
                        {lockerLayout.map((type, index) => (
                            type === "top" ? (
                                <div key={index} className="locker top"></div>
                            ) : (
                                <div
                                    key={index}
                                    className={`locker ${type}`}
                                    style={getLockerStyle(index)}
                                    onClick={() => (handleLockerClick(index), setPackageIdx(index))}
                                ></div>
                            )
                        ))}
                        {confirmVisible && (
                            <>
                                <div className="modal"></div>
                                <button onClick={() => handleConfirmSelection(packageIdx)} className="confirm-button">
                                    Confirm Selection
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default PackageLocker
