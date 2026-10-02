import { useState, useEffect } from "react";

const mobileCSS = `
/* Hidden on desktop */
.mobMenuBtn,
.mobBackdrop {
    display: none;
}

@media (max-width: 768px) {

    /* ---------- Layout ---------- */
    .app .chatWindow {
        height: 100dvh;
        min-width: 0;
    }

    /* ---------- Hamburger ---------- */
    .mobMenuBtn {
        display: flex;
        align-items: center;
        justify-content: center;
        position: fixed;
        top: 1rem;
        left: 10px;
        width: 40px;
        height: 40px;
        margin: 0;
        padding: 0;
        border: none;
        background: transparent;
        color: #ececec;
        font-size: 20px;
        z-index: 100;
    }

    /* Make room for the hamburger next to the title */
    .app .nexaTitle {
        margin: 1rem 0.75rem 1rem 3.2rem;
    }

    .app .userIconDiv {
        margin: 1rem;
    }

    /* ---------- Sidebar drawer ---------- */
    .app .sidebar {
        position: fixed;
        top: 0;
        left: 0;
        height: 100dvh;
        width: 280px;
        max-width: 85vw;
        z-index: 200;
        transform: translateX(-100%);
        transition: transform 0.25s ease;
    }

    .app .sidebar.open {
        transform: translateX(0);
    }

    .mobBackdrop {
        display: block;
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.6);
        z-index: 150;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.25s ease;
    }

    .mobBackdrop.show {
        opacity: 1;
        pointer-events: auto;
    }

    .app .history li {
        padding: 6px 30px 6px 5px;
    }

    /* ---------- Chat area ---------- */
    .app .chats {
        flex: 1;
        min-height: 0;
        width: 100%;
        max-width: 100%;
        box-sizing: border-box;
        padding: 1rem;
    }

    .app .userMessage {
        margin-left: 2rem;
        max-width: 85%;
        padding: 10px 14px;
        overflow-wrap: anywhere;
    }

    .app .gptDiv {
        overflow-wrap: anywhere;
    }

    .app .gptDiv pre {
        overflow-x: auto;
    }

    .app .gptDiv table {
        display: block;
        overflow-x: auto;
    }

    .app .welcome {
        padding: 0 1rem;
    }

    .app .welcome h1 {
        font-size: 1.6rem;
    }

    .app .welcome p {
        font-size: 16px;
    }

    /* ---------- Input bar ---------- */
    .app .chatInput {
        padding: 0 12px;
        box-sizing: border-box;
    }

    /* 16px stops iOS Safari from zooming on focus */
    .app .chatInput input {
        font-size: 16px;
        padding: 16px 50px 16px 16px;
        box-sizing: border-box;
    }

    .app #submit {
        height: 44px;
        width: 44px;
        right: 6px;
    }

    .app .info {
        font-size: 0.7rem;
        padding: 0.4rem 0;
        margin: 0;
    }
}

/* Touch screens have no hover, so always show the delete icon */
@media (hover: none) {
    .app .fa-trash {
        opacity: 0.7;
        right: 5px;
    }
}

/* ---------- Login / Signup popup ---------- */
@media (max-width: 480px) {
    .authCard {
        padding: 24px 18px;
        max-width: 92%;
        box-sizing: border-box;
    }

    .authHeader h2 {
        font-size: 22px;
    }

    .formGroup input {
        font-size: 16px;
    }
}
`;

function Mobile() {
    const [open, setOpen] = useState(false);

    // Open / close the existing sidebar by toggling its "open" class
    useEffect(() => {
        const sidebar = document.querySelector(".sidebar");
        if (sidebar) sidebar.classList.toggle("open", open);
    }, [open]);

    useEffect(() => {
        // Close the drawer after choosing a chat or starting a new one
        const handleClick = (e) => {
            const t = e.target;
            if (t.closest(".fa-trash")) return;
            if (t.closest(".sidebar li") || t.closest(".sidebar > button")) {
                setOpen(false);
            }
        };

        // Close the drawer if the screen grows to desktop size
        const handleResize = () => {
            if (window.innerWidth > 768) setOpen(false);
        };

        document.addEventListener("click", handleClick);
        window.addEventListener("resize", handleResize);

        return () => {
            document.removeEventListener("click", handleClick);
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <>
            <style>{mobileCSS}</style>

            <button
                className="mobMenuBtn"
                onClick={() => setOpen(true)}
                aria-label="Open menu"
            >
                <i className="fa-solid fa-bars"></i>
            </button>

            <div
                className={`mobBackdrop ${open ? "show" : ""}`}
                onClick={() => setOpen(false)}
            ></div>
        </>
    );
}

export default Mobile;