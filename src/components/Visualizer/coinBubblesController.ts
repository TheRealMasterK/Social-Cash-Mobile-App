import * as d3 from "d3";
import { CoinData, CoinInitialPosition, DimensionsType } from "../../types";
import { notNull } from "../../utils/helpers";
import { createRadiusScale, forceHandlerDefault } from "./helpers";
import { PerformanceAccessor, VisualizerCoin } from "./types";

const makeVisualizerCoin = (
    coin: CoinData,
    dimens: DimensionsType,
    scale: d3.ScaleLinear<number, number>,
    performacePeriod: PerformanceAccessor,
    visualizerCoins?: VisualizerCoin[]
): VisualizerCoin => {
    const foundCoin = visualizerCoins?.find(c => c.id === coin.id);
    const performanceValue = coin.performance[performacePeriod] ?? 0;

    const initialPosition =
        coin.initialPosition === CoinInitialPosition.CENTER_TOP
            ? { x: dimens.width / 2, y: dimens.height / 4 }
            : undefined;

    return {
        ...coin,
        x: initialPosition?.x ?? foundCoin?.x ?? Math.random() * dimens.width,
        y: initialPosition?.y ?? foundCoin?.y ?? Math.random() * dimens.height,
        vx: foundCoin?.vx ?? 0,
        vy: foundCoin?.vy ?? 0,
        radius: scale(Math.abs(performanceValue)),
        performanceValue,
        performanceValueFormatted: `${performanceValue.toFixed(2)}%`,
    };
};

const DEFAULT_PERFORMANCE_PERIOD: PerformanceAccessor = "d";
class CoinBubblesController {
    private simulation: d3.Simulation<VisualizerCoin, undefined>;

    private coinData: CoinData[] = [];

    // Never change this array, only mutate the properties of the coins.
    // To change this array, call updateCoins.
    private visualizerCoins: VisualizerCoin[] = [];

    private radiusScale: d3.ScalePower<number, number>;

    private dimensions: DimensionsType;

    private performacePeriod: PerformanceAccessor;

    private draggingCoin?: VisualizerCoin;

    // TODO: this could include coin index, to return that coin.
    private onTickListeners: Array<() => void> = [];

    // Timer to start bubble pop animation.
    private bubblePopTimer: NodeJS.Timeout | undefined;

    private tempHiddenCoinIds: string[] = [];

    public constructor(coins: CoinData[], dimensions: DimensionsType, performacePeriod?: PerformanceAccessor) {
        this.dimensions = dimensions;
        this.performacePeriod = performacePeriod ?? DEFAULT_PERFORMANCE_PERIOD;
        this.radiusScale = this.updateRadiusScale();
        this.updateCoins(coins);
        this.simulation = this.reCreateSimulation();
    }

    private reCreateSimulation() {
        // Only reCreateSimulation when coins are added/removed/reordered.
        // Else mutate properties of coins in this.visualizerCoins array.
        console.log("new simulation");
        this.simulation?.stop();
        this.simulation = d3
            .forceSimulation(this.visualizerCoins) // forceSimulation mutates this.visualizerCoins.
            .alphaDecay(0)
            .force(
                "coinForce",
                () => forceHandlerDefault(this.visualizerCoins, this.dimensions)
                // highPerfHandler(coinBubblesController.coinBubbles, coinBubblesController.getDimensions())
            );

        this.simulation.on("tick", () => {
            this.tick();
        });
        return this.simulation;
    }

    public stopSimulation() {
        this.simulation.stop();
    }

    // PUBLIC

    public get coinBubbles(): VisualizerCoin[] {
        return this.visualizerCoins;
    }

    /** All primative coins excluding temp removed coins, ie. popped bubbles */
    public get coins(): CoinData[] {
        return this.coinData.filter(c => !this.tempHiddenCoinIds.includes(c.id));
    }

    public get allCoins(): CoinData[] {
        return this.coinData;
    }

    public getCoinById(id: string): VisualizerCoin | undefined {
        return this.visualizerCoins.find(c => c.id === id);
    }

    public setDraggingCoin(coin: { id: string } | undefined) {
        if (coin == null) {
            if (this.draggingCoin) {
                // When the coin is released, we clear the pop timers.
                this.clearBubblePopTimer();
                // Unfix the position of the coin.
                this.draggingCoin.fx = undefined;
                this.draggingCoin.fy = undefined;
                // Unset the dragging coin.
                this.draggingCoin.isDragging = false;
                this.draggingCoin = undefined;
            }
        } else {
            const visualizerCoin = this.getCoinById(coin.id);
            if (visualizerCoin) {
                visualizerCoin.isDragging = true;
                this.draggingCoin = visualizerCoin;
                this.startNewPopTimeout();
            }
        }
    }

    public getDraggingCoin(): VisualizerCoin | undefined {
        return this.draggingCoin;
    }

