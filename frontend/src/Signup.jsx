import "./Auth.css";
import { useState, useContext } from "react";
import { AuthContext } from "./AuthContext.jsx";

function Signup({ onClose, onSwitchToLogin }) {

    const { login } = useContext(AuthContext);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSignup = async (e) => {
        e.preventDefault();

        setError("");

        if (!name || !email || !password) {
            setError("Please fill all fields");
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(
                "https://nexa-ai-q9xv.onrender.com/api/signup",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        name,
                        email,
                        password
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Signup failed");
                return;
            }

            // ==============================
            // AUTO LOGIN AFTER SIGNUP
            // ==============================

            login(data.user, data.token);

            // Close signup popup
            onClose();

        } catch (err) {
            console.log(err);
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
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
                    <h2>Create your account</h2>
                    <p>Join Nexa AI and start chatting</p>
                </div>

                <form onSubmit={handleSignup}>

                    <div className="formGroup">
                        <label>Name</label>

                        <input
                            type="text"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className="formGroup">
                        <label>Email</label>

                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="formGroup">
                        <label>Password</label>

                        <input
                            type="password"
                            placeholder="Create a password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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
                        disabled={loading}
                    >
                        {loading
                            ? "Creating Account..."
                            : "Create Account"}
                    </button>

                </form>

                <p className="switchAuth">
                    Already have an account?

                    <button
                        type="button"
                        onClick={onSwitchToLogin}
                    >
                        Login
                    </button>
                </p>

            </div>

        </div>
    );
}

export default Signup;