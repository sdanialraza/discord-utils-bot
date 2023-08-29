import { InteractionResponseType, MessageFlags } from 'discord-api-types/v10';
import type { Response } from 'polka';
import { PREFIX_FAIL } from './constants.js';

export function prepareHeader(response: Response) {
	response.setHeader('Content-Type', 'application/json');
}

export function prepareResponse(
	response: Response,
	content: string,
	ephemeral = false,
	users: string[] = [],
	parse: string[] = [],
	type = InteractionResponseType.ChannelMessageWithSource,
): void {
	prepareHeader(response);
	response.write(
		JSON.stringify({
			data: {
				content,
				flags: ephemeral ? MessageFlags.Ephemeral | MessageFlags.SuppressEmbeds : MessageFlags.SuppressEmbeds,
				allowed_mentions: { parse, users },
				components: [],
			},
			type,
		}),
	);
}

export function prepareDeferResponse(response: Response, ephemeral = false) {
	prepareHeader(response);
	response.write(
		JSON.stringify({
			type: InteractionResponseType.DeferredChannelMessageWithSource,
			data: {
				flags: ephemeral ? MessageFlags.Ephemeral | MessageFlags.SuppressEmbeds : MessageFlags.SuppressEmbeds,
			},
		}),
	);
}

export function prepareErrorResponse(response: Response, content: string): void {
	prepareResponse(response, `${PREFIX_FAIL} ${content}`, true);
}

export function prepareAck(response: Response) {
	prepareHeader(response);
	response.statusCode = 200;
	response.write(
		JSON.stringify({
			type: InteractionResponseType.Pong,
		}),
	);
}
