import type {
	IDataObject,
	IHookFunctions,
	INodeType,
	INodeTypeDescription,
	IWebhookFunctions,
	IWebhookResponseData,
} from 'n8n-workflow';
import { createHmac, timingSafeEqual } from 'crypto';
import { allscreenshotsApiRequest } from './GenericFunctions';

export class AllscreenshotsTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Allscreenshots Trigger',
		name: 'allscreenshotsTrigger',
		icon: 'file:allscreenshots.svg',
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["event"]}}',
		description: 'Receive webhook notifications from Allscreenshots when screenshots are captured',
		defaults: {
			name: 'Allscreenshots Trigger',
		},
		inputs: [],
		outputs: ['main'],
		credentials: [
			{
				name: 'allscreenshotsApi',
				required: true,
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
			{
				displayName: 'Event',
				name: 'event',
				type: 'options',
				required: true,
				default: 'JOB_COMPLETED',
				description: 'The event type to listen for',
				options: [
					{
						name: 'All Events',
						value: '*',
						description: 'Receive all event types',
					},
					{
						name: 'Screenshot Completed',
						value: 'JOB_COMPLETED',
						description: 'Triggered when any async screenshot job completes',
					},
					{
						name: 'Screenshot Failed',
						value: 'JOB_FAILED',
						description: 'Triggered when an async screenshot job fails',
					},
					{
						name: 'Bulk Job Completed',
						value: 'BULK_COMPLETED',
						description: 'Triggered when a bulk job completes all screenshots',
					},
					{
						name: 'Compose Completed',
						value: 'COMPOSE_COMPLETED',
						description: 'Triggered when a compose job finishes',
					},
				],
			},
		],
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');
				const webhookUrl = this.getNodeWebhookUrl('default') as string;

				if (webhookData.webhookId) {
					try {
						const response = await allscreenshotsApiRequest.call(
							this,
							'GET',
							`/v1/webhooks/${webhookData.webhookId}`,
						);
						return response.url === webhookUrl;
					} catch {
						// Webhook doesn't exist anymore
						return false;
					}
				}
				return false;
			},

			async create(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default') as string;
				const event = this.getNodeParameter('event') as string;

				const body: IDataObject = {
					url: webhookUrl,
					events: event === '*' ? ['*'] : [event],
				};

				try {
					const response = await allscreenshotsApiRequest.call(
						this,
						'POST',
						'/v1/webhooks',
						body,
					);

					const webhookData = this.getWorkflowStaticData('node');
					webhookData.webhookId = response.id;
					if (response.secret) {
						webhookData.webhookSecret = response.secret;
					}

					return true;
				} catch {
					// If webhook creation fails, log but don't throw
					// The workflow will still work if the user manually configures webhooks
					return false;
				}
			},

			async delete(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');

				if (webhookData.webhookId) {
					try {
						await allscreenshotsApiRequest.call(
							this,
							'DELETE',
							`/v1/webhooks/${webhookData.webhookId}`,
						);
					} catch {
						// Ignore deletion errors - webhook may already be deleted
					}
					delete webhookData.webhookId;
					delete webhookData.webhookSecret;
				}

				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const req = this.getRequestObject();
		const body = req.body as IDataObject;
		const webhookData = this.getWorkflowStaticData('node');
		const event = this.getNodeParameter('event') as string;

		// Verify webhook signature if secret exists
		if (webhookData.webhookSecret && req.headers['x-webhook-signature']) {
			const signature = req.headers['x-webhook-signature'] as string;
			const expectedSignature =
				'sha256=' +
				createHmac('sha256', webhookData.webhookSecret as string)
					.update(JSON.stringify(body))
					.digest('hex');

			// Use timing-safe comparison
			try {
				const signatureBuffer = Buffer.from(signature);
				const expectedBuffer = Buffer.from(expectedSignature);
				if (
					signatureBuffer.length !== expectedBuffer.length ||
					!timingSafeEqual(signatureBuffer, expectedBuffer)
				) {
					return {
						webhookResponse: 'Invalid signature',
					};
				}
			} catch {
				// If comparison fails, reject
				return {
					webhookResponse: 'Invalid signature',
				};
			}
		}

		// Filter by event type if not wildcard
		if (event !== '*' && body.event !== event) {
			return {
				webhookResponse: 'Event filtered',
			};
		}

		// Return the webhook data for the workflow
		return {
			workflowData: [this.helpers.returnJsonArray([body])],
		};
	}
}
