import "./Auth.css";
import { useState, useContext } from "react";
import { AuthContext } from "./AuthContext.jsx";

function Login({ onClose, onSwitchToSignup }) {

    const { login } = useContext(AuthContext);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");

    const handleLogin = async (e) => {

        e.preventDefault();

        setError("");

        try {

            const response = await fetch(
                "http://localhost:8080/api/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Login failed");
                return;
            }

            console.log(data);

            // Save user and JWT
            login(data.user, data.token);

            // Close login popup
            onClose();

        } catch (err) {

            console.log(err);
            setError("Something went wrong. Please try again.");

        }
    };


    return (
        <div className="authOverlay">

            <div className="authCard">

                <button
                    className="closeBtn"
                    onClick={onClose}
                >
                    ×
                </button>

                <div className="authHeader">

                    <h2>Welcome back</h2>

                    <p>
                        Login to continue using Nexa AI
                    </p>

                </div>


                <form onSubmit={handleLogin}>

                    <div className="formGroup">

                        <label>Email</label>

                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            required
                        />

                    </div>


                    <div className="formGroup">

                        <label>Password</label>

                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            required
                        />

                    </div>


                    {error && (
                        <p className="authError">
                            {error}
                        </p>
                    )}


                    <button
                        type="submit"
                        className="authBtn"
                    >
                        Login
                    </button>

                </form>


                <p className="switchAuth">

                    Don't have an account?

                    <button
                        type="button"
                        onClick={onSwitchToSignup}
                    >
                        Sign up
                    </button>

                </p>

            </div>

        </div>
    );
}

export default Login;