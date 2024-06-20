import express from 'express';

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

/**
 * @param {URL} sourceUrl
 * @param {URL} destinationUrl
 * @param {string} paramName
 */
const setUrlParamIfPresent = (sourceUrl: URL, destinationUrl: URL, paramName: string) => {
    const paramValue = sourceUrl.searchParams.get(paramName);
    if (paramValue) {
        destinationUrl.searchParams.set(paramName, paramValue);
    }
};

/**
 * @param {Request} req
 * @param {string} graphApiPagingUrl
 */
export const getCursorUrlFromGraphApiPagingUrl = (req: express.Request, graphApiPagingUrl: string) => {
    const graphUrl = new URL(graphApiPagingUrl);

    const cursorUrl = new URL(req.protocol + '://' + req.get('host') + req.originalUrl);
    cursorUrl.search = '';

    setUrlParamIfPresent(graphUrl, cursorUrl, 'limit');
    setUrlParamIfPresent(graphUrl, cursorUrl, 'before');
    setUrlParamIfPresent(graphUrl, cursorUrl, 'after');

    return cursorUrl.href;
};
