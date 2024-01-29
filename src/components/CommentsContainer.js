import React, { useEffect, useState } from "react";
import Comment from "./Comment";
import { COMMENTS_API_URL } from "../utils/constants";


let commentsData = []
const CommentList = ({comments})=>{
    return comments.map((comment, index)=>(
        <div key={index}>
            <Comment data={comment}/>
            <div className="pl-5 border border-l-black ml-5">
                <CommentList comments = {comment.replies} />
            </div>
         </div>
    ))
};

const CommentsContainer = ({videoID})=>{
    const [commentThreads,setCommentThreads] = useState([])

    const makeCommentsDataList = ()=>{
        commentsData = []
        console.log("inside make comment list")
        // console.log(commentThreads)
        commentThreads.map((comment)=>{
            // console.log("mapping comments- ")
            // console.log(comment)
            const comment_replies = []
            if(comment.snippet.totalReplyCount > 0){
                comment.replies.comments.map((reply)=>{
                    const replyObject = {
                        name: reply.snippet.authorDisplayName,
                        text: reply.snippet.textDisplay,
                        userImgUrl: reply.snippet.authorProfileImageUrl,
                        replies: []
                    }
                    comment_replies.push(replyObject)
                })
            }
            const commentObject = {
                name: comment.snippet.topLevelComment.snippet.authorDisplayName,
                text: comment.snippet.topLevelComment.snippet.textDisplay,
                userImgUrl: comment.snippet.topLevelComment.snippet.authorProfileImageUrl,
                replies: comment_replies
            }

            console.log("comment object- ")
            console.log(commentObject)

            commentsData.push(commentObject)
        })
    }
    useEffect(()=>{
        console.log("commentThreads- ")
        console.log(commentThreads)
        makeCommentsDataList();
    },[commentThreads])

    const getCommentThreads = async()=>{
        console.log("making api call to- "+COMMENTS_API_URL+videoID)
        const data = await fetch(COMMENTS_API_URL+videoID)
        const jsonData = await data.json()
        // console.log(jsonData.items.filter((item) => item.snippet.totalReplyCount > 0))
        setCommentThreads(jsonData.items)
        // console.log("commentThreads- ")
        // console.log(commentThreads)
        // makeCommentsDataList();
    }

    useEffect(()=>{
        getCommentThreads();
    },[videoID])
    return (
        <div className="m-5 p-2">
            <h1 className="text-2xl font-bold">Comments</h1>
            <CommentList comments = {commentsData}/>
        </div>
    )
}

export default CommentsContainer