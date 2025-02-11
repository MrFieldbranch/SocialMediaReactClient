import { useEffect, useState } from "react";
import { IPostToPublicBoardResponse } from "../models/IPostToPublicBoardResponse";
import socialMediaApiService from "../services/social-media-api-service"; /* Singleton */
import { IPostToPublicBoardRequest } from "../models/IPostToPublicBoardRequest";

const PublicBoardView = () => {
  const loggedInUserId = Number(localStorage.getItem("userId"));

  const [allPosts, setAllPosts] = useState<IPostToPublicBoardResponse[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isNewPostMode, setIsNewPostMode] = useState<boolean>(false);
  const [newPostTitle, setNewPostTitle] = useState<string>("");
  const [newPostContent, setNewPostContent] = useState<string>("");
  const [useEffectTrigger, setUseEffectTrigger] = useState<number>(1);

  useEffect(() => {
    const abortCont = new AbortController();

    const fetchAllPosts = async () => {
      try {
        const response = await socialMediaApiService.getAllPostsAsync(abortCont.signal);
        if (!abortCont.signal.aborted) {
          setAllPosts(response);
          setError(null);
        }
      } catch (err: any) {
        if (err.name !== "AbortError") {
          setError(err.message || "An unknown error occurred.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllPosts();

    return () => abortCont.abort();
  }, [useEffectTrigger]);

  const handleSendPost = async (newPostTitle: string, newPostContent: string) => {
    if (newPostTitle.trim() === "" || newPostContent.trim() === "") {
      setError("You have to write something for both post title and post content.");
      setIsNewPostMode(false);
    } else {
      const request: IPostToPublicBoardRequest = {
        title: newPostTitle,
        content: newPostContent,
      };

      try {
        await socialMediaApiService.createNewPostToPublicBoardAsync(request);
        setUseEffectTrigger((prev) => prev + 1);
      } catch (err: any) {
        setError(err.message || "An unknown error occurred.");
      } finally {
        setNewPostTitle("");
        setNewPostContent("");
        setIsNewPostMode(false);
      }
    }
  };

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  if (isLoading) {
    return <p>Laddar inläggen...</p>;
  }

  return (
    <div className="public-board-view">
      <h1>Anslagstavlan</h1>
      {allPosts.length === 0 ? (
        <p>Inga inlägg finns än. Skriv gärna ett!</p>
      ) : (
        <div>
          {allPosts.map((post: IPostToPublicBoardResponse) => (
            <div key={post.id}>
              <p>
                {post.user.id === loggedInUserId ? "Du" : `${post.user.firstName} ${post.user.lastName}`} skrev{" "}
                {new Date(post.createdAt).toLocaleDateString("sv-SE")}, kl{" "}
                {new Date(post.createdAt).toLocaleTimeString("sv-SE", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p>{post.title}</p>
              <p>{post.content}</p>
            </div>
          ))}
        </div>
      )}

      {!isNewPostMode && (
        <div>
          <button onClick={() => setIsNewPostMode(true)}>Skriv ett inlägg</button>
        </div>
      )}
      {isNewPostMode && (
        <div>
          <div>
            <label htmlFor="title">Titel</label>
            <input type="text" id="title" required onChange={(e) => setNewPostTitle(e.target.value)} />
          </div>
          <div>
            <label htmlFor="content">Inlägg</label>
            <textarea id="content" required rows={5} onChange={(e) => setNewPostContent(e.target.value)} />
          </div>
          <div>
            <button onClick={() => handleSendPost(newPostTitle, newPostContent)}>Skicka</button>
            <button onClick={() => setIsNewPostMode(false)}>Avbryt</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicBoardView;
