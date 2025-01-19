import { useState } from "react"
import { useRouter } from "next/router"

const RegisterPage = () => {
    const [name, setName] = useState("")
    const [surname, setSurname] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [phone, setPhone] = useState("")
    const [addres, setAddres] = useState("")
    const [error, setError] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const router = useRouter()

    const isEmailValid = (email) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        return emailRegex.test(email)
    }
    const handleSumbit = async (e) => {
        e.preventDefault()
        if (!name || !surname || !password || !phone || !addres || !email) {
            setError("All fields are required!")
            return
        }
        if (!isEmailValid(email)) {
            setError("Please enter correct email")
            return
        }
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_DATABASE_API}/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, surname, email, password, phone, addres})
            })

            if (response.ok) {
                console.log("Registration successful")
                router.push("/?page=home")
            } else {
                if (response.status === 409) {
                    setError("Username already taken")
                } else {
                    setError("Phone number must be integer")
                }
            }
        } catch (error) {
            console.error(error)
            setError("Something went wrong with database")
        }
    }

    return (
        <div className="main">
            <img 
                src="/images/package.png" 
                className="box"/>
            <form onSubmit={handleSumbit} className="form"> 
                <div className="name-surname-div">
                    <input
                        type="text"
                        placeholder="Imie"
                        className="input-name"
                        onChange={(e) => setName(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Nazwisko"
                        className="input-surname"
                        onChange={(e) => setSurname(e.target.value)}
                    />
                </div>
                <input
                    type="text"
                    placeholder="Email"
                    className="input-address"
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Ulica"
                    className="input-address"
                    onChange={(e) => setAddres(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Numer telefonu"
                    className="input-phone"
                    onChange={(e) => setPhone(e.target.value)}
                />
                <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Hasło"
                    className="input-phone"
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button 
                    className="button-eye2"
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <img className="eye" src="/images/hidden.png"/> : <img className="eye" src="/images/eye-2.png"/>}
                </button>
                <div className="buttons">
                    <button 
                        className="register-button2"
                        type="submit"
                    >
                        Zarejestruj się
                    </button>
                </div>
                {error && <div className="error">{error}</div>}
            </form>
        </div>
    )
}

export default RegisterPage