function Avatar({ src }) {
	return <img src={src} className="profile" />
}

var profile = <div>
	<Avatar src="avatar.png" />
	<h3>{[user.firstName, user.lastName].join(' ')}</h3>
	<p>Profile</p>
</div>;
