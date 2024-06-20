import got from 'got';
import {
    AuthParams,
    AuthScopes,
    TokenParams,
    TokenResponse,
    ErrorResponse,
    ProfileFields,
    ProfileResponse,
    GetUserInsightsParams,
    GetProfileParams,
    UserInsightsResponse,
    UserTimeSeriesMetricData,
    UserTotalValueMetricData,
} from './types';

export { AuthScopes, ProfileResponse, ProfileFields, UserTimeSeriesMetricData, UserTotalValueMetricData };

const PARAMS__ACCESS_TOKEN = 'access_token';
const PARAMS__CLIENT_ID = 'client_id';
const PARAMS__CONFIG = 'config';
const PARAMS__FIELDS = 'fields';
const PARAMS__HIDE = 'hide';
const PARAMS__METRIC = 'metric';
const PARAMS__QUOTA_USAGE = 'quota_usage';
const PARAMS__REDIRECT_URI = 'redirect_uri';
const PARAMS__REPLY_CONFIG = 'reply_config';
const PARAMS__REPLY_CONTROL = 'reply_control';
const PARAMS__REPLY_QUOTA_USAGE = 'reply_quota_usage';
const PARAMS__REPLY_TO_ID = 'reply_to_id';
const PARAMS__RESPONSE_TYPE = 'response_type';
const PARAMS__RETURN_URL = 'return_url';
const PARAMS__SINCE = 'since';
const PARAMS__SCOPE = 'scope';
const PARAMS__TEXT = 'text';
const PARAMS__UNTIL = 'until';

class ThreadsSDK {
    public graphApiVersion = 'v1.0';
    public graphApiBaseUrl = 'https://graph.threads.net/' + (this.graphApiVersion ? this.graphApiVersion + '/' : '');
    public authorizationBaseUrl = 'https://threads.net';

    public buildGraphApiUrl = (
        path: string,
        searchParams: Record<string, string>,
        accessToken?: string | null,
        base_url?: string | null
    ) => {
        const url = new URL(path, base_url ?? this.graphApiBaseUrl);

        url.search = new URLSearchParams(searchParams).toString();
        if (accessToken) {
            url.searchParams.append(PARAMS__ACCESS_TOKEN, accessToken);
        }

        return url.toString();
    };

    public getAuthorizationUrl = (params: AuthParams): string => {
        const url = this.buildGraphApiUrl(
            'oauth/authorize',
            {
                [PARAMS__SCOPE]: params.scopes.join(','),
                [PARAMS__CLIENT_ID]: params.clientId,
                [PARAMS__REDIRECT_URI]: params.redirectUri,
                [PARAMS__RESPONSE_TYPE]: 'code',
            },
            null,
            this.authorizationBaseUrl
        );

        return url;
    };

    public exchangeCodeForToken = async (params: TokenParams): Promise<TokenResponse> => {
        const uri = this.buildGraphApiUrl('oauth/access_token', {}, null, this.graphApiBaseUrl);

        const response = await got.post(uri, {
            form: {
                client_id: params.clientId,
                client_secret: params.clientSecret,
                code: params.code,
                grant_type: 'authorization_code',
                redirect_uri: params.redirectUri,
            },
            responseType: 'json',
            throwHttpErrors: false,
        });

        if (response.statusCode === 200) {
            return response.body as TokenResponse;
        } else {
            throw new Error((response.body as ErrorResponse).error.message);
        }
    };

    public getUserProfile = async (params: GetProfileParams): Promise<ProfileResponse> => {
        const { accessToken, username, fields } = params;

        const getUserDetailsUrl = this.buildGraphApiUrl(
            username,
            {
                [PARAMS__FIELDS]: fields.join(','),
            },
            accessToken
        );

        const response = await got.get(getUserDetailsUrl, { responseType: 'json', throwHttpErrors: false });

        if (response.statusCode === 200) {
            return response.body as ProfileResponse;
        } else {
            throw new Error((response.body as ErrorResponse).error.message);
        }
    };

    public getInsights = async (params: GetUserInsightsParams): Promise<UserInsightsResponse> => {
        const { accessToken, userId, metric, since, until } = params;

        const queryThreadUrl = this.buildGraphApiUrl(
            `${userId}/threads_insights`,
            {
                [PARAMS__METRIC]: metric,
                ...(since ? { [PARAMS__SINCE]: since } : {}),
                ...(until ? { [PARAMS__UNTIL]: until } : {}),
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
}

export default ThreadsSDK;
