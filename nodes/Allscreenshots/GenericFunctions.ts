import type {
	IDataObject,
	IExecuteFunctions,
	IHookFunctions,
	IHttpRequestMethods,
	IHttpRequestOptions,
	ILoadOptionsFunctions,
	IWebhookFunctions,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';

export async function allscreenshotsApiRequest(
	this: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions | IWebhookFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	qs: IDataObject = {},
): Promise<IDataObject> {
	const credentials = await this.getCredentials('allscreenshotsApi');

	const options: IHttpRequestOptions = {
		method,
		url: `${credentials.baseUrl}${endpoint}`,
		headers: {
			'Content-Type': 'application/json',
		},
		qs,
		json: true,
	};

	if (Object.keys(body).length > 0) {
		options.body = body;
	}

	try {
		return (await this.helpers.httpRequestWithAuthentication.call(
			this,
			'allscreenshotsApi',
			options,
		)) as IDataObject;
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}

export async function allscreenshotsApiRequestBinary(
	this: IExecuteFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
): Promise<Buffer> {
	const credentials = await this.getCredentials('allscreenshotsApi');

	const options: IHttpRequestOptions = {
		method,
		url: `${credentials.baseUrl}${endpoint}`,
		headers: {
			'Content-Type': 'application/json',
		},
		encoding: 'arraybuffer',
		returnFullResponse: false,
		json: false,
	};

	if (Object.keys(body).length > 0) {
		options.body = JSON.stringify(body);
	}

	try {
		const response = await this.helpers.httpRequestWithAuthentication.call(
			this,
			'allscreenshotsApi',
			options,
		);
		return Buffer.from(response as ArrayBuffer);
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}

export function buildScreenshotPayload(params: IDataObject): IDataObject {
	const payload: IDataObject = {
		url: params.url,
	};

	// Viewport options
	const viewportOptions = params.viewportOptions as IDataObject | undefined;
	if (viewportOptions && Object.keys(viewportOptions).length > 0) {
		const viewport: IDataObject = {};
		if (viewportOptions.width) viewport.width = viewportOptions.width;
		if (viewportOptions.height) viewport.height = viewportOptions.height;
		if (viewportOptions.deviceScaleFactor) viewport.deviceScaleFactor = viewportOptions.deviceScaleFactor;
		if (Object.keys(viewport).length > 0) {
			payload.viewport = viewport;
		}
	}

	// Device preset (overrides viewport)
	if (params.device) {
		payload.device = params.device;
	}

	// Output options
	const outputOptions = params.outputOptions as IDataObject | undefined;
	if (outputOptions && Object.keys(outputOptions).length > 0) {
		if (outputOptions.format) payload.format = outputOptions.format;
		if (outputOptions.quality !== undefined) payload.quality = outputOptions.quality;
		if (outputOptions.fullPage !== undefined) payload.fullPage = outputOptions.fullPage;
		if (outputOptions.selector) payload.selector = outputOptions.selector;
	}

	// Wait options
	const waitOptions = params.waitOptions as IDataObject | undefined;
	if (waitOptions && Object.keys(waitOptions).length > 0) {
		if (waitOptions.delay !== undefined) payload.delay = waitOptions.delay;
		if (waitOptions.waitFor) payload.waitFor = waitOptions.waitFor;
		if (waitOptions.waitUntil) payload.waitUntil = waitOptions.waitUntil;
		if (waitOptions.timeout !== undefined) payload.timeout = waitOptions.timeout;
	}

	// Page modifications
	const pageModifications = params.pageModifications as IDataObject | undefined;
	if (pageModifications && Object.keys(pageModifications).length > 0) {
		if (pageModifications.darkMode !== undefined) payload.darkMode = pageModifications.darkMode;
		if (pageModifications.customCss) payload.customCss = pageModifications.customCss;
		if (pageModifications.hideSelectors) {
			const selectors = (pageModifications.hideSelectors as string)
				.split(',')
				.map((s) => s.trim())
				.filter((s) => s);
			if (selectors.length > 0) {
				payload.hideSelectors = selectors;
			}
		}
	}

	// Blocking options
	const blockingOptions = params.blockingOptions as IDataObject | undefined;
	if (blockingOptions && Object.keys(blockingOptions).length > 0) {
		if (blockingOptions.blockAds !== undefined) payload.blockAds = blockingOptions.blockAds;
		if (blockingOptions.blockCookieBanners !== undefined)
			payload.blockCookieBanners = blockingOptions.blockCookieBanners;
		if (blockingOptions.blockLevel && blockingOptions.blockLevel !== 'none') {
			payload.blockLevel = blockingOptions.blockLevel;
		}
	}

	return payload;
}

export function buildBulkPayload(params: IDataObject): IDataObject {
	const urlsString = params.urls as string;
	const urls = urlsString
		.split('\n')
		.map((url) => url.trim())
		.filter((url) => url)
		.map((url) => ({ url }));

	const payload: IDataObject = {
		urls,
	};

	// Screenshot options as defaults
	const screenshotOptions = params.screenshotOptions as IDataObject | undefined;
	if (screenshotOptions && Object.keys(screenshotOptions).length > 0) {
		const defaults: IDataObject = {};
		if (screenshotOptions.format) defaults.format = screenshotOptions.format;
		if (screenshotOptions.fullPage !== undefined) defaults.fullPage = screenshotOptions.fullPage;
		if (screenshotOptions.width || screenshotOptions.height) {
			defaults.viewport = {
				width: screenshotOptions.width || 1920,
				height: screenshotOptions.height || 1080,
			};
		}
		if (Object.keys(defaults).length > 0) {
			payload.defaults = defaults;
		}
	}

	// Webhook options
	if (params.webhookUrl) {
		payload.webhookUrl = params.webhookUrl;
	}
	if (params.webhookSecret) {
		payload.webhookSecret = params.webhookSecret;
	}

	return payload;
}

export function buildComposePayload(params: IDataObject): IDataObject {
	const urlsString = params.urls as string;
	const captures = urlsString
		.split('\n')
		.map((url) => url.trim())
		.filter((url) => url)
		.map((url, index) => ({
			url,
			id: `capture_${index + 1}`,
		}));

	const payload: IDataObject = {
		captures,
	};

	// Layout options
	if (params.layout) {
		payload.output = {
			layout: (params.layout as string).toUpperCase(),
		};
	}

	// Compose options
	const composeOptions = params.composeOptions as IDataObject | undefined;
	if (composeOptions && Object.keys(composeOptions).length > 0) {
		const output = (payload.output as IDataObject) || {};
		if (composeOptions.spacing !== undefined) output.spacing = composeOptions.spacing;
		if (composeOptions.padding !== undefined) output.padding = composeOptions.padding;
		if (composeOptions.background) output.background = composeOptions.background;
		if (composeOptions.format) output.format = composeOptions.format;
		if (composeOptions.quality !== undefined) output.quality = composeOptions.quality;
		payload.output = output;
	}

	// Async mode
	if (params.async !== undefined) {
		payload.async = params.async;
	}

	return payload;
}

export function buildSchedulePayload(params: IDataObject): IDataObject {
	const payload: IDataObject = {
		name: params.name,
		url: params.url,
		schedule: params.cron,
	};

	if (params.timezone) {
		payload.timezone = params.timezone;
	}

	// Screenshot options
	const scheduleOptions = params.scheduleOptions as IDataObject | undefined;
	if (scheduleOptions && Object.keys(scheduleOptions).length > 0) {
		const options: IDataObject = {};
		if (scheduleOptions.format) options.format = scheduleOptions.format;
		if (scheduleOptions.fullPage !== undefined) options.fullPage = scheduleOptions.fullPage;
		if (scheduleOptions.width || scheduleOptions.height) {
			options.viewport = {
				width: scheduleOptions.width || 1920,
				height: scheduleOptions.height || 1080,
			};
		}
		if (Object.keys(options).length > 0) {
			payload.options = options;
		}
	}

	// Webhook
	if (params.webhookUrl) {
		payload.webhookUrl = params.webhookUrl;
	}

	// Retention
	if (params.retentionDays !== undefined) {
		payload.retentionDays = params.retentionDays;
	}

	return payload;
}
