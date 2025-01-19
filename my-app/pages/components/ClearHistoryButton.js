const ClearHistoryButton = () => {
    const clearHistory = async () => {
        const userConfirm = confirm("Are you sure you want to clear all history?")
        if (userConfirm) {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_DATABASE_API}/api/deleteAllPackages`, {
                    method: "DELETE",
                    headers: {"Content-Type": "application/json"},
                    credentials: "include"
                })
                const data = await response.json()
                console.log(data)
                window.location.reload()
            } catch (error) {
                console.error("error clearing history: ", error)
            }
        }
    }
    return (
        <button 
            className="button-main-2"
            onClick={() => clearHistory()}
        >Clear history</button>
    )
}
export default ClearHistoryButton