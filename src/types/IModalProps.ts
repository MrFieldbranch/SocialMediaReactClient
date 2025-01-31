export interface IModalProps {
      isOpen: boolean;
      onClose: () => void;
      onSaveOrSend: (text: string) => void;
      initialValue: string;
}