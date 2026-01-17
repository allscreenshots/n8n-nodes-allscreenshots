import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

import {
	allscreenshotsApiRequest,
	allscreenshotsApiRequestBinary,
	buildScreenshotPayload,
	buildBulkPayload,
	buildComposePayload,
} from './GenericFunctions';

import { screenshotOperations, screenshotFields } from './ScreenshotDescription';
import { asyncJobOperations, asyncJobFields } from './AsyncJobDescription';
import { bulkOperations, bulkFields } from './BulkDescription';
import { composeOperations, composeFields } from './ComposeDescription';
import { usageOperations, usageFields } from './UsageDescription';

export class Allscreenshots implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Allscreenshots',
		name: 'allscreenshots',
		icon: 'file:allscreenshots.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + " " + $parameter["resource"]}}',
		description: 'Capture and manage website screenshots with Allscreenshots API',
		defaults: {
			name: 'Allscreenshots',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'allscreenshotsApi',
				required: true,
			},
		],
		properties: [
			// Resource selector
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Screenshot',
						value: 'screenshot',
						description: 'Capture screenshots of webpages',
					},
					{
						name: 'Async Job',
						value: 'asyncJob',
						description: 'Manage asynchronous screenshot jobs',
					},
					{
						name: 'Bulk Screenshot',
						value: 'bulk',
						description: 'Capture multiple screenshots at once (up to 100 URLs)',
					},
					{
						name: 'Compose',
						value: 'compose',
						description: 'Combine multiple screenshots into one image',
					},
					{
						name: 'Usage',
						value: 'usage',
						description: 'Check API usage and quota',
					},
				],
				default: 'screenshot',
			},
			// All operations and fields
			...screenshotOperations,
			...screenshotFields,
			...asyncJobOperations,
			...asyncJobFields,
			...bulkOperations,
			...bulkFields,
			...composeOperations,
			...composeFields,
			...usageOperations,
			...usageFields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				// =====================
				// SCREENSHOT RESOURCE
				// =====================
				if (resource === 'screenshot') {
					if (operation === 'capture') {
						// Sync capture - returns binary
						const params = {
							url: this.getNodeParameter('url', i) as string,
							device: this.getNodeParameter('device', i, '') as string,
							fullPage: this.getNodeParameter('fullPage', i, false) as boolean,
							darkMode: this.getNodeParameter('darkMode', i, false) as boolean,
							blockCookieBanners: this.getNodeParameter('blockCookieBanners', i, false) as boolean,
							viewportOptions: this.getNodeParameter('viewportOptions', i, {}) as IDataObject,
							outputOptions: this.getNodeParameter('outputOptions', i, {}) as IDataObject,
							waitOptions: this.getNodeParameter('waitOptions', i, {}) as IDataObject,
							pageModifications: this.getNodeParameter('pageModifications', i, {}) as IDataObject,
							blockingOptions: this.getNodeParameter('blockingOptions', i, {}) as IDataObject,
						};

						const body = buildScreenshotPayload(params);
						const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i, 'data') as string;
						const outputOptions = params.outputOptions as IDataObject;
						const format = (outputOptions.format as string) || 'png';

						const binaryData = await allscreenshotsApiRequestBinary.call(
							this,
							'POST',
							'/v1/screenshots',
							body,
						);

						const mimeType = format === 'pdf' ? 'application/pdf' : `image/${format}`;
						const fileName = `screenshot.${format}`;

						returnData.push({
							json: {
								success: true,
								url: params.url,
								format,
							},
							binary: {
								[binaryPropertyName]: await this.helpers.prepareBinaryData(
									binaryData,
									fileName,
									mimeType,
								),
							},
							pairedItem: { item: i },
						});
					} else if (operation === 'captureAsync') {
						// Async capture - returns job info
						const params = {
							url: this.getNodeParameter('url', i) as string,
							device: this.getNodeParameter('device', i, '') as string,
							fullPage: this.getNodeParameter('fullPage', i, false) as boolean,
							darkMode: this.getNodeParameter('darkMode', i, false) as boolean,
							blockCookieBanners: this.getNodeParameter('blockCookieBanners', i, false) as boolean,
							viewportOptions: this.getNodeParameter('viewportOptions', i, {}) as IDataObject,
							outputOptions: this.getNodeParameter('outputOptions', i, {}) as IDataObject,
							waitOptions: this.getNodeParameter('waitOptions', i, {}) as IDataObject,
							pageModifications: this.getNodeParameter('pageModifications', i, {}) as IDataObject,
							blockingOptions: this.getNodeParameter('blockingOptions', i, {}) as IDataObject,
						};

						const body = buildScreenshotPayload(params);

						// Add webhook if provided
						const webhookUrl = this.getNodeParameter('webhookUrl', i, '') as string;
						if (webhookUrl) {
							body.webhookUrl = webhookUrl;
						}

						const response = await allscreenshotsApiRequest.call(
							this,
							'POST',
							'/v1/screenshots/async',
							body,
						);

						returnData.push({
							json: response,
							pairedItem: { item: i },
						});
					}
				}

				// =====================
				// ASYNC JOB RESOURCE
				// =====================
				else if (resource === 'asyncJob') {
					if (operation === 'getStatus') {
						const jobId = this.getNodeParameter('jobId', i) as string;
						const response = await allscreenshotsApiRequest.call(
							this,
							'GET',
							`/v1/screenshots/jobs/${jobId}`,
						);
						returnData.push({ json: response, pairedItem: { item: i } });
					} else if (operation === 'getResult') {
						const jobId = this.getNodeParameter('jobId', i) as string;
						const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i, 'data') as string;

						// First get job status to determine format
						const jobStatus = await allscreenshotsApiRequest.call(
							this,
							'GET',
							`/v1/screenshots/jobs/${jobId}`,
						);

						if (jobStatus.status !== 'COMPLETED') {
							throw new NodeOperationError(
								this.getNode(),
								`Job ${jobId} is not completed. Current status: ${jobStatus.status}`,
								{ itemIndex: i },
							);
						}

						const binaryData = await allscreenshotsApiRequestBinary.call(
							this,
							'GET',
							`/v1/screenshots/jobs/${jobId}/result`,
						);

						const metadata = jobStatus.metadata as IDataObject;
						const format = (metadata?.format as string) || 'png';
						const mimeType = format === 'pdf' ? 'application/pdf' : `image/${format}`;

						returnData.push({
							json: jobStatus,
							binary: {
								[binaryPropertyName]: await this.helpers.prepareBinaryData(
									binaryData,
									`screenshot.${format}`,
									mimeType,
								),
							},
							pairedItem: { item: i },
						});
					} else if (operation === 'cancel') {
						const jobId = this.getNodeParameter('jobId', i) as string;
						const response = await allscreenshotsApiRequest.call(
							this,
							'POST',
							`/v1/screenshots/jobs/${jobId}/cancel`,
						);
						returnData.push({ json: response, pairedItem: { item: i } });
					} else if (operation === 'list') {
						const options = this.getNodeParameter('listOptions', i, {}) as IDataObject;
						const qs: IDataObject = {};
						if (options.status) qs.status = options.status;
						if (options.limit) qs.limit = options.limit;

						const response = await allscreenshotsApiRequest.call(
							this,
							'GET',
							'/v1/screenshots/jobs',
							{},
							qs,
						);

						if (Array.isArray(response)) {
							for (const job of response) {
								returnData.push({ json: job as IDataObject, pairedItem: { item: i } });
							}
						} else {
							returnData.push({ json: response, pairedItem: { item: i } });
						}
					}
				}

				// =====================
				// BULK RESOURCE
				// =====================
				else if (resource === 'bulk') {
					if (operation === 'create') {
						const params = {
							urls: this.getNodeParameter('urls', i) as string,
							screenshotOptions: this.getNodeParameter('screenshotOptions', i, {}) as IDataObject,
						};

						const webhookOptions = this.getNodeParameter('webhookOptions', i, {}) as IDataObject;
						if (webhookOptions.webhookUrl) {
							(params as IDataObject).webhookUrl = webhookOptions.webhookUrl;
						}
						if (webhookOptions.webhookSecret) {
							(params as IDataObject).webhookSecret = webhookOptions.webhookSecret;
						}

						const body = buildBulkPayload(params);
						const response = await allscreenshotsApiRequest.call(
							this,
							'POST',
							'/v1/screenshots/bulk',
							body,
						);
						returnData.push({ json: response, pairedItem: { item: i } });
					} else if (operation === 'getStatus') {
						const bulkJobId = this.getNodeParameter('bulkJobId', i) as string;
						const response = await allscreenshotsApiRequest.call(
							this,
							'GET',
							`/v1/screenshots/bulk/${bulkJobId}`,
						);
						returnData.push({ json: response, pairedItem: { item: i } });
					} else if (operation === 'list') {
						const response = await allscreenshotsApiRequest.call(
							this,
							'GET',
							'/v1/screenshots/bulk',
						);

						if (Array.isArray(response)) {
							for (const job of response) {
								returnData.push({ json: job as IDataObject, pairedItem: { item: i } });
							}
						} else {
							returnData.push({ json: response, pairedItem: { item: i } });
						}
					} else if (operation === 'cancel') {
						const bulkJobId = this.getNodeParameter('bulkJobId', i) as string;
						const response = await allscreenshotsApiRequest.call(
							this,
							'POST',
							`/v1/screenshots/bulk/${bulkJobId}/cancel`,
						);
						returnData.push({ json: response, pairedItem: { item: i } });
					}
				}

				// =====================
				// COMPOSE RESOURCE
				// =====================
				else if (resource === 'compose') {
					if (operation === 'create') {
						const params = {
							urls: this.getNodeParameter('urls', i) as string,
							layout: this.getNodeParameter('layout', i, 'grid') as string,
							async: this.getNodeParameter('async', i, true) as boolean,
							composeOptions: this.getNodeParameter('composeOptions', i, {}) as IDataObject,
							screenshotDefaults: this.getNodeParameter('screenshotDefaults', i, {}) as IDataObject,
						};

						const body = buildComposePayload(params);

						if (params.async) {
							// Async compose - returns job info
							const response = await allscreenshotsApiRequest.call(
								this,
								'POST',
								'/v1/screenshots/compose',
								body,
							);
							returnData.push({ json: response, pairedItem: { item: i } });
						} else {
							// Sync compose - returns binary
							const binaryPropertyName = this.getNodeParameter(
								'binaryPropertyName',
								i,
								'data',
							) as string;
							const composeOptions = params.composeOptions as IDataObject;
							const format = (composeOptions.format as string) || 'png';

							const binaryData = await allscreenshotsApiRequestBinary.call(
								this,
								'POST',
								'/v1/screenshots/compose',
								body,
							);

							returnData.push({
								json: { success: true, format },
								binary: {
									[binaryPropertyName]: await this.helpers.prepareBinaryData(
										binaryData,
										`composed.${format}`,
										`image/${format}`,
									),
								},
								pairedItem: { item: i },
							});
						}
					} else if (operation === 'getStatus') {
						const composeJobId = this.getNodeParameter('composeJobId', i) as string;
						const response = await allscreenshotsApiRequest.call(
							this,
							'GET',
							`/v1/screenshots/compose/jobs/${composeJobId}`,
						);
						returnData.push({ json: response, pairedItem: { item: i } });
					} else if (operation === 'list') {
						const response = await allscreenshotsApiRequest.call(
							this,
							'GET',
							'/v1/screenshots/compose/jobs',
						);

						if (Array.isArray(response)) {
							for (const job of response) {
								returnData.push({ json: job as IDataObject, pairedItem: { item: i } });
							}
						} else {
							returnData.push({ json: response, pairedItem: { item: i } });
						}
					}
				}

				// =====================
				// USAGE RESOURCE
				// =====================
				else if (resource === 'usage') {
					if (operation === 'getStats') {
						const response = await allscreenshotsApiRequest.call(this, 'GET', '/v1/usage');
						returnData.push({ json: response, pairedItem: { item: i } });
					} else if (operation === 'getQuota') {
						const response = await allscreenshotsApiRequest.call(this, 'GET', '/v1/usage/quota');
						returnData.push({ json: response, pairedItem: { item: i } });
					}
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: { error: (error as Error).message },
						pairedItem: { item: i },
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
