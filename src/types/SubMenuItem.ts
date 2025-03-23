export type SubMenuItem = {
        label: string;
        onClick?: () => void;   
        linkTo?: string;        
		optionalProps?: Record<string, string>;
		color?: string;
		hoverColor?: string;
}