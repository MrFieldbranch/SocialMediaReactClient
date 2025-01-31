import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { IConversationResponse } from "../models/IConversationResponse";
import { IMessageResponse } from "../models/IMessageResponse";
import socialMediaApiService from "../services/social-media-api-service"; /* Singleton */
import SubMenu from "../components/SubMenu";
import PrivateMessageModal from "../components/PrivateMessageModal";
import { IMessageRequest } from "../models/IMessageRequest";

const ConversationView = () => {
  const { id } = useParams<{ id: string }>(); // Get the id from URL
  const otherUserId = Number(id);

  const location = useLocation();
  const { firstName, lastName } = location.state || {};

  const [conversation, setConversation] =
    useState<IConversationResponse | null>(null);
  const [messages, setMessages] = useState<IMessageResponse[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchConversation = async () => {
      try {
        const conversationFromApi =
          await socialMediaApiService.getConversationAsync(otherUserId);
        if (isMounted) {
          setConversation(conversationFromApi);
          if (conversationFromApi !== null)
            setMessages(conversationFromApi.messages);
        }
      } catch (error: any) {
        if (isMounted) {
          setErrorMessage(error.message || "An unknown error occurred.");
        }
      }
    };

    fetchConversation();

    return () => {
      isMounted = false;
    };
  }, [otherUserId]);

  const handleWriteMessage = () => {
    setIsModalOpen(true);
  };

  const handleSendMessage = async (text: string) => {
    if (text === "") {
      setErrorMessage("You have to write something.");
      setIsModalOpen(false);
    } else {
      const newMsg: IMessageResponse = {
        id: Date.now(), // Temporay ID to avoid key conflicts
        content: text,
        sentAt: new Date(),
        senderId: otherUserId,
      };

      setMessages((prevMessages) => [...prevMessages, newMsg]);

      const request: IMessageRequest = {
        content: text,
      };
      try {
        await socialMediaApiService.sendMessageAsync(otherUserId, request);
        /* await fetchConversation(); */
      } catch (error: any) {
        setErrorMessage(error.message || "An unknown error occurred.");
      } finally {
        setNewMessage("");
        setIsModalOpen(false);
      }
    }
  };

  return (
    <div className="conversation-view">
      <h1>KONVERSATIONSVY</h1>
      <h3>
        Mellan dig och {firstName} {lastName}
      </h3>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <SubMenu
        items={[{ label: "Skriv ett meddelande", onClick: handleWriteMessage }]}
      />
      {conversation === null ? (
        <p>Inga meddelanden än.</p>
      ) : (
        <div>
          {messages.map((message) => (
            <p key={message.id}>{message.content}</p>
          ))}
        </div>
      )}

      <PrivateMessageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaveOrSend={handleSendMessage}
        initialValue={newMessage || ""}
      />
    </div>
  );
};

export default ConversationView;
