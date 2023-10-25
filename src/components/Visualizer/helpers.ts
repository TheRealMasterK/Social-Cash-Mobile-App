import * as d3 from "d3";
import { DimensionsType } from "../../types";
import { VisualizerCoin } from "./types";

export const forceHandlerDefault = (simulationGiveAways: VisualizerCoin[], dimensions: DimensionsType) => {
    const { height, width } = dimensions;

    const maxVelocity = 2;
    const alpha = 0.3;
    const maxRadiusMultiplier = 1.05;
    const separationFactor = 1.2;
    const movementStrength = 0.1;
    const randomDirectionProbability = 0.01;

    for (let i = 0; i < simulationGiveAways.length; i++) {
        const coinA = simulationGiveAways[i];

        coinA.isColliding = false;

        if (Number.isNaN(coinA.vx) || Number.isNaN(coinA.vy)) {
            coinA.vx = 0;
            coinA.vy = 0;
        }

        for (let j = 0; j < simulationGiveAways.length; j++) {
            if (i === j) {
                continue;
            }

            const coinB = simulationGiveAways[j];

            if (Number.isNaN(coinB.vx) || Number.isNaN(coinB.vy)) {
                coinB.vx = 0;
                coinB.vy = 0;
            }

            const radiusA = coinA.radius * maxRadiusMultiplier;
            const radiusB = coinB.radius * maxRadiusMultiplier;
            const radiusSum = radiusA + radiusB;
            const dx = coinA.x - coinB.x;
            const dy = coinA.y - coinB.y;
            const distanceSquared = dx * dx + dy * dy;

            if (distanceSquared < radiusSum * radiusSum) {
                const overlap = radiusSum - Math.sqrt(distanceSquared);
                const separationStrength = (alpha * separationFactor * overlap) / Math.sqrt(distanceSquared);

                const totalRadius = radiusA + radiusB;
                const ratioA = radiusA / totalRadius;
                const ratioB = radiusB / totalRadius;

                coinA.vx += (dx * separationStrength * ratioB) / 2;
                coinA.vy += (dy * separationStrength * ratioB) / 2;
                coinB.vx -= (dx * separationStrength * ratioA) / 2;
                coinB.vy -= (dy * separationStrength * ratioA) / 2;

                // Mark the GiveAways as colliding
                coinA.isColliding = true;
                coinB.isColliding = true;
            }
        }

        // Only update positions if the coin is colliding or if it's time to change direction.
        if (coinA.isColliding || Math.random() < 0.3) {
            // Prevent GiveAways from going out of bounds.
            coinA.x = Math.max(coinA.radius, Math.min(width - coinA.radius, coinA.x));
            coinA.y = Math.max(coinA.radius, Math.min(height - coinA.radius, coinA.y));

            if (coinA.direction === undefined || Math.random() < randomDirectionProbability) {
                coinA.direction = Math.random() * 2 * Math.PI;
            }

            coinA.vx += Math.cos(coinA.direction) * movementStrength;
            coinA.vy += Math.sin(coinA.direction) * movementStrength;

            coinA.vx = clamp(-maxVelocity, coinA.vx, maxVelocity);
            coinA.vy = clamp(-maxVelocity, coinA.vy, maxVelocity);
        }
    }
};

// For testing.
export const highPerfHandler = (simulationGiveAways: VisualizerCoin[], dimensions: DimensionsType) => {
    const { height, width } = dimensions;
    // const now = performance.now();
    simulationGiveAways.forEach(node => {
        if (node.isDragging) {
            return;
        }
        node.x = Math.max(node.radius, Math.min(width - node.radius, node.x));
        node.y = Math.max(node.radius, Math.min(height - node.radius, node.y));

        if (node.direction === undefined || Math.random() < 0.01) {
            node.direction = Math.random() * 2 * Math.PI;
        }

        node.vx += Math.cos(node.direction) * 0.1;
        node.vy += Math.sin(node.direction) * 0.1;
    });
    // const then = performance.now();
    // console.log(then - now); //0.1ms
};

function clamp(min: number, value: number, max: number) {
    return Math.min(max, Math.max(min, value));
}

export const totalAreaOfCircles = (radii: number[]): number => {
    let totalArea = 0;
    for (const radius of radii) {
        totalArea += Math.PI * Math.pow(radius, 2);
    }
    return totalArea;
};

// export const createRadiusScaleSimplified = (data: number[], dimens: DimensionsType) => {
//     const { width, height } = dimens;

//     const radiusScale = d3
//         .scaleLinear()
//         .domain([0, Math.max(...data)])
//         .range([0, Math.min(width, height) * 0.5])
//         .clamp(true);

//     const radii = data.map(d => radiusScale(d));
//     const initialTotalArea = totalAreaOfCircles(radii);
//     const maxTotalArea = (width * height) / 1.5;

//     if (initialTotalArea > maxTotalArea) {
//         const scaleFactor = Math.sqrt(maxTotalArea / initialTotalArea);
//         radiusScale.range([0, Math.min(width, height) * 0.5 * scaleFactor]).clamp(true);
//     }
//     return radiusScale;
// };

export const createRadiusScale = (data: number[], dimens: DimensionsType) => {
    const { width, height } = dimens;

    const dpr = window.devicePixelRatio || 1;

    const radiusScale = d3
        .scaleSqrt()
        .domain([0, Math.max(...data)])
        .range([clamp(28, 0, Math.min(width * dpr, height * dpr)), Math.min(width * dpr, height * dpr) * 0.36])
        .clamp(true);

    const radii = data.map(d => radiusScale(d));
    const initialTotalArea = totalAreaOfCircles(radii) * 2;
    const maxTotalArea = 0.6 * width * height * 2;

    if (initialTotalArea > maxTotalArea) {
        const scaleFactor = Math.sqrt(maxTotalArea / initialTotalArea);
        radiusScale
            .range([
                clamp(28, 0, Math.min(width * dpr, height * dpr)) * scaleFactor,
                Math.min(width * dpr, height * dpr) * 0.36 * scaleFactor,
            ])
            .clamp(true);
    }
    return radiusScale;
};

export const calculateMonospacedFontSize = (widthInPoints: number, numberOfCharacters: number): number => {
    if (widthInPoints <= 0 || numberOfCharacters <= 0 || widthInPoints == null || numberOfCharacters == null) {
        return 1;
    }
    const normNumChars = Math.max(3, numberOfCharacters);
    const fontSize = (widthInPoints / normNumChars) * 0.8;
    return Math.round(fontSize);
};
