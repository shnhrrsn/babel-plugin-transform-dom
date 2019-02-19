function handleClick() { console.log('click!') }

dom.div({
	onClick: handleClick
})

dom.div({
	onClickCapture: handleClick
})
