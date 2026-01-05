import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class AllscreenshotsApi implements ICredentialType {
	name = 'allscreenshotsApi';

	displayName = 'Allscreenshots API';

	documentationUrl = 'https://docs.allscreenshots.com/api';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description:
				'Your Allscreenshots API key. Find it in your <a href="https://allscreenshots.com/dashboard/api-keys" target="_blank">dashboard</a>.',
		},
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://api.allscreenshots.com',
			description: 'The base URL for the Allscreenshots API. Only change for custom deployments.',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'X-API-Key': '={{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.baseUrl}}',
			url: '/v1/usage/quota',
			method: 'GET',
		},
	};
}
