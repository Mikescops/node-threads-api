/**
 * @param {{ value?: number, values: { value: number }[] }[]} metric
 */
export const getInsightsValue = (metric: { value?: number; values: { value: number }[] }) => {
    if (metric) {
        metric.value = metric.values?.[0]?.value;
    }
};

/**
 * @param {{ value?: number, total_value: { value: number } }[]} metric
 */
export const getInsightsTotalValue = (metric: { value?: number; total_value: { value: number } }) => {
    if (metric) {
        metric.value = metric.total_value?.value;
    }
};
