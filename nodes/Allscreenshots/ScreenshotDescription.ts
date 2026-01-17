import type { INodeProperties } from 'n8n-workflow';

export const screenshotOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['screenshot'],
			},
		},
		options: [
			{
				name: 'Capture',
				value: 'capture',
				description: 'Take a screenshot of a webpage (synchronous)',
				action: 'Capture a screenshot',
			},
			{
				name: 'Capture Async',
				value: 'captureAsync',
				description: 'Start an async screenshot capture job',
				action: 'Start async screenshot capture',
			},
		],
		default: 'capture',
	},
];

export const screenshotFields: INodeProperties[] = [
	// ========== URL Field (required) ==========
	{
		displayName: 'URL',
		name: 'url',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'https://example.com',
		description: 'The URL of the webpage to capture',
		displayOptions: {
			show: {
				resource: ['screenshot'],
				operation: ['capture', 'captureAsync'],
			},
		},
	},

	// ========== Binary Property Name ==========
	{
		displayName: 'Put Output in Field',
		name: 'binaryPropertyName',
		type: 'string',
		default: 'data',
		description: 'The name of the output binary field to store the screenshot',
		displayOptions: {
			show: {
				resource: ['screenshot'],
				operation: ['capture'],
			},
		},
	},

	// ========== Device Preset ==========
	{
		displayName: 'Device Preset',
		name: 'device',
		type: 'options',
		default: '',
		description: 'Use a predefined device viewport. Overrides custom viewport settings.',
		displayOptions: {
			show: {
				resource: ['screenshot'],
				operation: ['capture', 'captureAsync'],
			},
		},
		options: [
			{ name: 'None (Use Custom Viewport)', value: '' },
			{ name: 'iPhone 12', value: 'iphone_12' },
			{ name: 'iPhone 12 Pro', value: 'iphone_12_pro' },
			{ name: 'iPhone 13', value: 'iphone_13' },
			{ name: 'iPhone 14', value: 'iphone_14' },
			{ name: 'iPhone 14 Pro', value: 'iphone_14_pro' },
			{ name: 'iPhone 15', value: 'iphone_15' },
			{ name: 'iPhone 15 Pro', value: 'iphone_15_pro' },
			{ name: 'iPhone 15 Pro Max', value: 'iphone_15_pro_max' },
			{ name: 'Samsung Galaxy S21', value: 'galaxy_s21' },
			{ name: 'Samsung Galaxy S23', value: 'galaxy_s23' },
			{ name: 'Google Pixel 5', value: 'pixel_5' },
			{ name: 'Google Pixel 6', value: 'pixel_6' },
			{ name: 'iPad', value: 'ipad' },
			{ name: 'iPad Pro 11"', value: 'ipad_pro_11' },
			{ name: 'iPad Pro 12.9"', value: 'ipad_pro_12_9' },
			{ name: 'iPad Air', value: 'ipad_air' },
			{ name: 'Samsung Galaxy Tab', value: 'galaxy_tab' },
			{ name: 'MacBook Air', value: 'macbook_air' },
			{ name: 'MacBook Pro 14"', value: 'macbook_pro_14' },
			{ name: 'MacBook Pro 16"', value: 'macbook_pro_16' },
			{ name: 'Desktop 1920x1080 (Full HD)', value: 'desktop_1080p' },
			{ name: 'Desktop 2560x1440 (2K)', value: 'desktop_1440p' },
			{ name: 'Desktop 3840x2160 (4K)', value: 'desktop_4k' },
		],
	},

	// ========== Common Options (Top Level) ==========
	{
		displayName: 'Full Page',
		name: 'fullPage',
		type: 'boolean',
		default: false,
		description: 'Whether to capture the entire scrollable page instead of just the viewport',
		displayOptions: {
			show: {
				resource: ['screenshot'],
				operation: ['capture', 'captureAsync'],
			},
		},
	},
	{
		displayName: 'Dark Mode',
		name: 'darkMode',
		type: 'boolean',
		default: false,
		description: 'Whether to emulate dark mode preference (prefers-color-scheme: dark)',
		displayOptions: {
			show: {
				resource: ['screenshot'],
				operation: ['capture', 'captureAsync'],
			},
		},
	},
	{
		displayName: 'Block Cookie Banners',
		name: 'blockCookieBanners',
		type: 'boolean',
		default: false,
		description: 'Whether to automatically dismiss/block cookie consent banners',
		displayOptions: {
			show: {
				resource: ['screenshot'],
				operation: ['capture', 'captureAsync'],
			},
		},
	},

	// ========== Viewport Options ==========
	{
		displayName: 'Viewport',
		name: 'viewportOptions',
		type: 'collection',
		placeholder: 'Add Viewport Option',
		default: {},
		description: 'Custom viewport settings. Ignored if a device preset is selected.',
		displayOptions: {
			show: {
				resource: ['screenshot'],
				operation: ['capture', 'captureAsync'],
			},
		},
		options: [
			{
				displayName: 'Width',
				name: 'width',
				type: 'number',
				default: 1920,
				description: 'Viewport width in pixels (320-3840)',
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
				description: 'Viewport height in pixels (240-2160)',
				typeOptions: {
					minValue: 240,
					maxValue: 2160,
				},
			},
			{
				displayName: 'Device Scale Factor',
				name: 'deviceScaleFactor',
				type: 'number',
				default: 1,
				description: 'Device pixel ratio (1-3). Use 2 for retina-quality screenshots.',
				typeOptions: {
					minValue: 1,
					maxValue: 3,
				},
			},
		],
	},

	// ========== Output Options ==========
	{
		displayName: 'Output Options',
		name: 'outputOptions',
		type: 'collection',
		placeholder: 'Add Output Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['screenshot'],
				operation: ['capture', 'captureAsync'],
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
				displayName: 'Quality',
				name: 'quality',
				type: 'number',
				default: 80,
				description: 'Image quality (1-100). Only applies to JPEG and WebP formats.',
				typeOptions: {
					minValue: 1,
					maxValue: 100,
				},
			},
			{
				displayName: 'Element Selector',
				name: 'selector',
				type: 'string',
				default: '',
				placeholder: '#main-content, .hero-section',
				description: 'CSS selector to capture a specific element instead of the full page',
			},
		],
	},

	// ========== Wait Options ==========
	{
		displayName: 'Wait Options',
		name: 'waitOptions',
		type: 'collection',
		placeholder: 'Add Wait Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['screenshot'],
				operation: ['capture', 'captureAsync'],
			},
		},
		options: [
			{
				displayName: 'Delay (ms)',
				name: 'delay',
				type: 'number',
				default: 0,
				description: 'Wait time in milliseconds before capturing (0-30000)',
				typeOptions: {
					minValue: 0,
					maxValue: 30000,
				},
			},
			{
				displayName: 'Wait for Selector',
				name: 'waitFor',
				type: 'string',
				default: '',
				placeholder: '.content-loaded, #dynamic-content',
				description: 'Wait for this CSS selector to appear before capturing',
			},
			{
				displayName: 'Wait Until',
				name: 'waitUntil',
				type: 'options',
				default: 'load',
				description: 'When to consider the page loaded',
				options: [
					{
						name: 'Load',
						value: 'load',
						description: 'Wait for the load event (all resources loaded)',
					},
					{
						name: 'DOM Content Loaded',
						value: 'domcontentloaded',
						description: 'Wait for DOMContentLoaded event (HTML parsed)',
					},
					{
						name: 'Network Idle',
						value: 'networkidle',
						description: 'Wait until no network requests for 500ms',
					},
				],
			},
			{
				displayName: 'Timeout (ms)',
				name: 'timeout',
				type: 'number',
				default: 30000,
				description: 'Maximum time to wait for the page to load (1000-60000)',
				typeOptions: {
					minValue: 1000,
					maxValue: 60000,
				},
			},
		],
	},

	// ========== Page Modifications ==========
	{
		displayName: 'Page Modifications',
		name: 'pageModifications',
		type: 'collection',
		placeholder: 'Add Page Modification',
		default: {},
		displayOptions: {
			show: {
				resource: ['screenshot'],
				operation: ['capture', 'captureAsync'],
			},
		},
		options: [
			{
				displayName: 'Custom CSS',
				name: 'customCss',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				default: '',
				placeholder: '.banner { display: none; }\n.popup { visibility: hidden; }',
				description: 'Custom CSS to inject into the page before capturing',
			},
			{
				displayName: 'Hide Selectors',
				name: 'hideSelectors',
				type: 'string',
				default: '',
				placeholder: '.cookie-banner, .newsletter-popup, .ads',
				description: 'Comma-separated CSS selectors of elements to hide',
			},
		],
	},

	// ========== Blocking Options ==========
	{
		displayName: 'Blocking Options',
		name: 'blockingOptions',
		type: 'collection',
		placeholder: 'Add Blocking Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['screenshot'],
				operation: ['capture', 'captureAsync'],
			},
		},
		options: [
			{
				displayName: 'Block Ads',
				name: 'blockAds',
				type: 'boolean',
				default: false,
				description: 'Whether to block advertisements',
			},
			{
				displayName: 'Block Level',
				name: 'blockLevel',
				type: 'options',
				default: 'none',
				description: 'Level of content blocking to apply using Hagezi blocklists',
				options: [
					{ name: 'None', value: 'none' },
					{ name: 'Light', value: 'light', description: 'Basic ad and tracker blocking' },
					{ name: 'Normal', value: 'normal', description: 'Standard blocking' },
					{ name: 'Pro', value: 'pro', description: 'Advanced blocking' },
					{ name: 'Pro Plus', value: 'pro_plus', description: 'Aggressive blocking' },
					{ name: 'Ultimate', value: 'ultimate', description: 'Maximum blocking (may break some sites)' },
				],
			},
		],
	},

	// ========== Webhook (for async only) ==========
	{
		displayName: 'Webhook URL',
		name: 'webhookUrl',
		type: 'string',
		default: '',
		placeholder: 'https://your-server.com/webhook',
		description: 'URL to receive a webhook notification when the screenshot is ready',
		displayOptions: {
			show: {
				resource: ['screenshot'],
				operation: ['captureAsync'],
			},
		},
	},
];
