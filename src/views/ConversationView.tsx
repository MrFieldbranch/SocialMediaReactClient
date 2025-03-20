import { useEffect, useRef, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { IConversationResponse } from "../models/IConversationResponse";
import socialMediaApiService from "../services/social-media-api-service"; /* Singleton */
import { IMessageRequest } from "../models/IMessageRequest";
import { IMessageResponse } from "../models/IMessageResponse";

const ConversationView = () => {
  const { id } = useParams<{ id: string }>(); // Get the id from URL
  const otherUserId = Number(id);

  const location = useLocation();
  const { firstName, lastName } = location.state || {};

  const [conversation, setConversation] = useState<IConversationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isNewMessageMode, setIsNewMessageMode] = useState<boolean>(false);
  const [newMessage, setNewMessage] = useState<string>("");
  const [useEffectTrigger, setUseEffectTrigger] = useState<number>(1);

  const endOfPageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const abortCont = new AbortController();

    const fetchConversation = async () => {
      try {
        const response = await socialMediaApiService.getConversationAsync(otherUserId, abortCont.signal);
        if (!abortCont.signal.aborted) {
          setConversation(response);
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

    fetchConversation();

    return () => abortCont.abort();
  }, [useEffectTrigger]);

  const handleSendMessage = async (newMessage: string) => {
    if (newMessage.trim() === "") {
      setError("You have to write something.");
      setIsNewMessageMode(false);
    } else {
      const request: IMessageRequest = {
        content: newMessage,
      };

      try {
        await socialMediaApiService.sendMessageAsync(otherUserId, request);
        setUseEffectTrigger((prev) => prev + 1);
      } catch (err: any) {
        setError(err.message || "An unknown error occurred.");
      } finally {
        setNewMessage("");
        setIsNewMessageMode(false);
      }
    }
  };

  const handleOpenMessageBox = () => {
	setIsNewMessageMode(true);
	setTimeout(() => {
          endOfPageRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 0);
  }

  const handleError = () => {
    setError(null);
	setTimeout(() => {
    endOfPageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, 0);
  };

  if (error)
    return (
      <div className="error-message">
        <p>{error}</p>
        <button onClick={handleError}>Tillbaka</button>
      </div>
    );

  if (isLoading) {
    return <p>Laddar konversationen...</p>;
  }

  return (
    <div className="conversation">
      <h1>KONVERSATION</h1>
      <h2>
        Mellan dig och {firstName} {lastName}
      </h2>

      {conversation === null ? (
        <p className="mar-top-1">Inga meddelanden än.</p>
      ) : (
        <div className="message-list">
          {conversation.messages.map((message: IMessageResponse) => (
            <div key={message.id} className={`message ${message.senderId === otherUserId ? "message-right" : "message-left"}`}>
              <p>
                {message.senderId === otherUserId ? `${firstName} ${lastName}` : "Du"} skrev{" "}
                {new Date(message.sentAt).toLocaleDateString("sv-SE")}, kl{" "}
                {new Date(message.sentAt).toLocaleTimeString("sv-SE", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p>{message.content}</p>
            </div>
          ))}
        </div>
      )}

      {!isNewMessageMode && (
        <div className="vertical-spacing">
          <button className="edit-or-write-new-button" onClick={handleOpenMessageBox}>
            Skriv nytt meddelande
          </button>
        </div>
      )}
      {isNewMessageMode && (
        <div className="vertical-spacing">
          <textarea required onChange={(e) => setNewMessage(e.target.value)} />
          <div className="confirm-or-cancel">
            <button className="confirm" onClick={() => handleSendMessage(newMessage)}>
              Skicka
            </button>
            <button className="cancel" onClick={() => setIsNewMessageMode(false)}>
              Avbryt
            </button>
          </div>
        </div>
      )}
      <div ref={endOfPageRef} />
    </div>
  );
};

export default ConversationView;
