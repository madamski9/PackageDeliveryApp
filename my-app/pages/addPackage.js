import { useState } from "react";
import { useRouter } from "next/router";

const addPackage = () => {
    const router = useRouter()
    const [packageNumber, setPackageNumber] = useState("")
    const [packageName, setPackageName] = useState("")
    const [error, setError] = useState("")
    console.log(packageName)
    console.log(packageNumber)
    
    const handleAddPackageSumbit = async (e) => {
        e.preventDefault()
        const userId = localStorage.getItem("userId")
        console.log(`uzytkownik ${userId} dodaje paczke...`)
        if (!packageName || !packageNumber) {
            setError("type smth")
        }
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_DATABASE_API}/api/addPackage`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({userId: userId, name: packageName, number: packageNumber})
            })
            if (response.ok) {
                console.log("Package added")
                router.push("/mainPage")
            } else {
                if (response.status === 500) {
                    setError("Something wrong when adding package")
                }
            }
        } catch (error) {
            console.error(error)
            setError("error when submiting")
        }
    }

    return (
        <div className="addPackage-main">
            <div className="addPackage-main-2">
                <p>Add new package</p>
                <form onSubmit={handleAddPackageSumbit}>
                    <input
                        type="text"
                        placeholder="Package number"
                        className="addPackage-pNumber"
                        onChange={(e) => setPackageNumber(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Package name"
                        className="addPackage-pName"
                        onChange={(e) => setPackageName(e.target.value)}
                    />
                    <button
                        className="addPackage-addButton"
                        type="submit"
                    >
                        add
                    </button>
                </form>
                {error && <div className="error">{error}</div>} 
            </div>
        </div>
    )
}

export default addPackage