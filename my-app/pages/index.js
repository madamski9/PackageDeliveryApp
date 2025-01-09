import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useRouter } from "next/router"

const HomePage = () => {
    const searchParams = useSearchParams()
    const router = useRouter()
    const page = searchParams.get("page")
    const [login, setLogin] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    console.log(login, password)
    
    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!login || !password) {
            setError("Wszystkie pola są wymagane!");
            return;
        }
        console.log("submit dziala")
        try {
            const response = await fetch(`http://localhost:3001/home`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: login, password: password })
            })
            if (response.ok) {
                console.log("Login successful")
                router.push("/mainPage")
            } else {
                setError("error during logging in")
            }
        } catch (error) {
            console.error(error)
            setError("Something went wrong with database")
        }
    }

    useEffect(() => {
        console.log("useEffect dziala")
        if (!page || page !== "home") {
            router.replace("/?page=home");
        }
    }, [page, router]) 

    return (
        <div className="main">
            <img 
                src="/images/package.png" 
                className="box"/>
            <form onSubmit={handleSubmit} className="form">
                <input
                    type="text"
                    placeholder="Login"
                    className="input-login"
                    onChange={(e) => setLogin(e.target.value)}
                />
                <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Hasło"
                    className="input-passw"
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button 
                    className="button-eye"
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <img className="eye" src="/images/hidden.png"/> : <img className="eye" src="/images/eye-2.png"/>}
                </button>
                <div className="buttons">
                    <button 
                        className="register-button"
                        onClick={e => {
                            e.preventDefault()
                            router.push("/register")}}
                    >
                        Zarejestruj się
                    </button>
                    <button 
                        className="login-button"
                        type="submit"
                    >
                        Zaloguj się
                    </button>
                </div>
            </form>
            {error && <div className="error">{error}</div>} 
        </div>
    )
}

export default HomePage