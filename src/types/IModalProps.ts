export interface IModalProps {
      isOpen: boolean;
      onClose: () => void;
      onSave: (text: string) => void;
      initialValue: string;
}