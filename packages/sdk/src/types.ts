export type AuthScopes =
    | 'threads_basic'
    | 'threads_content_publish'
    | 'threads_manage_insights'
    | 'threads_manage_replies'
    | 'threads_read_replies';

export interface AuthParams {
    clientId: string;
    redirectUri: string;
    scopes: AuthScopes[];
    state?: string;
}

export interface TokenParams {
    clientId: string;
    clientSecret: string;
    code: string;
    redirectUri: string;
}

export interface TokenResponse {
    access_token: string;
    user_id: string;
}

export interface ErrorResponse {
    error: {
        message: string;
        type: string;
        code: number;
        error_subcode: number;
        fbtrace_id: string;
    };
}

export interface GetProfileParams {
    accessToken: string;
    username: string;
    fields: ProfileFields[];
}

export interface ProfileResponse {
    id: string;
    username: string;
    threads_profile_picture_url: string;
    threads_biography: string;
}

enum ProfileFieldsEnum {
    ID = 'id',
    USERNAME = 'username',
    BIOGRAPHY = 'threads_biography',
    PROFILE_PICTURE = 'threads_profile_picture_url',
}
// values of ProfileFieldsEnum
export type ProfileFields = `${ProfileFieldsEnum}`;

export type MetricTypes = 'likes' | 'replies' | 'reposts' | 'quotes';

export type AccountMetricTypes = MetricTypes | 'followers_count' | 'follower_demographics';

export interface GetUserInsightsParams {
    accessToken: string;
    userId: string;
    metric: string;
    since?: string;
    until?: string;
}

export interface UserInsightsResponse {
    data: (UserTimeSeriesMetricData | UserTotalValueMetricData)[];
}

export interface UserTimeSeriesMetricData {
    name: 'views';
    period: string;
    values: {
        value: number;
        end_time: string;
    }[];
    title: string;
    description: string;
    id: string;
}

export interface UserTotalValueMetricData {
    name: AccountMetricTypes;
    total_value: {
        value: number;
    };
    title: string;
    description: string;
    id: string;
}

export interface GetMediaInsightsParams {
    accessToken: string;
    mediaId: string;
    metric: MetricTypes;
}

export interface MediaInsightsResponse {
    data: MediaMetricData[];
}

export interface MediaMetricData {
    name: MetricTypes;
    period: string;
    values: {
        value: number;
    }[];
    title: string;
    description: string;
    id: string;
}
