export function htmlEsc(string: string) {
	return string.replace(/['"<>&]/g, (ch) => `&#${ch.charCodeAt(0)};`);
}

// https://html.spec.whatwg.org/#void-elements
export const VOID_ELEMENTS = new Set([
	'area',
	'base',
	'br',
	'col',
	'embed',
	'hr',
	'img',
	'input',
	'link',
	'meta',
	'source',
	'track',
	'wbr',
]);

// https://html.spec.whatwg.org/#attributes-2
export const htmlAttributeNameRegex = /^[^ "'>/=\p{Control}\p{NChar}]+$/u;
