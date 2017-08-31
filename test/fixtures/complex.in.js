dom.body(
	'.page',
	dom.h1('Title', '#header'),
	dom.div(
		'.content',
		dom.p('Paragraph 1'),
		dom.p('Paragraph 2', '.small')
	),
	dom.aside('#sidebar', {
		attributes: {
			'data-affixed': '.content'
		}
	}, dom.span('.sidebar-content .sticky', dom.p('Sidebar')))
)
