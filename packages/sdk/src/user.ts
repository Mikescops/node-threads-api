import got from 'got';
import { BaseResource } from './base.js';
import { GetProfileParams, ProfileResponse, ErrorResponse } from './types';

export class User extends BaseResource {
    constructor() {
        super();
    }

    /**
     * Retrieve profile information about a user on Threads.
     * @param params
     * @returns
     */
    public getUserProfile = async (params: GetProfileParams): Promise<ProfileResponse> => {
        const { accessToken, username, fields } = params;

        const getUserDetailsUrl = this.buildGraphApiUrl(
            username,
            {
                fields: fields.join(','),
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
}
