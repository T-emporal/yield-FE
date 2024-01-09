// Types for all components

export interface LineChartProps {
    lineColor: LineColor;
}

export interface PlaceOrderCardProps {
    handleClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
    yieldGraphOpen: boolean;
    setLineColor: (color: string) => void;
}

export interface TableDataItem {
    asset: React.ReactNode; 
    duration: string;
    maturity: string;
    yield: string;
    principal: string;
    liquidate: string;
}

export interface TableContainerProps {
    data: TableDataItem[];
    title: string;
}
