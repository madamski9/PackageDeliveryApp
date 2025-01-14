const History = ({ filteredDeliveredPackages,  }) => {
    return (
        <div className="history-div">
            {filteredDeliveredPackages.length > 0 ? (
                filteredDeliveredPackages.map((pkg, index) => (
                    <div className="packages-history" key={index}>
                        <button className="packages-history-button">
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
    )
}

export default History