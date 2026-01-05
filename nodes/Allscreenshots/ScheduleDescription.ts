import type { INodeProperties } from 'n8n-workflow';

export const scheduleOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['schedule'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new scheduled screenshot',
				action: 'Create a schedule',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a schedule by ID',
				action: 'Get a schedule',
			},
			{
				name: 'List All',
				value: 'list',
				description: 'List all schedules',
				action: 'List all schedules',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a schedule',
				action: 'Update a schedule',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a schedule',
				action: 'Delete a schedule',
			},
			{
				name: 'Pause',
				value: 'pause',
				description: 'Pause a schedule',
				action: 'Pause a schedule',
			},
			{
				name: 'Resume',
				value: 'resume',
				description: 'Resume a paused schedule',
				action: 'Resume a schedule',
			},
			{
				name: 'Trigger Now',
				value: 'trigger',
				description: 'Manually trigger a schedule immediately',
				action: 'Trigger schedule now',
			},
			{
				name: 'Get History',
				value: 'getHistory',
				description: 'Get execution history for a schedule',
				action: 'Get schedule history',
			},
		],
		default: 'list',
	},
];

export const scheduleFields: INodeProperties[] = [
	// ========== Schedule ID (for operations that need it) ==========
	{
		displayName: 'Schedule ID',
		name: 'scheduleId',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'schedule_abc123...',
		description: 'The ID of the schedule',
		displayOptions: {
			show: {
				resource: ['schedule'],
				operation: ['get', 'update', 'delete', 'pause', 'resume', 'trigger', 'getHistory'],
			},
		},
	},

	// ========== Create Fields ==========
	{
		displayName: 'Schedule Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'Daily Homepage Screenshot',
		description: 'A descriptive name for this schedule',
		displayOptions: {
			show: {
				resource: ['schedule'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'URL',
		name: 'url',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'https://example.com',
		description: 'The URL to capture on schedule',
		displayOptions: {
			show: {
				resource: ['schedule'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Cron Expression',
		name: 'cron',
		type: 'string',
		required: true,
		default: '0 9 * * *',
		placeholder: '0 9 * * *',
		description:
			'Cron expression defining the schedule. Examples: "0 9 * * *" (9 AM daily), "0 */6 * * *" (every 6 hours), "0 0 * * 1" (midnight on Mondays).',
		displayOptions: {
			show: {
				resource: ['schedule'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Timezone',
		name: 'timezone',
		type: 'string',
		default: 'UTC',
		placeholder: 'America/New_York',
		description:
			'Timezone for the schedule in IANA format (e.g., America/New_York, Europe/London, Asia/Tokyo)',
		displayOptions: {
			show: {
				resource: ['schedule'],
				operation: ['create'],
			},
		},
	},

	// ========== Update Fields ==========
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field to Update',
		default: {},
		displayOptions: {
			show: {
				resource: ['schedule'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Schedule Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'New name for the schedule',
			},
			{
				displayName: 'URL',
				name: 'url',
				type: 'string',
				default: '',
				description: 'New URL to capture',
			},
			{
				displayName: 'Cron Expression',
				name: 'schedule',
				type: 'string',
				default: '',
				description: 'New cron expression',
			},
			{
				displayName: 'Timezone',
				name: 'timezone',
				type: 'string',
				default: '',
				description: 'New timezone',
			},
			{
				displayName: 'Retention Days',
				name: 'retentionDays',
				type: 'number',
				default: 30,
				description: 'How many days to keep captured screenshots (1-365)',
				typeOptions: {
					minValue: 1,
					maxValue: 365,
				},
			},
		],
	},

	// ========== Schedule Options (for create) ==========
	{
		displayName: 'Screenshot Options',
		name: 'scheduleOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['schedule'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Format',
				name: 'format',
				type: 'options',
				default: 'png',
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
				typeOptions: { minValue: 320, maxValue: 3840 },
			},
			{
				displayName: 'Height',
				name: 'height',
				type: 'number',
				default: 1080,
				typeOptions: { minValue: 240, maxValue: 2160 },
			},
			{
				displayName: 'Dark Mode',
				name: 'darkMode',
				type: 'boolean',
				default: false,
			},
			{
				displayName: 'Block Ads',
				name: 'blockAds',
				type: 'boolean',
				default: false,
			},
			{
				displayName: 'Block Cookie Banners',
				name: 'blockCookieBanners',
				type: 'boolean',
				default: false,
			},
		],
	},

	// ========== Webhook Options (for create) ==========
	{
		displayName: 'Webhook URL',
		name: 'webhookUrl',
		type: 'string',
		default: '',
		placeholder: 'https://your-server.com/webhook',
		description: 'URL to receive webhook notifications when scheduled screenshots are captured',
		displayOptions: {
			show: {
				resource: ['schedule'],
				operation: ['create'],
			},
		},
	},

	// ========== Retention (for create) ==========
	{
		displayName: 'Retention Days',
		name: 'retentionDays',
		type: 'number',
		default: 30,
		description: 'How many days to keep captured screenshots (1-365)',
		typeOptions: {
			minValue: 1,
			maxValue: 365,
		},
		displayOptions: {
			show: {
				resource: ['schedule'],
				operation: ['create'],
			},
		},
	},

	// ========== History Options ==========
	{
		displayName: 'Options',
		name: 'historyOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['schedule'],
				operation: ['getHistory'],
			},
		},
		options: [
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				default: 50,
				description: 'Maximum number of executions to return',
				typeOptions: {
					minValue: 1,
					maxValue: 100,
				},
			},
		],
	},
];