    public setDraggingCoinPosition(x: number, y: number) {
        if (this.draggingCoin == null) {
            return;
        }

        // When the coin is dragged, it should not pop.
        this.startNewPopTimeout();

        // fx and fy are used to fix the position of the coin. So it doesn't bounce around when dragging.
        if (y + this.draggingCoin.radius < this.dimensions.height && y - this.draggingCoin.radius > 0) {
            this.draggingCoin.y = y;
            this.draggingCoin.fy = y;
        }

        if (x + this.draggingCoin.radius < this.dimensions.width && x - this.draggingCoin.radius > 0) {
            this.draggingCoin.x = x;
            this.draggingCoin.fx = x;
        }
    }

    public subscribeToTick(listener: () => void) {
        this.onTickListeners.push(listener);
    }

    public unsubscribeFromTick(listener: () => void) {
        this.onTickListeners = this.onTickListeners.filter(l => l !== listener);
    }

    public tick() {
        this.onTickListeners.forEach(l => l());
    }

    public getDimensions(): DimensionsType {
        return this.dimensions;
    }

    public updateCoins(coins: CoinData[]) {
        console.log("Visualizer: update coins");
        this.coinData = coins;
        this.updateRadiusScale();
        this.visualizerCoins = coins
            // Filter out popped coins.
            .filter(c => !this.tempHiddenCoinIds.includes(c.id))
            .map(c =>
                makeVisualizerCoin(c, this.dimensions, this.radiusScale, this.performacePeriod, this.visualizerCoins)
            );
        this.reCreateSimulation();
        return this.visualizerCoins;
    }

    public setDimensions(dimensions: DimensionsType) {
        if (this.dimensions.height !== dimensions.height || this.dimensions.width !== dimensions.width) {
            this.dimensions = dimensions;
            this.updateRadiusScale();
        }
    }

    public setPerformancePeriod(performacePeriod: PerformanceAccessor) {
        if (this.performacePeriod !== performacePeriod) {
            this.performacePeriod = performacePeriod;
            this.updateRadiusScale();
            for (const visualizerCoin of this.visualizerCoins) {
                visualizerCoin.performanceValue = visualizerCoin.performance[this.performacePeriod] ?? 0;
                visualizerCoin.performanceValueFormatted = `${visualizerCoin.performanceValue.toFixed(2)}%`;
                visualizerCoin.radius = this.radiusScale(Math.abs(visualizerCoin.performanceValue));
            }
        }
        // Temp way to restore all coins when switching performance period.
        this.restoreTempHiddenCoins();
    }

    public getPerformancePeriod(): PerformanceAccessor {
        return this.performacePeriod;
    }

    public getCoinAtPosition(x: number, y: number): VisualizerCoin | undefined {
        return this.visualizerCoins.find(c => {
            const dx = c.x - x;
            const dy = c.y - y;
            // TODO: replace expensive sqrt with more performant squared distance.
            const distance = Math.sqrt(dx * dx + dy * dy);
            return distance < c.radius;
        });
    }

    public removeVisualizerCoin(coinId: string) {
        this.tempHiddenCoinIds.push(coinId);
        this.updateCoins(this.coinData);
    }

    /**
     * A less expensive way to remove/hide a coin as we dont have to recreate simulation.
     * Next call to reCreateSimulation will actually remove the coin.
     */
    public visualizerCoinPopped(coinId: string) {
        this.tempHiddenCoinIds.push(coinId);
        // Make new scale for coins not including tempRemovedCoinIds.
        const newScale = this.updateRadiusScale(
            this.visualizerCoins.filter(c => !this.tempHiddenCoinIds.includes(c.id))
        );
        for (const coin of this.visualizerCoins) {
            if (this.tempHiddenCoinIds.includes(coin.id)) {
                // We can use this prop to prevent rendering of the coin.
                coin.hidden = true;
                // Set radius to 0 so it doesn't collide with other coins via forceSimulation. Avoids ghost coin effect.
                coin.radius = 0;
            } else {
                coin.radius = newScale(Math.abs(coin.performanceValue));
            }
        }
        this.reCreateSimulation();
    }

    public restoreTempHiddenCoins() {
        this.tempHiddenCoinIds = [];
        for (const coin of this.visualizerCoins) {
            coin.hidden = false;
            coin.radius = this.radiusScale(Math.abs(coin.performanceValue));
        }
    }

    // PRIVATE

    private updateRadiusScale(coins = this.coins) {
        this.radiusScale = createRadiusScale(
            coins
                .map(c => {
                    const perfValue = c.performance[this.performacePeriod];
                    if (perfValue == null) {
                        return null;
                    }
                    return Math.abs(perfValue);
                })
                .filter(notNull),
            this.dimensions
        );
        return this.radiusScale;
    }

    private clearBubblePopTimer() {
        clearTimeout(this.bubblePopTimer);
        this.bubblePopTimer = undefined;
    }

    // When coin is pressed down, and not moved, it should start growing after a short delay and then continue growing until it pops.
    // When isPopping becomes true, we start the pop animation.
    private startNewPopTimeout() {
        this.clearBubblePopTimer();
        this.bubblePopTimer = setTimeout(() => {
            if (this.draggingCoin != null) {
                this.draggingCoin.isPopping = true;
            }
        }, 500);
    }
}

export default CoinBubblesController;
