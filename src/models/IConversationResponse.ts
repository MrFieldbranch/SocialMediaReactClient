import { IMessageResponse } from "./IMessageResponse";

export interface IConversationResponse {
    id: number;
    conversationPartnerId: number;
    messages: IMessageResponse[];
}