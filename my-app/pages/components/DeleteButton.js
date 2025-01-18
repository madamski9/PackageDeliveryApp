const DeleteButton = ({ pkg }) => {
    const handleTrashClick = (e, num) => {
        e.stopPropagation()
        const result = confirm("Are you sure you want to delete this package?")
        if (result) {
            fetchDeletePackages(num)
        }
    }
    const fetchDeletePackages = async (number) => {
        const storedPackages = JSON.parse(localStorage.getItem("packages")) || []
        const updatedPackages = storedPackages.filter(pkg => pkg.number !== number)
        console.log(updatedPackages)
        localStorage.setItem("packages", JSON.stringify(updatedPackages))
        try {
            const result = await fetch(`${process.env.NEXT_PUBLIC_DATABASE_API}/api/deletePackage`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ number})
            })
            if (!result.ok) {
                throw new Error("Failed to delete package");
            }

            const data = await result.json()
            console.log(data)
            window.location.reload()
        } catch (error) {
            console.error("error deleting package: ", error)
        }
    }
    return (
        <div 
            className="trash"
            onClick={(e) => handleTrashClick(e, pkg.number)}
        ><img className="trash-img" src="/images/trash.png"/></div>
    )
}

export default DeleteButton