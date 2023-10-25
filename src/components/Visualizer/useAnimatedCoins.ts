import { useEffect, useMemo } from "react";
import { CoinData, DimensionsType } from "../../types";
import CoinBubblesController from "./coinBubblesController";
import { PerformanceAccessor } from "./types";

const useAnimatedCoins = (coins: CoinData[], dimensions: DimensionsType, performacePeriod: PerformanceAccessor) => {
    const coinBubblesController = useMemo<CoinBubblesController>(
        () => new CoinBubblesController(coins, dimensions, performacePeriod),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [] // No deps array, only runs once - we only ever want one instance of controller.
    );

    if (coinBubblesController.getPerformancePeriod() !== performacePeriod) {
        coinBubblesController.setPerformancePeriod(performacePeriod);
    }

    if (coinBubblesController.getDimensions() !== dimensions) {
        coinBubblesController.setDimensions(dimensions);
    }

    if (coinBubblesController.coins !== coins) {
        coinBubblesController.updateCoins(coins);
    }

    useEffect(
        () =>
            // return unmount function.
            () => {
                // Stop simulation when unmounting.
                coinBubblesController.stopSimulation();
            },
        [coinBubblesController]
    );

    return coinBubblesController;
};

export default useAnimatedCoins;
