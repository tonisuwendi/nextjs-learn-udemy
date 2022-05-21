import { useState, useContext } from "react";

import CommentList from "./comment-list";
import { useEffect } from "react";
import NewComment from "./new-comment";
import NotificationContext from "../../store/notification-context";
import classes from "./comments.module.css";

function Comments(props) {
  const notifCtx = useContext(NotificationContext);
  const { eventId } = props;

  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    fetchDataHandler();
  }, [showComments]);

  const fetchDataHandler = () => {
    if (showComments) {
      fetch(`/api/comments/${eventId}`)
        .then((res) => res.json())
        .then((data) => setComments(data.comments));
    }
  };

  function toggleCommentsHandler() {
    setShowComments((prevStatus) => !prevStatus);
  }

  function addCommentHandler(commentData) {
    notifCtx.showNotification({
      title: "Sending comment...",
      message: "Your comment is currently being store into a database",
      status: "pending",
    });
    fetch(`/api/comments/${eventId}`, {
      method: "POST",
      body: JSON.stringify(commentData),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }

        return res.json().then((data) => {
          throw new Error(data.message || "Something went wrong!");
        });
      })
      .then((data) => {
        fetchDataHandler();
        notifCtx.showNotification({
          title: "Success!",
          message: "Your comment was saved!",
          status: "success",
        });
      })
      .catch((error) => {
        notifCtx.showNotification({
          title: "Error!",
          message: error.message || "Something went wrong!",
          status: "error",
        });
      });
  }

  return (
    <section className={classes.comments}>
      <button onClick={toggleCommentsHandler}>
        {showComments ? "Hide" : "Show"} Comments
      </button>
      {showComments && <NewComment onAddComment={addCommentHandler} />}
      {showComments && <CommentList items={comments} />}
    </section>
  );
}

export default Comments;
