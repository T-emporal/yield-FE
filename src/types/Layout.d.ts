export interface LayoutProps {
    children: ReactNode;
    activePage: string;
}

export type OrbPosition = {
    top?: string;
    left?: string;
    bottom?: string;
    right?: string;
};


export type OrbIdentifier = 'top-left' | 'bottom-right';
