import { useEffect, useState } from "react"

const WebSocketComponent = ({ setFilteredPackages, setFilteredDeliveredPackages }) => {
    const [message, setMessage] = useState("")

    useEffect(() => {
        const ws = new WebSocket("wss://localhost:3001")

        ws.onopen = () => console.log("Połączono z WebSocket (WSS)")
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data)
            console.log("Otrzymano dane:", data)
            if (data.status !== "Delivered") {
                data.status = "Delivered"
            }
            if (data.status === "Delivered") {
                setFilteredPackages((prevPackages) =>
                    prevPackages.filter(pkg => pkg.id !== data.id) 
                );
    
                setFilteredDeliveredPackages((prevDeliveredPackages) =>
                    [...prevDeliveredPackages, data] 
                );
            } else {
                console.log("Status paczki:", data.status)
            }
        }
        ws.onclose = () => console.log("Połączenie WebSocket zamknięte")

        return () => ws.close()
    }, [])

    return <div>{message}</div>
}

export default WebSocketComponent
