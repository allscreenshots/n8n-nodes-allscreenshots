import type { INodeProperties } from 'n8n-workflow';

export const bulkOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['bulk'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a bulk screenshot job (up to 100 URLs)',
				action: 'Create bulk screenshot job',
			},
			{
				name: 'Get Status',
				value: 'getStatus',
				description: 'Get the status of a bulk job',
				action: 'Get bulk job status',
			},
			{
				name: 'List All',
				value: 'list',
				description: 'List all bulk jobs',
				action: 'List bulk jobs',
			},
			{
				name: 'Cancel',
				value: 'cancel',
				description: 'Cancel a bulk job',
				action: 'Cancel bulk job',
			},
		],
		default: 'create',
	},
];

export const bulkFields: INodeProperties[] = [
	// ========== URLs ==========
	{
		displayName: 'URLs',
		name: 'urls',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'https://example1.com\nhttps://example2.com\nhttps://example3.com',
		description: 'URLs to capture, one per line (maximum 100 URLs)',
		typeOptions: {
			rows: 6,
		},
		displayOptions: {
			show: {
				resource: ['bulk'],
				operation: ['create'],
			},
		},
	},

	// ========== Bulk Job ID ==========
	{
		displayName: 'Bulk Job ID',
		name: 'bulkJobId',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'bulk_abc123...',
		description: 'The ID of the bulk job',
		displayOptions: {
			show: {
				resource: ['bulk'],
				operation: ['getStatus', 'cancel'],
			},
		},
	},

	// ========== Screenshot Options (for bulk create) ==========
	{
		displayName: 'Screenshot Options',
		name: 'screenshotOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		description: 'Default options applied to all URLs in the bulk job',
		displayOptions: {
			show: {
				resource: ['bulk'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Format',
				name: 'format',
				type: 'options',
				default: 'png',
				description: 'Output image format',
				options: [
					{ name: 'PNG', value: 'png' },
					{ name: 'JPEG', value: 'jpeg' },
					{ name: 'WebP', value: 'webp' },
					{ name: 'PDF', value: 'pdf' },
				],
			},
			{
				displayName: 'Full Page',
				name: 'fullPage',
				type: 'boolean',
				default: false,
				description: 'Whether to capture the entire scrollable page',
			},
			{
				displayName: 'Width',
				name: 'width',
				type: 'number',
				default: 1920,
				description: 'Viewport width in pixels',
				typeOptions: {
					minValue: 320,
					maxValue: 3840,
				},
			},
			{
				displayName: 'Height',
				name: 'height',
				type: 'number',
				default: 1080,
				description: 'Viewport height in pixels',
				typeOptions: {
					minValue: 240,
					maxValue: 2160,
				},
			},
			{
				displayName: 'Quality',
				name: 'quality',
				type: 'number',
				default: 80,
				description: 'Image quality (1-100). Only applies to JPEG and WebP.',
				typeOptions: {
					minValue: 1,
					maxValue: 100,
				},
			},
			{
				displayName: 'Block Ads',
				name: 'blockAds',
				type: 'boolean',
				default: false,
				description: 'Whether to block advertisements',
			},
			{
				displayName: 'Block Cookie Banners',
				name: 'blockCookieBanners',
				type: 'boolean',
				default: false,
				description: 'Whether to block cookie consent banners',
			},
		],
	},

	// ========== Webhook Options ==========
	{
		displayName: 'Webhook Options',
		name: 'webhookOptions',
		type: 'collection',
		placeholder: 'Add Webhook Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['bulk'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Webhook URL',
				name: 'webhookUrl',
				type: 'string',
				default: '',
				placeholder: 'https://your-server.com/webhook',
				description: 'URL to receive webhook notifications when the bulk job completes',
			},
			{
				displayName: 'Webhook Secret',
				name: 'webhookSecret',
				type: 'string',
				typeOptions: {
					password: true,
				},
				default: '',
				description: 'Secret for webhook signature verification',
			},
		],
	},
];
