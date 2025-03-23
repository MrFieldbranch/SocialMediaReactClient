export type InterestProps = {
	id: number;
	name: string;
	onButtonClick?: (id: number) => void;
	color?: string;
	hoverColor?: string;
	buttonText?: string;
}