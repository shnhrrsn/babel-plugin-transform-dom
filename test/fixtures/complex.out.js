var _body = document.createElement("body");

_body.classList.add("page");

var _h;

_body.appendChild((_h = document.createElement("h1"), _h.appendChild(document.createTextNode('Title')), _h.setAttribute("id", "header"), _h));

var _div;

var _p;

var _p2;

_body.appendChild((_div = document.createElement("div"), _div.classList.add("content"), _div.appendChild((_p = document.createElement("p"), _p.appendChild(document.createTextNode('Paragraph 1')), _p)), _div.appendChild((_p2 = document.createElement("p"), _p2.appendChild(document.createTextNode('Paragraph 2')), _p2.classList.add("small"), _p2)), _div));

var _aside;

var _span;

var _p3;

_body.appendChild((_aside = document.createElement("aside"), _aside.setAttribute("id", "sidebar"), _aside.setAttribute('data-affixed', '.content'), _aside.appendChild((_span = document.createElement("span"), _span.classList.add("sidebar-content", "sticky"), _span.appendChild((_p3 = document.createElement("p"), _p3.appendChild(document.createTextNode('Sidebar')), _p3)), _span)), _aside));

_body;
