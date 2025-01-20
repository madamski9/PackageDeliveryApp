import { useEffect, useState } from "react"

const WebSocketComponent = ({ setFilteredPackages, setFilteredDeliveredPackages, setSelectedPackages, setfetchPackage }) => {
    useEffect(() => {
        const ws = new WebSocket("wss://localhost:3001")

        ws.onopen = () => console.log("Połączono z WebSocket (WSS)")

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data)

            if (data.status === "Sent") {
                data.status = "Accepted for execution"
            } else if (data.status === "Accepted for execution") {
                data.status = "On the way"
            } else if (data.status === "On the way") {
                data.status = "Delivered"
            }

            console.log("Otrzymano status paczki: ", data.status)

            localStorage.setItem("selectedPackage", JSON.stringify(data))

            setSelectedPackages(data)

            if (data.status === "Delivered") {
                setFilteredPackages((prevPackages) =>
                    prevPackages.filter(pkg => pkg.id !== data.id)
                )

                setfetchPackage(data)

                setFilteredDeliveredPackages((prevDeliveredPackages) =>
                    [...prevDeliveredPackages, data]
                )
            }
        }

        ws.onclose = () => console.log("Połączenie WebSocket zamknięte")

        return () => ws.close()
    }, [setSelectedPackages, setFilteredPackages, setFilteredDeliveredPackages])

    return null
}

export default WebSocketComponent
