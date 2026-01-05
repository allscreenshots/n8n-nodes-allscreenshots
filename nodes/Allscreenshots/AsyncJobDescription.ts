import type { INodeProperties } from 'n8n-workflow';

export const asyncJobOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['asyncJob'],
			},
		},
		options: [
			{
				name: 'Get Status',
				value: 'getStatus',
				description: 'Get the status of an async screenshot job',
				action: 'Get job status',
			},
			{
				name: 'Get Result',
				value: 'getResult',
				description: 'Download the result of a completed job',
				action: 'Get job result',
			},
			{
				name: 'Cancel',
				value: 'cancel',
				description: 'Cancel a pending or running job',
				action: 'Cancel a job',
			},
			{
				name: 'List All',
				value: 'list',
				description: 'List all screenshot jobs',
				action: 'List all jobs',
			},
		],
		default: 'getStatus',
	},
];

export const asyncJobFields: INodeProperties[] = [
	// ========== Job ID ==========
	{
		displayName: 'Job ID',
		name: 'jobId',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'job_abc123...',
		description: 'The ID of the async screenshot job',
		displayOptions: {
			show: {
				resource: ['asyncJob'],
				operation: ['getStatus', 'getResult', 'cancel'],
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
				resource: ['asyncJob'],
				operation: ['getResult'],
			},
		},
	},

	// ========== List Options ==========
	{
		displayName: 'Options',
		name: 'listOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['asyncJob'],
				operation: ['list'],
			},
		},
		options: [
			{
				displayName: 'Status Filter',
				name: 'status',
				type: 'options',
				default: '',
				description: 'Filter jobs by status',
				options: [
					{ name: 'All', value: '' },
					{ name: 'Pending', value: 'PENDING' },
					{ name: 'Processing', value: 'PROCESSING' },
					{ name: 'Completed', value: 'COMPLETED' },
					{ name: 'Failed', value: 'FAILED' },
					{ name: 'Cancelled', value: 'CANCELLED' },
				],
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				default: 50,
				description: 'Maximum number of jobs to return',
				typeOptions: {
					minValue: 1,
					maxValue: 100,
				},
			},
		],
	},
];
