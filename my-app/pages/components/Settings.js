import { useState, useEffect } from "react"
import { useRouter } from "next/router"

const Settings = () => {
    const router = useRouter()
    const handle = () => {

    }

    return (
        <div className="addPackage-main">
            <div className="addPackage-main-2">
                <p>Settings</p>
                <form onSubmit={handle}>
                    <input
                        type="text"
                        placeholder="Package number"
                        className="addPackage-pNumber"
                    />
                    <input
                        type="text"
                        placeholder="Package name"
                        className="addPackage-pName"
                    />
                    <button
                        className="addPackage-addButton"
                        type="submit"
                    >
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Settings
