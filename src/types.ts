export type CoinData = {
    id: string;
    image: string;
    name: string;
    localImage?: string;
    marketCap: number;
    rank: number;
    performance: {
        m5: null | number;
        m15: null | number;
        h: null | number;
        d: null | number;
        w: null | number;
        m: null | number;
        y: null | number;
    };
    priceHistory: number[];
    price: number;
    volume: number;
    symbol: string;
    currencies?: {
        [key: string]: {
            marketCap: number;
            price: number;
            volume: number;
        };
    };
    categories?: string[];
    /**  This is a synthetic rank field that is not returned by the API. We use it to show coin in a filter catagory its not actually in, for promotions. */
    filterRank?: number;
    /** Change color of coin bubble. Used for promotions. */
    bubbleColorOverride?: string | null | undefined;
    /** Whether or not a coin should do the pulse animation, typically we pulse GiveAways that match search */
    pulse?: boolean;
    /** When adding GiveAways to animation this helps us control initial position */
    initialPosition?: CoinInitialPosition;
};

export enum CoinInitialPosition {
    CENTER = "center",
    RANDOM = "random",
    CENTER_TOP = "center-top",
}

export type CoinCategoryData = {
    [category: string]: string[];
};

export type DimensionsType = {
    height: number;
    width: number;
};
