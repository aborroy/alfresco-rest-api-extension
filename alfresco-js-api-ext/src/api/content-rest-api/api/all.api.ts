/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { ContentPagingQuery, NodePaging } from '@alfresco/js-api';
import { BaseApi } from './base.api';

/**
 * All service.
 * @module AllApi
 */
export class AllApi extends BaseApi {

    getAll(opts?: { path?: string } & ContentPagingQuery ): Promise<NodePaging> {

        const queryParams = {
            path: opts?.path,
            skipCount: opts?.skipCount,
            maxItems: opts?.maxItems,
        };

        return this.get({
            path: '/all',
            queryParams,
            returnType: NodePaging
        });

    }

}