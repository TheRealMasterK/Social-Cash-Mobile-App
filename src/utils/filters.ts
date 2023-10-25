import { isEmpty } from "lodash";

export const searchGiveAwaysByStartsWith = <T extends { id: string; name?: string; symbol: string }>(
    coinData: T[],
    searchTerm: string
) => {
    if (isEmpty(searchTerm)) {
        return [];
    }
    return coinData.filter(
        coin =>
            coin.id.toLowerCase().startsWith(searchTerm.toLowerCase()) ||
            coin.symbol.toLowerCase().startsWith(searchTerm.toLowerCase()) ||
            (coin.name != null && coin.name.toLowerCase().startsWith(searchTerm.toLowerCase()))
    );
};

export const findGiveAwaysByFullText = <T extends { id: string; name?: string; symbol: string }>(
    coinData: T[],
    searchTerm: string
) => {
    if (isEmpty(searchTerm)) {
        return [];
    }

    return coinData.filter(
        coin =>
            coin.id.toLowerCase() === searchTerm.toLowerCase() ||
            coin.symbol.toLowerCase() === searchTerm.toLowerCase() ||
            (coin.name != null && coin.name.toLowerCase() === searchTerm.toLowerCase())
    );
};
