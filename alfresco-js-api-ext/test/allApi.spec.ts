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

import { AlfrescoApi, NodesApi, RenditionsApi, SearchApi } from '@alfresco/js-api';
import { AllApi } from '../src/api/content-rest-api/api/all.api';

describe('All', () => {

    // New Api to get a paginated list of ACS Node Ids
    let allApi: AllApi;

    // Existing Apis
    let nodesApi: NodesApi;
    let renditionsApi: RenditionsApi;
    let searchApi: SearchApi;

    // Authentication via user/password in ACS listening to port 8080 in localhost
    // Running ACS instance with "alfresco-remote-api-ext" addon applied is required
    beforeEach((done) => {
        const hostEcm = 'http://127.0.0.1:8080';
        const alfrescoJsApi = new AlfrescoApi({
            hostEcm
        });
        alfrescoJsApi.login('admin', 'admin').then(
            () => {
                done();
            },
            (error: any) => {
                console.log('error ' + JSON.stringify(error));
            }
        );
        allApi = new AllApi(alfrescoJsApi);
        nodesApi = new NodesApi(alfrescoJsApi);
        renditionsApi = new RenditionsApi(alfrescoJsApi);
        searchApi = new SearchApi(alfrescoJsApi);
    });

    // Get Node Ids from ACS using default pagination values (maxItems=100, skipCount=0)
    // Once the first 100 nodes have been retrieved, following invocations can be made 
    // by adding "maxItems" to "skipCount". For instance, for the second invocation
    // (maxItems=100, skipCount=100)
    describe('Get All Ids', () => {
        it('All Ids (default)', (done) => {
            allApi.getAll().then((data) => {
                data.list?.entries?.forEach(item => {
                    console.log(item.entry.id);
                })
                console.log("count:        " + data.list?.pagination?.count);
                console.log("maxItems:     " + data.list?.pagination?.maxItems);
                console.log("hasMoreItems: " + data.list?.pagination?.hasMoreItems);
                console.log("skipCount:    " + data.list?.pagination?.skipCount);
                console.log("totalItems:   " + data.list?.pagination?.totalItems);
                done();
            });
        });
    });

    // Get Node Ids from a path in ACS with:
    //   * query including a path ending with "/*" that means every children recursively
    //   * sorting by ID (order is always required for paginating to work)
    //   * retrieving only the ID of the node to decrease bandwidth
    //   * sample pagination values
    describe('Get Ids by Path', () => {
        it('All Ids (path)', (done) => {
            const query = {
                query: {
                    query: 'PATH:"/app:company_home/st:sites/cm:swsdp//*"',
                    language: 'afts'
                },
                sort: [
                    {
                      "type": "FIELD",
                      "field": "id",
                      "ascending": true
                    }
                ],
                fields: [ 
                    "id" 
                ]
                ,
                paging: {
                    "maxItems": 10,
                    "skipCount": 8
                }
            };
            searchApi.search(query).then((data) => {
                data.list?.entries?.forEach(item => {
                    nodesApi.getNode(item.entry.id).then((node) => {
                        console.log(node.entry.id);
                    })
                })
                console.log("count:        " + data.list?.pagination?.count);
                console.log("maxItems:     " + data.list?.pagination?.maxItems);
                console.log("hasMoreItems: " + data.list?.pagination?.hasMoreItems);
                console.log("skipCount:    " + data.list?.pagination?.skipCount);
                console.log("totalItems:   " + data.list?.pagination?.totalItems);
                done();
            });
        });
    });

    // Get Node Ids using AFTS expression:
    //   * query to retrieve all nodes in ACS of TYPE Content
    //   * sorting by ID (order is always required for paginating to work)
    //   * retrieving only the ID of the node to decrease bandwidth
    //   * sample pagination values
    describe('Get Ids by Search', () => {
        it('All Ids (search)', (done) => {
            const query = {
                query: {
                    query: 'TYPE:"cm:content"',
                    language: 'afts'
                },
                sort: [
                    {
                      "type": "FIELD",
                      "field": "id",
                      "ascending": true
                    }
                ],
                fields: [ 
                    "id" 
                ]
                ,
                paging: {
                    "maxItems": 10,
                    "skipCount": 8
                }
            };
            searchApi.search(query).then((data) => {
                data.list?.entries?.forEach(item => {
                    nodesApi.getNode(item.entry.id).then((node) => {
                        console.log(node.entry.id);
                    })
                })
                console.log("count:        " + data.list?.pagination?.count);
                console.log("maxItems:     " + data.list?.pagination?.maxItems);
                console.log("hasMoreItems: " + data.list?.pagination?.hasMoreItems);
                console.log("skipCount:    " + data.list?.pagination?.skipCount);
                console.log("totalItems:   " + data.list?.pagination?.totalItems);
                done();
            });
        });
    });

    // Get ACS Node Metadata
    // This test is using "getAll" to retrieve the ID of a single node, 
    // but it's not required if the ID of the node is known
    describe('Get One Node Metadata', () => {
        it('One Node', (done) => {
            const opts = {
                'skipCount': 400,
                'maxItems': 1
            };
            allApi.getAll(opts).then((data) => {
                data.list?.entries?.forEach(item => {
                    nodesApi.getNode(item.entry.id).then((node) => {
                        console.log(node);
                    })
                })
                done();
            });
        });

    });

    // Get renditions available for an ACS Node
    // The list may be different according to Transform Service configuration
    // This test is using "getAll" to retrieve the ID of a single node, 
    // but it's not required if the ID of the node is known
    describe('Get One Node Rendition List', () => {
        it('One Node Rendition List', (done) => {
            const opts = {
                'skipCount': 800,
                'maxItems': 1
            };
            allApi.getAll(opts).then((data) => {
                data.list?.entries?.forEach(item => {
                    nodesApi.getNode(item.entry.id).then((node) => {
                        if (node.entry.isFile) {
                            renditionsApi.listRenditions(node.entry.id).then((renditions) => {
                              renditions.list?.entries?.forEach(rendition => {
                                  console.log(rendition);
                              });
                            });
                        } else {
                            console.log('The node ' + node.entry.id + " is a folder, no rendition available")
                        }
                    })
                })
                done();
            });
        });

    });

    // Get rendition content for an ACS Node
    // This test request to create the 'pdf' rendition if is not available
    describe('Get One Node Rendition', () => {
        it('Get One Node Rendition', (done) => {
            const query = {
                query: {
                    query: 'cm:name:"Meeting Notes 2011-01-27.doc"',
                    language: 'afts'
                }
            };
            searchApi.search(query).then((data) => {
                data.list?.entries?.forEach(item => {
                    renditionsApi.getRendition(item.entry.id, 'pdf').then((rendition) => {
                        if (rendition.entry.status == 'NOT_CREATED') {
                            const renditionType = {
                                'id': 'pdf'
                            }
                            renditionsApi.createRendition(item.entry.id, renditionType).then(() => {
                                console.log("Rendition requested");
                            })
                        } else {
                            console.log("Rendition available:");
                            renditionsApi.getRenditionContent(item.entry.id, 'pdf').then((blob) => {
                                console.log(blob);
                            })
                        }
                    })
                })
                done();
            });
        });

    });

});
