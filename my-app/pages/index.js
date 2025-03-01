import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import dotenv from "dotenv"
dotenv.config()

const HomePage = () => {
    const searchParams = useSearchParams()
    const router = useRouter()
    const page = searchParams.get("page")
    const [login, setLogin] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    
    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!login || !password) {
            setError("Wszystkie pola są wymagane!");
            return;
        }
        console.log("submit dziala")
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_DATABASE_API}/home`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: login, password: password }),
                credentials: "include"
            })
            if (response.ok) {
                const data = await response.json()
                console.log("Login successful")
                localStorage.setItem("userId", data.id)
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
                    placeholder="Email"
                    className="input-login"
                    onChange={(e) => setLogin(e.target.value)}
                />
                <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    className="input-passw"
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button 
                    className="button-eye"
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <img className="eye" src="/images/hidden.png"/> : <img className="eye" src="/images/eye-2.png"/>}
                </button>
                <div 
                    style={{display: "flex"}}
                    className="buttons">
                    <button 
                        style={{padding: "5px 10px"}}
                        className="register-button"
                        onClick={e => {
                            e.preventDefault()
                            router.push("/register")}}
                    >
                        Register     
                    </button>
                    <button 
                        style={{marginLeft: "60px", padding: "0px 10px"}}
                        className="login-button"
                        type="submit"
                    >
                        Log in
                    </button>
                </div>
            </form>
            {error && <div className="error">{error}</div>} 
        </div>
    )
}

export default HomePage