import DeleteButton from "./DeleteButton"

const History = ({ filteredDeliveredPackages, handlePackageSelection}) => {
    return (
        <div className="history-div">
            {filteredDeliveredPackages.length > 0 ? (
                filteredDeliveredPackages.map((pkg, index) => (
                    <div className="packages-history" key={index}>
                        <button 
                            className="packages-history-button"
                            onClick={() => handlePackageSelection(pkg)}
                        >
                            <img className="truck" src="/images/delivery.png"/>
                            <p>Number: {pkg.number}</p>
                            <p>Name: {pkg.name}</p>
                            <p>Locker number: {pkg.lockernumber}</p>
                            <DeleteButton pkg={pkg}/>
                        </button>
                    </div>
                ))
            ) : (
                <p>No packages avaible</p>
            )}
        </div>
    )
}

export default History