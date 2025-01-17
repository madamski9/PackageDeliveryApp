import mqtt from "mqtt"
import { useEffect, useState } from "react"

const Notifications = ({ setNotificationNumber }) => {
    const [messages, setMessages] = useState([])

    useEffect(() => {
        const storedMessages = JSON.parse(localStorage.getItem("messages") || "[]")
        setMessages(storedMessages)
        setNotificationNumber(storedMessages.length)
    }, [])

    useEffect(() => {
        const client = mqtt.connect(process.env.NEXT_PUBLIC_MQTT_BROKER_URL)
        
        client.on("connect", () => {
            console.log("Connected to MQTT")
            client.subscribe(process.env.NEXT_PUBLIC_MQTT_TOPIC, (err) => {
                if (!err) {
                    console.log(`Subscribing ${process.env.NEXT_PUBLIC_MQTT_TOPIC}`)
                }
            })
        })

        client.on("message", (topic, msg) => {
            const receivedMsg = msg.toString()
            console.log("Message from MQTT:", receivedMsg)
            
            try {
                const parsedMsg = JSON.parse(receivedMsg)
                const newMessages = [...messages, parsedMsg.message]

                localStorage.setItem("messages", JSON.stringify(newMessages))
                setMessages(newMessages)
            } catch (error) {
                console.error("Error parsing message:", error)
                const newMessages = [...messages, receivedMsg]

                localStorage.setItem("messages", JSON.stringify(newMessages))
                setMessages(newMessages)
            }
        })

        client.on("error", (error) => {
            console.error("Error from MQTT: ", error)
        })

    }, [messages])

    return (
        <div>
            <div className="notificationMsg" style={{color: 'black'}}>
                {messages.map((msg, index) => (
                    <li key={index}>{msg}</li> 
                ))}
            </div>
        </div>
    )
}

export default Notifications
