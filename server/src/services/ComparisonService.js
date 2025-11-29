import DocumentStatsDAO from "../daos/DocumentStatsDAO.js";

class ComparisonService {
    static async compareWithStats(contributions) {
        const stats = await DocumentStatsDAO.getAggregatedStats();
        const enriched = [];

        for (const c of contributions) {
        const { label, value } = c;

        const statValue = stats[label];
        let averageOrPercentage = null;
        let interpretation = null;

        if (statValue === undefined) {
            enriched.push({
            ...c,
            averageOrPercentage: null,
            interpretation: "Sin datos de comparación"
            });
            continue;
        }

        const isNumeric = typeof statValue === "number";

        if (isNumeric) {
            averageOrPercentage = statValue;
            interpretation =
            value > statValue
                ? "Arriba del promedio"
                : value < statValue
                ? "Debajo del promedio"
                : "Igual al promedio";

        } else if (typeof statValue === "object") {
            const total = Object.values(statValue).reduce((a, b) => a + b, 0);
            const currentCount = statValue[value] || 0;
            const percent = total > 0 ? (currentCount / total) * 100 : 0;

            averageOrPercentage = percent;
            interpretation =
            percent > 50 ? "Mayoría" : percent > 0 ? "Minoría" : "Muy raro";
        }

        enriched.push({
            ...c,
            averageOrPercentage,
            interpretation
        });
        }

        return enriched;
    }
}

export default ComparisonService;
