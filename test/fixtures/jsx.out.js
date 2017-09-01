var _img, _h, _div;

var profile = (_div = document.createElement("div"), _div.appendChild((_img = document.createElement("img"), _img.setAttribute("src", "avatar.png"), _img.setAttribute("class", "profile"), _img)), _div.appendChild((_h = document.createElement("h3"), _h.appendChild(document.createTextNode([user.firstName, user.lastName].join(' '))), _h)), _div);
