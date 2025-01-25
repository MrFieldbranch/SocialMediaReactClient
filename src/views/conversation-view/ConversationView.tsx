import { useEffect, useState } from 'react';
import './ConversationView.css';
import { useParams, useLocation } from 'react-router-dom';
import { IConversationResponse } from '../../models/IConversationResponse';
import { IMessageResponse } from '../../models/IMessageResponse';
import socialMediaApiService from '../../services/social-media-api-service';    /* Singleton */

const ConversationView = () => {
	const { id } = useParams<{ id: string }>()     // Get the id from URL
	const otherUserId = Number(id);

	const location = useLocation();
	const { firstName, lastName } = location.state || {};

	const [conversation, setConversation] = useState<IConversationResponse | null>(null);
	const [messages, setMessages] = useState<IMessageResponse[]>([]);
	const [newMessage, setNewMessage] = useState<string>("");
	const [errorMessage, setErrorMessage] = useState<string>("");



	useEffect(() => {
		let isMounted = true;

		const fetchConversation = async () => {
			try {
				const conversationFromApi = await socialMediaApiService.getConversationAsync(otherUserId);
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
	}, []);


	return (
		<>
			<h1>KONVERSATIONSVY</h1>
			<h3>Mellan dig och {firstName} {lastName}</h3>
			{conversation === null ? (
				<p>Inga meddelanden än.</p>
			) : (
				<div>
					{messages.map((message) => (
						<p key={message.id}>{message.content}</p>
					))}
				</div>
				
			)}
		</>
	);
};

export default ConversationView;