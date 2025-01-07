import { useState } from "react"
const RegisterPage = () => {
    const [name, setName] = useState("")
    const [surname, setSurname] = useState("")
    const [password, setPassword] = useState("")
    const [phone, setPhone] = useState("")
    const [addres, setAddres] = useState("")
    const [error, setError] = useState("")

    const handleSumbit = (e) => {
        e.preventDefault()
        if (!name || !surname || !password || !phone || !addres) {
            setError("Wszystkie pola są wymagane!")
            return
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
                    type="text"
                    placeholder="Hasło"
                    className="input-phone"
                    onChange={(e) => setPassword(e.target.value)}
                />
                <div className="buttons">
                    <button className="register-button2">
                        Zarejestruj się
                    </button>
                </div>
                {error && <div className="error">{error}</div>}
            </form>
        </div>
    )
}

export default RegisterPage