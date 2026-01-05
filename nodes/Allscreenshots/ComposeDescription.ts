import type { INodeProperties } from 'n8n-workflow';

export const composeOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['compose'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Compose multiple screenshots into a single image',
				action: 'Create composed screenshot',
			},
			{
				name: 'Get Status',
				value: 'getStatus',
				description: 'Get the status of a compose job',
				action: 'Get compose job status',
			},
			{
				name: 'List Jobs',
				value: 'list',
				description: 'List all compose jobs',
				action: 'List compose jobs',
			},
		],
		default: 'create',
	},
];

export const composeFields: INodeProperties[] = [
	// ========== URLs ==========
	{
		displayName: 'URLs',
		name: 'urls',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'https://example.com\nhttps://example.com/about\nhttps://example.com/contact',
		description: 'URLs to compose into a single image, one per line (maximum 20 URLs)',
		typeOptions: {
			rows: 4,
		},
		displayOptions: {
			show: {
				resource: ['compose'],
				operation: ['create'],
			},
		},
	},

	// ========== Layout ==========
	{
		displayName: 'Layout',
		name: 'layout',
		type: 'options',
		default: 'grid',
		description: 'How to arrange the screenshots in the composed image',
		displayOptions: {
			show: {
				resource: ['compose'],
				operation: ['create'],
			},
		},
		options: [
			{
				name: 'Auto',
				value: 'auto',
				description: 'Automatically choose the best layout based on number of images',
			},
			{
				name: 'Grid',
				value: 'grid',
				description: 'Arrange screenshots in a grid pattern',
			},
			{
				name: 'Masonry',
				value: 'masonry',
				description: 'Pinterest-style masonry layout',
			},
			{
				name: 'Mondrian',
				value: 'mondrian',
				description: 'Artistic Mondrian-style layout with varied sizes',
			},
		],
	},

	// ========== Async Mode ==========
	{
		displayName: 'Async Mode',
		name: 'async',
		type: 'boolean',
		default: true,
		description: 'Whether to run the compose job asynchronously. Recommended for more than 2-3 URLs.',
		displayOptions: {
			show: {
				resource: ['compose'],
				operation: ['create'],
			},
		},
	},

	// ========== Binary Property Name (for sync) ==========
	{
		displayName: 'Put Output in Field',
		name: 'binaryPropertyName',
		type: 'string',
		default: 'data',
		description: 'The name of the output binary field to store the composed image',
		displayOptions: {
			show: {
				resource: ['compose'],
				operation: ['create'],
				async: [false],
			},
		},
	},

	// ========== Compose Job ID ==========
	{
		displayName: 'Compose Job ID',
		name: 'composeJobId',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'compose_abc123...',
		description: 'The ID of the compose job',
		displayOptions: {
			show: {
				resource: ['compose'],
				operation: ['getStatus'],
			},
		},
	},

	// ========== Compose Options ==========
	{
		displayName: 'Compose Options',
		name: 'composeOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['compose'],
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
				],
			},
			{
				displayName: 'Quality',
				name: 'quality',
				type: 'number',
				default: 90,
				description: 'Image quality (1-100). Only applies to JPEG and WebP.',
				typeOptions: {
					minValue: 1,
					maxValue: 100,
				},
			},
			{
				displayName: 'Spacing',
				name: 'spacing',
				type: 'number',
				default: 10,
				description: 'Space between screenshots in pixels (0-100)',
				typeOptions: {
					minValue: 0,
					maxValue: 100,
				},
			},
			{
				displayName: 'Padding',
				name: 'padding',
				type: 'number',
				default: 0,
				description: 'Padding around the composed image in pixels (0-100)',
				typeOptions: {
					minValue: 0,
					maxValue: 100,
				},
			},
			{
				displayName: 'Background Color',
				name: 'background',
				type: 'string',
				default: '#ffffff',
				placeholder: '#ffffff or transparent',
				description: 'Background color (hex code or "transparent")',
			},
			{
				displayName: 'Max Width',
				name: 'maxWidth',
				type: 'number',
				default: 0,
				description: 'Maximum width of the composed image (0 = no limit)',
				typeOptions: {
					minValue: 0,
					maxValue: 10000,
				},
			},
			{
				displayName: 'Max Height',
				name: 'maxHeight',
				type: 'number',
				default: 0,
				description: 'Maximum height of the composed image (0 = no limit)',
				typeOptions: {
					minValue: 0,
					maxValue: 10000,
				},
			},
		],
	},

	// ========== Screenshot Defaults ==========
	{
		displayName: 'Screenshot Defaults',
		name: 'screenshotDefaults',
		type: 'collection',
		placeholder: 'Add Default',
		default: {},
		description: 'Default options for each screenshot in the composition',
		displayOptions: {
			show: {
				resource: ['compose'],
				operation: ['create'],
			},
		},
		options: [
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
				displayName: 'Dark Mode',
				name: 'darkMode',
				type: 'boolean',
				default: false,
				description: 'Whether to emulate dark mode',
			},
		],
	},
];
