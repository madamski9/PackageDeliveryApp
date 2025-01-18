import { useState, useEffect } from "react"
import { useRouter } from "next/router"

const AddPackage = () => {
    const router = useRouter()
    const [packageNumber, setPackageNumber] = useState("")
    const [packageName, setPackageName] = useState("")
    const [error, setError] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [countdown, setCountdown] = useState(0)
    const [packageStatus, setPackageStatus] = useState("")

    useEffect(() => {
        const lastSubmitTime = localStorage.getItem("lastSubmitTime")
        if (lastSubmitTime) {
            const elapsedTime = Math.floor((Date.now() - lastSubmitTime) / 1000)
            if (elapsedTime < 5) {
                setCountdown(5 - elapsedTime)
                setIsSubmitting(true)
            }
        }
    }, [])

    useEffect(() => {
        if (countdown > 0) {
            const timer = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer)
                        setIsSubmitting(false)
                        return 0
                    }
                    return prev - 1
                })
            }, 1000)
            return () => clearInterval(timer)
        }
    }, [countdown])

    const handleAddPackageSubmit = async (e) => {
        e.preventDefault()

        if (isSubmitting) return

        if (!packageName || !packageNumber) {
            setError("Type something")
            return
        }

        setIsSubmitting(true)
        setCountdown(5)
        localStorage.setItem("lastSubmitTime", Date.now())

        const number = Math.floor(Math.random() * 3) + 1 

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_DATABASE_API}/api/addPackage`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: packageName, number: packageNumber, packageLocker: number }),
                credentials: "include"
            })

            if (response.ok) {
                console.log("Package added")
                router.push("/mainPage")
            } else {
                setError("Something went wrong when adding package")
            }
        } catch (error) {
            console.error(error)
            setError("Error when submitting")
        }
    }

    return (
        <div className="addPackage-main">
            <div className="addPackage-main-2">
                <p>Add new package</p>
                <form onSubmit={handleAddPackageSubmit}>
                    <input
                        type="text"
                        placeholder="Package number"
                        className="addPackage-pNumber"
                        value={packageNumber}
                        onChange={(e) => setPackageNumber(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Package name"
                        className="addPackage-pName"
                        value={packageName}
                        onChange={(e) => setPackageName(e.target.value)}
                    />
                    <button
                        className="addPackage-addButton"
                        type="submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? `Wait ${countdown}s...` : "Add"}
                    </button>
                </form>
                {error && <div className="error">{error}</div>}
            </div>
        </div>
    )
}

export default AddPackage
