import type { INodeProperties } from 'n8n-workflow';

export const usageOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['usage'],
			},
		},
		options: [
			{
				name: 'Get Full Stats',
				value: 'getStats',
				description: 'Get complete usage statistics including history',
				action: 'Get usage statistics',
			},
			{
				name: 'Get Quota',
				value: 'getQuota',
				description: 'Get current quota status (screenshots and bandwidth)',
				action: 'Get quota status',
			},
		],
		default: 'getQuota',
	},
];

export const usageFields: INodeProperties[] = [
	// No additional fields needed for usage operations
	// The API endpoints don't require any parameters
];
