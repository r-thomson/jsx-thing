import test from 'tape';
import h from './index.js';

test('handles element with no content', async (t) => {
	t.looseEqual(<div />, '<div></div>');
});

test('handles element with text content', async (t) => {
	t.looseEqual(<p>Hello, world</p>, '<p>Hello, world</p>');
	t.looseEqual(<p>{'Hello, world'}</p>, '<p>Hello, world</p>');
	t.looseEqual(
		<p>
			{'Hello,'} {'world'}
		</p>,
		'<p>Hello, world</p>'
	);
});

test('handles element with list of text content', async (t) => {
	t.looseEqual(<div>{['Hello', 'World']}</div>, '<div>HelloWorld</div>');
	t.looseEqual(<div>{['Hello', ['World']]}</div>, '<div>HelloWorld</div>');
	t.looseEqual(<div>{[[[['Hello']]], [[['World']]]]}</div>, '<div>HelloWorld</div>');
});

test('handles element with child elements', async (t) => {
	t.looseEqual(
		<div>
			<p>Hello</p>
			<p>World</p>
		</div>,
		'<div><p>Hello</p><p>World</p></div>'
	);
});

test('handles element with list of child elements', async (t) => {
	const words = ['Hello', 'World'];
	t.looseEqual(
		<div>
			{words.map((word) => (
				<p>{word}</p>
			))}
		</div>,
		'<div><p>Hello</p><p>World</p></div>'
	);
});

test('handles tag with attribute', async (t) => {
	t.looseEqual(<p title="Hello, world" />, '<p title="Hello, world"></p>');
	t.looseEqual(<p title={'Hello, world'} />, '<p title="Hello, world"></p>');

	const attrs = { title: 'Hello, world' };
	t.looseEqual(<p {...attrs} />, '<p title="Hello, world"></p>');
});

test('handles boolean attributes', async (t) => {
	t.looseEqual(<div hidden />, '<div hidden></div>');
	t.looseEqual(<div hidden={true} />, '<div hidden></div>');
	t.looseEqual(<div hidden={false} />, '<div></div>');
	t.looseEqual(<div aria-hidden="true" />, '<div aria-hidden="true"></div>');
	t.looseEqual(<div aria-hidden="false" />, '<div aria-hidden="false"></div>');
});

test('handles numeric attributes', async (t) => {
	t.looseEqual(<div data-count={0} />, '<div data-count="0"></div>');
	t.looseEqual(<div data-count={1} />, '<div data-count="1"></div>');
	t.looseEqual(<div data-count={-1} />, '<div data-count="-1"></div>');
	t.looseEqual(<div data-count={1.5} />, '<div data-count="1.5"></div>');
});

test('remaps reserved attribute names', async (t) => {
	t.looseEqual(<div className="class" />, '<div class="class"></div>');
	t.looseEqual(<label htmlFor="input" />, '<label for="input"></label>');
});

test('does not emit closing tag for void elements', async (t) => {
	t.looseEqual(<area />, '<area>');
	t.looseEqual(<base />, '<base>');
	t.looseEqual(<br />, '<br>');
	t.looseEqual(<col />, '<col>');
	t.looseEqual(<embed />, '<embed>');
	t.looseEqual(<hr />, '<hr>');
	t.looseEqual(<img src="image.png" />, '<img src="image.png">');
	t.looseEqual(<input />, '<input>');
	t.looseEqual(<link />, '<link>');
	t.looseEqual(<meta />, '<meta>');
	t.looseEqual(<source />, '<source>');
	t.looseEqual(<track />, '<track>');
	t.looseEqual(<wbr />, '<wbr>');
});

test('does not render boolean content', async (t) => {
	t.looseEqual(<div>{true}</div>, '<div></div>');
	t.looseEqual(<div>{false}</div>, '<div></div>');
});

test('does not render nullish content', async (t) => {
	t.looseEqual(<div>{null}</div>, '<div></div>');
	t.looseEqual(<div>{undefined}</div>, '<div></div>');
});

test('escapes text content', async (t) => {
	t.looseEqual(<p>{'a<b&c'}</p>, '<p>a&#60;b&#38;c</p>');
});

test('escapes attribute content', async (t) => {
	t.looseEqual(<div title="a<b&c" />, '<div title="a&#60;b&#38;c"></div>');
});

test('escapes nested text content', async (t) => {
	t.looseEqual(
		<div>
			<p>{'a<b&c'}</p>
		</div>,
		'<div><p>a&#60;b&#38;c</p></div>'
	);
});
