function handleClick() {
	console.log('click!');
}

var _div = document.createElement('div');

_div.addEventListener('click', handleClick);

_div;

var _div2 = document.createElement('div');

_div2.addEventListener('click', handleClick, true);

_div2;
