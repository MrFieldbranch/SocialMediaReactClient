export type SubMenuItem = {
        label: string;
        onClick?: () => void;   /* Optional for actions */
        linkTo?: string;        /* Optional for navigation */
}