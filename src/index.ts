import { VOID_ELEMENTS, htmlAttributeNameRegex, htmlEsc, htmlTagNameRegex } from './html.js';

const REMAPPED_ATTRS: { [attr: string]: string | undefined } = {
	htmlFor: 'for',
	className: 'class',
};

class Element extends String {}

export interface Props {
	[attr: string]: unknown;
}

export function h(type: string, props?: Props | null, ...children: unknown[]): Element {
	if (typeof type !== 'string') {
		throw new TypeError('Element must be a string');
	}

	if (!htmlTagNameRegex.test(type)) {
		throw new TypeError('Invalid HTML tag name');
	}

	let html = '<' + type;

	if (props) {
		Object.entries(props).forEach(([attr, value]) => {
			if (!htmlAttributeNameRegex.test(attr)) {
				throw new TypeError('Invalid HTML attribute name');
			}

			attr = REMAPPED_ATTRS[attr] || attr;

			// Render "attr={true}" as "attr", render nothing for "attr={false}"
			if (value === true) {
				html += ' ' + htmlEsc(attr);
			} else if (value !== false) {
				html += ` ${htmlEsc(attr)}="${htmlEsc(String(value))}"`;
			}
		});
	}

	html += '>';

	if (!VOID_ELEMENTS.has(type)) {
		children.flat().forEach((child) => {
			if (child instanceof Element) {
				html += child; // Already escaped
			} else if (child !== null && child !== undefined && typeof child !== 'boolean') {
				html += htmlEsc(String(child));
			}
		});

		html += `</${type}>`;
	}

	return new Element(html);
}

export { h as default };
