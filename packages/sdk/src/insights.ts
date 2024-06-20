import got from 'got';
import { BaseResource } from './base.js';
import {
    GetUserInsightsParams,
    UserInsightsResponse,
    ErrorResponse,
    GetMediaInsightsParams,
    MediaInsightsResponse,
} from './types.js';

export class Insights extends BaseResource {
    constructor() {
        super();
    }

    /**
     * Retrieve insights for a Threads user object.
     * @param params
     * @returns
     */
    public getUserInsights = async (params: GetUserInsightsParams): Promise<UserInsightsResponse> => {
        const { accessToken, userId, metric, since, until } = params;

        const queryThreadUrl = this.buildGraphApiUrl(
            `${userId}/threads_insights`,
            {
                metric,
                ...(since ? { since } : {}),
                ...(until ? { until } : {}),
            },
            accessToken
        );

        const response = await got.get(queryThreadUrl, { responseType: 'json', throwHttpErrors: false });

        if (response.statusCode === 200) {
            return response.body as UserInsightsResponse;
        } else {
            throw new Error((response.body as ErrorResponse).error.message);
        }
    };

    /**
     * Retrieve insights for a Threads media object.
     * @param params
     * @returns
     */
    public getMediaInsights = async (params: GetMediaInsightsParams): Promise<MediaInsightsResponse> => {
        const { accessToken, mediaId, metric } = params;

        const queryThreadUrl = this.buildGraphApiUrl(
            `${mediaId}/insights`,
            {
                metric,
            },
            accessToken
        );

        const response = await got.get(queryThreadUrl, { responseType: 'json', throwHttpErrors: false });

        if (response.statusCode === 200) {
            return response.body as MediaInsightsResponse;
        } else {
            throw new Error((response.body as ErrorResponse).error.message);
        }
    };
}
