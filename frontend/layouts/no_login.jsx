const m = require("mithril")


/**
 * This layout is shared among pages that don't require the user to be signed
 * in.
 */
module.exports = {
	view: function(vnode) {
		return [(<header class="center-align">
				<h1 class="center-align">Money Wallet</h1>
				<p class="center-align">Personal finance software</p>
				<img src="img/favicon-144x144.png" width="144" height="144" alt="logo" />
			</header>),
			(<main class="container">{vnode.children}</main>),
			(<footer class="container">
				<hr/>
				<div class="row">
					<a class="col s4" href="help.html">Help</a>
					<a class="col s4" href="https://github.com/EdMaxPrime/moneywallet-web-app" target="_blank">Source code</a>
					<a class="col s4" href="https://github.com/EdMaxPrime/moneywallet-web-app/blob/master/LICENSE.txt" target="_blank">GNU GPL 3 licensed</a>
				</div>
			</footer>),
		];
	}
}