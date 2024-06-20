import { BaseResource } from './base.js';
import { User } from './user.js';
import { Insights } from './insights.js';

export {
    AuthScopes,
    MediaMetricData,
    ProfileResponse,
    ProfileFields,
    ThreadsFields,
    UserTimeSeriesMetricData,
    UserTotalValueMetricData,
} from './types';

const resources: Record<string, any> = {
    Insights,
    User,
};

export interface ThreadsSDK extends BaseResource {
    Insights: Insights;
    User: User;
    [key: string]: any; // Add an index signature to allow indexing with a string
}

export class ThreadsSDK extends BaseResource {
    constructor() {
        super();

        // Attach the sub-resources to this wrapper
        Object.keys(resources).forEach((s) => {
            this[s] = new resources[s]();
        });
    }
}

export default ThreadsSDK;
