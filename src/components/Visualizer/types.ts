import { CoinData } from "../../types";

export type VisualizerCoin = CoinData & {
    x: number;
    y: number;
    vx: number; // velocity x
    vy: number; // velocity y
    fx?: number; // fixed x
    fy?: number; // fixed y
    radius: number;
    isColliding?: boolean;
    recentlyReleased?: boolean;
    direction?: number;
    isDragging?: boolean;
    /** The value associated with selected performancePeriod */
    performanceValue: number;
    performanceValueFormatted: string;
    /** Bubble pop animation is currently playing */
    isPopping?: boolean;
    /** We use this prop to hide a coin or not render it without removing it from simulation,
     *  if we change the length of the coins in simulation it needs to be recreated which is expensive */
    hidden?: boolean;
};

export type PerformanceAccessor = keyof CoinData["performance"];
