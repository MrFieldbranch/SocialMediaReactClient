import { useEffect, useState } from 'react';
import { IModalProps } from '../../types/IModalProps';
import './PrivateMessageModal.css';

const PrivateMessageModal = ({ isOpen, onClose, onSaveOrSend, initialValue }: IModalProps) => {
	const [text, setText] = useState(initialValue);

	useEffect(() => {
		setText(initialValue);
	}, [initialValue]);

	if (!isOpen) return null;

	return (
		<div className="modal-backdrop">
			  <div className="modal-content" onClick={(e) => e.stopPropagation()}>
					<h3>Skriv ett meddelande</h3>
					<textarea 
						  value={text} 
						  onChange={(e) => setText(e.target.value)} 
						  rows={5} 
						  style={{ width: "100%" }}
					/>
					<div className="modal-actions">
						  <button onClick={() => onSaveOrSend(text)}>Skicka</button>
						  <button onClick={onClose}>Avbryt</button>
					</div>
			  </div>
		</div>
  );

};

export default PrivateMessageModal;