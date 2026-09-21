import { useContext, useState,useEffect,useRef} from "react";
import { MyContext } from "./MyContext.jsx";
import { AuthContext } from "./AuthContext.jsx";
import { ScaleLoader } from "react-spinners";
import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import Login from "./Login.jsx";
import Signup from "./Signup.jsx";

function ChatWindow() {

    // Login and Signup popup states
    const [showLogin, setShowLogin] = useState(false);
    const [showSignup, setShowSignup] = useState(false);

    // User dropdown state
    const [showMenu, setShowMenu] = useState(false);
    const { user, token, logout } = useContext(AuthContext);
    const previousUser = useRef(user);

    // Context values
    const {
        prompt,
        setPrompt,
        reply,
        setReply,
        currThreadId,
        prevChats,
        setPrevChats,
        setNewChat
    } = useContext(MyContext);

    const [loading, setLoading] = useState(false);

    const getReply = async () => {
        setLoading(true);
        setNewChat(false)
        console.log(
            "message ",
            prompt,
            " threadId ",
            currThreadId
        );

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: prompt,
                threadId: currThreadId
            })
        };
         if(token){
        options.headers.Authorization = `Bearer ${token}`;
        }
        try {
            const response = await fetch(
                "https://nexa-ai-q9xv.onrender.com/api/chat",
                options
            );

            const res = await response.json();

            console.log(res);

            setReply(res.reply);

        } catch (err) {
            console.log(err);
        }

        setLoading(false);
    };
    useEffect(() => {

    // Guest -> Logged-in user
    if (!previousUser.current && user) {
        setPrevChats([]);
        setReply(null);
        setPrompt("");
        setNewChat(true);
    }

    // Logged-in user -> Guest
    if (previousUser.current && !user) {
        setPrevChats([]);
        setReply(null);
        setPrompt("");
        setNewChat(true);
    }

    previousUser.current = user;

}, [user]);
    //append new chat to prevChats
    useEffect(() => {
        if(prompt && reply) {
            setPrevChats(prevChats => (
                [...prevChats, {
                    role: "user",
                    content: prompt
                },{
                    role: "assistant",
                    content: reply
                }]
            ));
        }

        setPrompt("");
    }, [reply]);


    return (
        <div className="chatWindow">

            {/* ================= NAVBAR ================= */}

            <div className="navbar">
                 <button
        className="mobileMenuBtn"
        onClick={() => {
            window.dispatchEvent(new Event("openSidebar"));
        }}
    >
        <i className="fa-solid fa-bars"></i>
    </button>
                {/* Nexa AI */}
                <span className="nexaTitle">
                    Nexa AI
                    <i className="fa-solid fa-chevron-down"></i>
                </span>


                {/* ================= USER MENU ================= */}

                <div className="userIconDiv">

                    {/* User Icon */}
                    <div
                        className="userIcon"
                        onClick={() => setShowMenu(!showMenu)}
                    >
                        <i className="fa-solid fa-user"></i>
                    </div>


                    {/* Dropdown */}
                    {showMenu && (
    <div className="dropdown">

        {!user ? (

            <>
                {/* LOGIN */}
                <button
                    onClick={() => {
                        setShowLogin(true);
                        setShowMenu(false);
                    }}
                >
                    <span>Login</span>
                    <i className="fa-solid fa-right-to-bracket"></i>
                </button>


                {/* SIGN UP */}
                <button
                    onClick={() => {
                        setShowSignup(true);
                        setShowMenu(false);
                    }}
                >
                    <span>Sign Up</span>
                    <i className="fa-solid fa-user-plus"></i>
                </button>
            </>

        ) : (

            <>
                {/* PROFILE */}
                <button
                    onClick={() => {
                        console.log("Profile clicked");
                        setShowMenu(false);
                    }}
                >
                    <span>Profile</span>
                    <i className="fa-solid fa-user"></i>
                </button>


                {/* SETTINGS */}
                <button
                    onClick={() => {
                        console.log("Settings clicked");
                        setShowMenu(false);
                    }}
                >
                    <span>Settings</span>
                    <i className="fa-solid fa-gear"></i>
                </button>


                {/* LOGOUT */}
                <button
                    onClick={() => {
                        logout();
                        setShowMenu(false);
                    }}
                >
                    <span>Logout</span>
                    <i className="fa-solid fa-right-from-bracket"></i>
                </button>
            </>

        )}

    </div>
)}

                </div>

            </div>


            {/* ================= CHAT ================= */}

            <Chat />

            <ScaleLoader
                color="#fff"
                loading={loading}
            >
            </ScaleLoader>


            {/* ================= CHAT INPUT ================= */}

            <div className="chatInput">

                <div className="inputBox">

                    <input
                        placeholder="Ask Anything"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={(e) =>
                            e.key === "Enter" ? getReply() : ""
                        }
                    />

                    <div
                        id="submit"
                        onClick={getReply}
                    >
                        <i className="fa-solid fa-paper-plane"></i>
                    </div>

                </div>

                <p className="info">
                    Nexa AI can make mistakes. Check important info.
                </p>

            </div>


            {/* ================= LOGIN ================= */}

            {showLogin && (
                <Login
                    onClose={() => setShowLogin(false)}

                    onSwitchToSignup={() => {
                        setShowLogin(false);
                        setShowSignup(true);
                    }}
                />
            )}


            {/* ================= SIGNUP ================= */}

            {showSignup && (
                <Signup
                    onClose={() => setShowSignup(false)}

                    onSwitchToLogin={() => {
                        setShowSignup(false);
                        setShowLogin(true);
                    }}
                />
            )}

        </div>
    );
}

export default ChatWindow;