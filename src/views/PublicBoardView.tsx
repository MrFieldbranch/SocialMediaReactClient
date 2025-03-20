import { useEffect, useRef, useState } from "react";
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

  const endOfPageRef = useRef<HTMLDivElement>(null);

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
		setTimeout(() => {
			endOfPageRef.current?.scrollIntoView({ behavior: "smooth" });
		}, 0);		
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

  const handleOpenMessageBox = () => {
	setIsNewPostMode(true);
	setTimeout(() => {
    endOfPageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, 0);
  }

  const handleError = () => {
	setError(null);
	setTimeout(() => {
    endOfPageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, 0);
  }

  if (error)
    return (
      <div className="error-message">
        <p>{error}</p>
        <button onClick={handleError}>Tillbaka</button>
      </div>
    );

  if (isLoading) {
    return <p>Laddar inläggen...</p>;
  }

  return (
    <div className="public-board">
      <h1>ANSLAGSTAVLAN</h1>
      {allPosts.length === 0 ? (
        <p className="mar-top-1">Inga inlägg finns än. Skriv gärna ett!</p>
      ) : (
        <div className="message-list">
          {allPosts.map((post: IPostToPublicBoardResponse) => (
            <div key={post.id} className={`message ${post.user.id === loggedInUserId ? "message-left" : "message-right"}`}>
              <p>
                {post.user.id === loggedInUserId ? "Du" : `${post.user.firstName} ${post.user.lastName}`} skrev{" "}
                {new Date(post.createdAt).toLocaleDateString("sv-SE")}, kl{" "}
                {new Date(post.createdAt).toLocaleTimeString("sv-SE", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <h2>{post.title}</h2>
              <p>{post.content}</p>
            </div>
          ))}
        </div>
      )}

      {!isNewPostMode && (
        <div className="vertical-spacing">
          <button className="edit-or-write-new-button" onClick={handleOpenMessageBox}>
            Skriv ett inlägg
          </button>
        </div>
      )}
      {isNewPostMode && (
        <div className="vertical-spacing">
          <div className="label-and-input-public-board">
            <label htmlFor="title">Titel</label>
            <input type="text" id="title" required onChange={(e) => setNewPostTitle(e.target.value)} />
          </div>
          <div className="label-and-input-public-board">
            <label htmlFor="content">Inlägg</label>
            <textarea id="content" required onChange={(e) => setNewPostContent(e.target.value)} />
          </div>
          <div className="confirm-or-cancel">
            <button className="confirm" onClick={() => handleSendPost(newPostTitle, newPostContent)}>
              Skicka
            </button>
            <button className="cancel" onClick={() => setIsNewPostMode(false)}>
              Avbryt
            </button>
          </div>
        </div>
      )}
      <div ref={endOfPageRef} />
    </div>
  );
};

export default PublicBoardView;
