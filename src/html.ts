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

// https://dom.spec.whatwg.org/#dom-document-createelement
// https://www.w3.org/TR/xml/#NT-Name
export const htmlTagNameRegex = (() => {
	const nameStartChars = [
		':',
		'A-Z',
		'_',
		'a-z',
		'\u00C0-\u00D6',
		'\u00D8-\u00F6',
		'\u00F8-\u02FF',
		'\u0370-\u037D',
		'\u037F-\u1FFF',
		'\u200C-\u200D',
		'\u2070-\u218F',
		'\u2C00-\u2FEF',
		'\u3001-\uD7FF',
		'\uF900-\uFDCF',
		'\uFDF0-\uFFFD',
		'\u{10000}-\u{EFFFF}',
	].join('');

	const nameChars = [
		nameStartChars,
		'\\-',
		'.',
		'0-9',
		'\u00B7',
		'\u0300-\u036F',
		'\u203F-\u2040',
	].join('');

	// eslint-disable-next-line no-misleading-character-class
	return new RegExp(`^[${nameStartChars}][${nameChars}]*$`, 'u');
})();

// https://html.spec.whatwg.org/#attributes-2
export const htmlAttributeNameRegex = /^[^ "'>/=\p{Control}\p{NChar}]+$/u;
