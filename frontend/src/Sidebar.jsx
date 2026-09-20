import "./Sidebar.css";
import logo from "./assets/logo.png";
import { useContext, useEffect } from "react";
import { MyContext } from "./MyContext";
import { AuthContext } from "./AuthContext";
import {v1 as uuidv1} from "uuid";
function Sidebar(){
   const {allThreads, setAllThreads, currThreadId, setNewChat, setPrompt, setReply, setCurrThreadId, setPrevChats} = useContext(MyContext);
   const { token } = useContext(AuthContext);

    const getAllThreads = async()=>{
        try{
            const response = await fetch("http://localhost:8080/api/thread",{
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            const res = await response.json();
            const filteredData = res.map(thread => ({threadId: thread.threadId, title: thread.title}));
            //console.log(filteredData);
            setAllThreads(filteredData);
        }
        catch(err){
            console.log(err);
        }
    }

    // 
    useEffect(()=>{
    if(token){
        getAllThreads();
    } else {
        setAllThreads([]);
    }
}, [currThreadId, token]);

     const createNewChat = () => {
        setNewChat(true);
        setPrompt("");
        setReply(null);
        setCurrThreadId(uuidv1());
        setPrevChats([]);
    }
     const changeThread = async (newThreadId) => {
        setCurrThreadId(newThreadId);

        try {
            const response = await fetch(`http://localhost:8080/api/thread/${newThreadId}`,{
                 headers: {
                "Authorization": `Bearer ${token}`
                }
            });
            const res = await response.json();
            console.log(res);
            setPrevChats(res);
            setNewChat(false)
            setReply(null)
        } catch(err) {
            console.log(err);
        }
    }   


    const deleteThread = async (threadId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/thread/${threadId}`, {
                method: "DELETE",
                 headers: {
                "Authorization": `Bearer ${token}`
                }
            });
            const res = await response.json();
            console.log(res);

            //updated threads re-render
            setAllThreads(prev => prev.filter(thread => thread.threadId !== threadId));

            if(threadId === currThreadId) {
                createNewChat();
            }

        } catch(err) {
            console.log(err);
        }
    }


    return(
        <section className="sidebar">
            <button onClick={createNewChat}>
                <img src={logo} alt="Nexa Logo" className="logo"></img>
                <span><i className="fa-solid fa-pen-to-square"></i></span>
            </button>
            <ul className="history">
                {
                        allThreads.map((thread,idx)=>(
                            <li key={idx}
                            onClick={(e)=> changeThread(thread.threadId)}
                            >{thread.title}
                            <i className="fa-solid fa-trash"
                            onClick={(e)=>{
                                e.stopPropagation(); // to stop event bubbling
                                deleteThread(thread.threadId);
                            }}
                            ></i>
                            </li>
                            
                        ))
                }
            </ul>
            <div className="sign">
                <p>By Aditya kumar &hearts;</p>
            </div>
        </section>
    )
}
export default Sidebar;