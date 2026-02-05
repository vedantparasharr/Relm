import React from "react";
import Post from "./Post";

const Posts = ({posts, userId, profilePicture, name}) => {
  return (
    <>
      {posts.map((post) => (
        <Post
          key={post._id}
          userId={userId}
          postId={post._id}
          avatar={profilePicture}
          author={name}
          time={post.createdAt}
          title={post.title}
          excerpt={post.content}
          likes={post.likes}
          comments={post.comments}
        />
      ))}
    </>
  );
};

export default Posts;
