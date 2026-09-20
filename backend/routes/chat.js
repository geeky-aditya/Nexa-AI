import express from 'express';
import Thread from '../models/Thread.js';
const router = express.Router();
import getResponse from '../utils/openai.js';
import authMiddleware from "../middleware/authMiddleware.js";
import optionalAuthMiddleware from "../middleware/optionalAuthMiddleware.js";

//test
router.post("/test",async(req,res)=>{
    try{
        const thread = new Thread({
            threadId:"abc",
            title:"testing new thread",
        });
         const response = await thread.save();
         res.send(response);
    } catch(err){
        console.log(err);
        res.status(500).json({error:"Failed to save in DB"});
    }
})

//to get all threads

router.get("/thread",authMiddleware,async(req,res)=>{
    try{
        const threads = await Thread.find({userId: req.user.userId}).sort({updatedAt:-1});
        // we want threads/chats in descedning order i.e recent chat comes first so we sort according to updatedat
        res.json(threads);
    } catch(err){
        console.log(err);
        res.status(500).json({error:"Failed to fetch  threads"});
    }
})

// to get one particular chat/thread
// router.get("/thread/:threadId",async(req,res)=>{
//     const {threadId} = req.params;
//     try{
//         const thread = await Thread.findOne({threadId});
//         if(!thread){
//             return res.status(404).json({
//             error:"Thread not found"
//         });
//         }
//         res.json(thread.messages);
//     }catch(err){
//         console.log(err);
//         res.status(500).json({error:"Failed to fetch chat"});
//     }
// })
router.get("/thread/:threadId", authMiddleware, async (req, res) => {
    const { threadId } = req.params;

    try {
        const thread = await Thread.findOne({
            threadId: threadId,
            userId: req.user.userId
        });

        if (!thread) {
            return res.status(404).json({
                error: "Thread not found"
            });
        }

        res.json(thread.messages);

    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: "Failed to fetch chat"
        });
    }
});
// router.delete("/thread/:threadId/",async(req,res)=>{
//     const {threadId} = req.params;
//     try{
//         const deletedThread = await Thread.findOneAndDelete({threadId});
//         if(!deletedThread){
//             res.status(404).json({error:"Thread could not be deleted"});
//         }
//         res.status(200).json({success:"Thread deleted successfully"});
//     }
//     catch(err){
//         console.log(err);
//         res.status(500).json({error:"Failed to delete thread"});
//     }
// })
router.delete("/thread/:threadId", authMiddleware, async(req,res)=>{

    const {threadId} = req.params;

    try{

        const deletedThread = await Thread.findOneAndDelete({
            threadId: threadId,
            userId: req.user.userId
        });

        if(!deletedThread){
            return res.status(404).json({
                error:"Thread could not be deleted"
            });
        }

        res.status(200).json({
            success:"Thread deleted successfully"
        });

    }
    catch(err){

        console.log(err);

        res.status(500).json({
            error:"Failed to delete thread"
        });

    }

});

// router.post("/chat",async(req,res)=>{
//     const {threadId,message} = req.body;
//     if(!threadId || !message){
//        return res.status(400).json({
//         error:"Missing required fields"
//         });
//     }
//     try{
//         let thread = await Thread.findOne({threadId}); // if thread exits before
//         if(!thread){
//             // if thread is not find in db then it a new thread
//             thread = new Thread({
//                 threadId,
//                 title:message,
//                 messages:[{role:"user",content:message}],
//             });
//         }
//         else {
//             thread.messages.push({role:"user",content:message})
//         }
//         const assistantReply = await getResponse(message);
//         thread.messages.push({role:"assistant",content:assistantReply});
//         thread.updatedAt = new Date();
//         await thread.save();
//         res.json({reply:assistantReply});

//     }catch(err){
//         console.log(err);
//         res.status(500).json({error:"something went wrong"});
//     }
// })

// router.post("/chat", authMiddleware, async(req,res)=>{

//     const {threadId, message} = req.body;

//     if(!threadId || !message){
//         return res.status(400).json({
//             error:"Missing required fields"
//         });
//     }

//     try{

//         let thread = await Thread.findOne({
//             threadId: threadId,
//             userId: req.user.userId
//         });

//         if(!thread){

//             thread = new Thread({
//                 threadId: threadId,
//                 userId: req.user.userId,
//                 title: message,
//                 messages:[
//                     {
//                         role:"user",
//                         content:message
//                     }
//                 ]
//             });

//         }
//         else{

//             thread.messages.push({
//                 role:"user",
//                 content:message
//             });

//         }

//         const assistantReply = await getResponse(message);

//         thread.messages.push({
//             role:"assistant",
//             content:assistantReply
//         });

//         thread.updatedAt = new Date();

//         await thread.save();

//         res.json({
//             reply:assistantReply
//         });

//     }
//     catch(err){

//         console.log(err);

//         res.status(500).json({
//             error:"Something went wrong"
//         });

//     }

// });
router.post("/chat", optionalAuthMiddleware, async(req,res)=>{

    const {threadId, message} = req.body;

    if(!threadId || !message){
        return res.status(400).json({
            error:"Missing required fields"
        });
    }

    try {

        // --------------------------------
        // GUEST USER
        // --------------------------------
        if(!req.user){

            const assistantReply = await getResponse(message);

            return res.json({
                reply: assistantReply
            });
        }


        // --------------------------------
        // LOGGED-IN USER
        // --------------------------------

        let thread = await Thread.findOne({
            threadId: threadId,
            userId: req.user.userId
        });

        if(!thread){

            thread = new Thread({
                threadId: threadId,
                userId: req.user.userId,
                title: message,
                messages:[
                    {
                        role:"user",
                        content:message
                    }
                ]
            });

        }
        else{

            thread.messages.push({
                role:"user",
                content:message
            });

        }

        const assistantReply = await getResponse(message);

        thread.messages.push({
            role:"assistant",
            content:assistantReply
        });

        thread.updatedAt = new Date();

        await thread.save();

        return res.json({
            reply: assistantReply
        });

    }
    catch(err){

        console.log(err);

        return res.status(500).json({
            error:"Something went wrong"
        });

    }

});
export default router;