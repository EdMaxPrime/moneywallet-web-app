const m = require("mithril")

module.exports = {
	view: function(vnode) {
		const t = vnode.attrs.t;

		return (<li class="collection-item avatar">
			<i class="material-icons circle">folder</i>
			<div class="row">
				<div class="col s8">
					<span class="title">Category</span>
					<p>{t.desc}</p>
				</div>
				<div class="col s4">
					<span class="red-text text-darken-1">$5.00</span>
					<p>Tue Dec 2, 2023</p>
				</div>
			</div>
		</li>);
	}
}