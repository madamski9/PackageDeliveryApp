import { useRouter } from "next/router"
import DeleteButton from "./DeleteButton"
const Overview = ({ fetchUser, filteredPackages, handlePackageSelection}) => {
    const router = useRouter()
    return (
        <div className="overview-grid">
            <div className="overview-main-1">
                <p className="addNewPackage">Add new package</p>
                <button
                    className="addPackageButton"
                    onClick={(e) => {
                        e.preventDefault()
                        router.push("/addPackage")
                    }}
                >
                    <img className="plus" src="/images/plus.png"/>
                </button>
                <img className="box2" src="/images/logistics.png"/>
            </div>
            <div className="overview-main-2">
                <p className="yourPersDat">Your personal data</p>
                    <div className="user-data">
                        {fetchUser.length > 0 ? (
                            fetchUser.map((user, index) => (
                                <div key={index}>
                                    <p>Name: {user.name}</p>
                                    <p>Surname: {user.surname}</p>
                                    <p>Phone: {user.phone}</p>
                                    <p>Address: {user.addres}</p>
                                </div>
                            ))
                        ) : (
                            <p>No user data</p>
                        )}
                    </div>
            </div>
            <div className="overview-main-3">
                <p className="addNewPackage">Your packages</p>
                <div className="user-packages">
                    {filteredPackages.length > 0 ? (
                        filteredPackages.map((pkg, index) => (
                            <div key={index}>
                                <button 
                                    className="packages-overview"
                                    onClick={() => handlePackageSelection(pkg)}
                                >
                                    <div className="div-over">
                                        <img className="truck" src="/images/delivery.png"/>
                                        <p>Number: {pkg.number}</p>
                                        <p>Name: {pkg.name}</p>
                                    </div>
                                    <DeleteButton pkg={pkg}/>
                                </button>
                            </div>
                        ))
                    ) : (
                        <p>No packages avaible</p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Overview