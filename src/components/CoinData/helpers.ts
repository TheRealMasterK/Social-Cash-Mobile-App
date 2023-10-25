import { CoinCategoryData, CoinData } from "../../types";

export const CLOUDFRONT_URL = process.env.EXPO_PUBLIC_CLOUDFRONT_COIN_DATA_URL;

export async function fetchCoinData(currency: string = "usd") {
    const catReq = fetch(`${CLOUDFRONT_URL}/categories.json`, {
        cache: "default",
    });

    const coinReq = fetch(
        `${CLOUDFRONT_URL}/1${currency !== "usd" ? "." + currency : ""}.json`,
        // `/assets/datafiles/1.${currency}.json`,
        { cache: "no-store" }
    );

    const [catResponse, coinResponse] = await Promise.all([catReq, coinReq]);
    const [categoriesArray, coins]: [CoinCategoryData[], CoinData[]] = await Promise.all([
        catResponse.json(),
        coinResponse.json(),
    ]);

    const categories: CoinCategoryData = {};
    for (const categoryObject of categoriesArray) {
        // eslint-disable-next-line guard-for-in
        for (const category in categoryObject) {
            categories[category] = categoryObject[category];
        }
    }

    return { coins, categories };
}
