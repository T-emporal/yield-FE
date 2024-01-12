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
    yield?: string;
    principal?: string;
    liquidate?: string;
    type?: string;
    apy?: string;
    units?: string;
    "Collat. Assets"?: string;
    "Collat. Quant."?: string;
    "Collateral %"?: string;
    "Dip/Wit Collat."?: string;
    "Edit/Cancel Order"?: React.ReactNode;
}


interface TableContainerProps {
    data: string[][];
    title: string;
}
