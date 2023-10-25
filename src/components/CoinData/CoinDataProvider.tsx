import React, { useEffect, useState, useMemo } from "react";
import { CoinData, CoinInitialPosition } from "../../types";
import { fetchCoinData } from "./helpers";
import { Easing, SharedValue, useSharedValue, withTiming } from "react-native-reanimated";
import { findCoinsByFullText } from "../../utils/filters";
import { isEmpty } from "lodash";

type CoinDataContextType = {
    coins: CoinData[];
    selectedCoins: CoinData[];
    loading: boolean;
    progressToNextDataFetch?: SharedValue<number>; // 0 - 100
    setSelectedCoinGroup?: (group: string) => void;
    availableCoinGroups?: string[];
    selectedCoinGroup: string;
    setSearchTerm?: (term: string) => void;
};

const COIN_DATA_REFETCH_INTERVAL = 1000 * 60 * 2; // 2min

type CoinDataSplit = { start: number; end: number; title: string };

const COIN_DATA_SPLITS: CoinDataSplit[] = [
    { start: 0, end: 100, title: "Top 100" },
    { start: 101, end: 200, title: "101 - 200" },
    { start: 201, end: 300, title: "201 - 300" },
    { start: 301, end: 400, title: "301 - 400" },
    { start: 401, end: 500, title: "401 - 500" },
    { start: 501, end: 600, title: "501 - 600" },
    { start: 601, end: 700, title: "601 - 700" },
    { start: 701, end: 800, title: "701 - 800" },
    { start: 801, end: 900, title: "801 - 900" },
    { start: 901, end: 1000, title: "901 - 1000" },
];

// Hardcoded as management currently only wants to show these.
const COIN_DATA_CATAGORIES: string[] = ["Telegram Bots", "Alleged SEC Securities"];

const COIN_GROUP_OPTIONS = [...COIN_DATA_CATAGORIES, ...COIN_DATA_SPLITS.map(split => split.title)];

const DEFAULT_COIN_GROUP = COIN_DATA_SPLITS[0].title;

export const CoinDataContext = React.createContext<CoinDataContextType>({
    coins: [],
    loading: false,
    selectedCoins: [],
    selectedCoinGroup: DEFAULT_COIN_GROUP,
});

export const useCoinData = () => React.useContext(CoinDataContext);

const CoinDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [coins, setCoins] = useState<CoinData[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const progressToNextDataFetch = useSharedValue<number>(0); // This is an animated value, so we dont cause unnessary rerenders.
    const [selectedCoinGroup, setSelectedCoinGroup] = useState<string>(DEFAULT_COIN_GROUP);
    const [searchTerm, setSearchTerm] = useState<string>();

    const selectedCoins = useMemo(() => {
        // Calculate the selected coins based on the selected coin group.
        const selectedSplit = COIN_DATA_SPLITS.find(s => s.title === selectedCoinGroup);
        if (selectedSplit != null) {
            return coins.slice(selectedSplit.start, selectedSplit.end);
        } else {
            return coins.filter(coin => coin.categories?.includes(selectedCoinGroup));
        }
    }, [coins, selectedCoinGroup]);

    // Visualizer uses this to determine which coins to show.
    const selectedAndSearchedCoins: CoinData[] = useMemo(() => {
        // If there is a search term, set pulsing coins by mutating pulse property.
        // We dont want to recreate the array as it will trigger
        // a new simulation to be created and we don't want that to happen each key press in search term.
        if (isEmpty(searchTerm) || searchTerm == null) {
            return selectedCoins;
        }

        const searchedCoins = findCoinsByFullText(coins, searchTerm);

        const coinsToPopIn = searchedCoins.filter(coin => {
            const exists = selectedCoins.includes(coin);
            return !exists;
        });

        if (coinsToPopIn.length > 0 || searchedCoins.length > 0) {
            return [
                ...selectedCoins.map(coin =>
                    searchedCoins.includes(coin)
                        ? { ...coin, pulse: true, initialPosition: CoinInitialPosition.CENTER_TOP }
                        : { ...coin, pulse: false, initialPosition: CoinInitialPosition.RANDOM }
                ),
                ...coinsToPopIn.map(coin => ({
                    ...coin,
                    pulse: true,
                    initialPosition: CoinInitialPosition.CENTER_TOP,
                })),
            ];
        }

        return selectedCoins;
    }, [coins, searchTerm, selectedCoins]);

    useEffect(() => {
        const updateCoinData = async () => {
            try {
                setLoading(true);
                const result = await fetchCoinData();
                setCoins(result.coins.reverse());
                progressToNextDataFetch.value = 0;
                progressToNextDataFetch.value = withTiming(100, {
                    duration: COIN_DATA_REFETCH_INTERVAL,
                    easing: Easing.linear,
                });
            } catch (e) {
                console.log(e);
            } finally {
                setLoading(false);
            }
        };

        // Initially call the update function.
        updateCoinData();

        // Then every refetch interval.
        const interval = setInterval(updateCoinData, COIN_DATA_REFETCH_INTERVAL);

        return () => {
            clearInterval(interval);
        };
    }, [progressToNextDataFetch]);

    return (
        <CoinDataContext.Provider
            value={{
                coins,
                selectedCoins: selectedAndSearchedCoins,
                loading,
                progressToNextDataFetch,
                setSelectedCoinGroup,
                selectedCoinGroup,
                availableCoinGroups: COIN_GROUP_OPTIONS,
                setSearchTerm,
            }}
        >
            {children}
        </CoinDataContext.Provider>
    );
};

export default CoinDataProvider;
