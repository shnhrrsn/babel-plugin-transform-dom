const user = {
  firstName: 'Shaun',
  lastName: 'Harrison'
};

function Avatar({
  src
}) {
  var _img = document.createElement("img");

  _img.setAttribute("src", src);

  _img.setAttribute("class", "profile");

  return _img;
}

var _h;

var _p;

var _div = document.createElement("div");

_div.appendChild(Avatar({
  src: "avatar.png"
}));

_div.appendChild((_h = document.createElement("h3"), _h.appendChild(document.createTextNode([user.firstName, user.lastName].join(' '))), _h));

_div.appendChild((_p = document.createElement("p"), _p.appendChild(document.createTextNode("Profile")), _p));

var profile = _div;
profile;
