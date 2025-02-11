import { useEffect, useState } from "react";
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

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  if (isLoading) {
    return <p>Laddar konversationen...</p>;
  } 

  return (
    <div className="conversation-view">
      <h1>KONVERSATIONSVY</h1>
      <h3>
        Mellan dig och {firstName} {lastName}
      </h3>

      {conversation === null ? (
        <p>Inga meddelanden än.</p>
      ) : (
        <div>
          {conversation.messages.map((message: IMessageResponse) => (
            <div key={message.id}>
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
        <div>
          <button onClick={() => setIsNewMessageMode(true)}>Skriv nytt meddelande</button>
        </div>
      )}
      {isNewMessageMode && (
        <div>
          <textarea rows={5} onChange={(e) => setNewMessage(e.target.value)} />
          <div>
            <button onClick={() => handleSendMessage(newMessage)}>Skicka</button>
            <button onClick={() => setIsNewMessageMode(false)}>Avbryt</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConversationView;
