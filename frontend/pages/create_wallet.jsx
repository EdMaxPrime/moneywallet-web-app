const m = require("mithril")
const Layout = require("../layouts/Layout")
const Icon = require("../components/Icon.jsx")

const Wallet = require("../models/Wallet")
const Currency = require("../models/Currency")


module.exports = (function() {
	let select = null;
	let errorMessage = "";
	return {
		oninit: function() {
			Currency.loadList().then(m.redraw);
		},
		oncreate: function(vnode) {
			select = M.FormSelect.init(document.getElementById("create_wallet_currency"));
		},
		onupdate: function(vnode) {
			if(select != null) select.destroy();
			select = M.FormSelect.init(document.getElementById("create_wallet_currency"));
		},
		onremove: function(vnode) {
			if(select != null) select.destroy();
		},
		view: function() {
			return (
			<Layout title="Create Wallet">
				<div class="container">
					<p class="section">Wallets can represent a credit card, a bank account, a gift card, or cash in your physical wallet. To create a new wallet, just give it a name. Click the <em>add wallet</em> button to save it.</p>
					<form class="row" onsubmit={function(e) {
						e.preventDefault(); 
						// selected currency must be retrieved now because it is not set during event handler
						if(select != null) {
							Wallet.current.currency = select.getSelectedValues()[0];
						}
						Wallet.create().then(function(response) {
							Wallet.list.push(response);
							errorMessage = "";
							Wallet.resetCurrent();
							m.route.set("/transactions");
						}).catch(function(response) {
							errorMessage = "Please try again: " + response.message;
							m.redraw();
						})
					}}>
						{errorMessage.length > 0 && (
							<div class="card-panel red accent-1"><span class="material-icons outlined">error</span>&nbsp;{errorMessage}</div>
						)}
	
						<div class="col s3 m1">
							<Icon icon={{type: "color", name: "AA", color: "#82CAFF"}} marginX={true} />
						</div>
						<div class="col s9 m11">
							<p>Click the icon to customize it</p>
						</div>
						<div class="col s12">
							<div class="input-field">
								<input type="text" 
									id="create_wallet_name"
									oninput={function(e) {Wallet.current.name = e.target.value}}
									value={Wallet.current.name} />
								<label for="create_wallet_name">Name</label>
							</div>
						</div>
						<div class="input-field col s12">
							<i class="material-icons prefix">search</i>
							<select 
								id="create_wallet_currency"
								onchange={function(e) {if(select != null) Wallet.current.currency = select.getSelectedValues()[0];}}>
								{Currency.list.map(function(currency) {
									return (<option 
										value={currency.id}>
										{currency.name + " " + currency.iso + "(" + currency.symbol + ")"}
										</option>);
								})}
							</select>
							<label for="create_wallet_currency">Currency</label>
						</div>
						<div class="input-field col s12">
							<span class="prefix">$</span>
							<input type="number" 
								id="create_wallet_start_money"
								step="any"
								onchange={function(e) {Wallet.current.start_money = e.target.value}}
								value={Wallet.current.start_money} />
							<label for="create_wallet_start_money" class="active">Initial balance</label>
						</div>
						<div class="input-field col s12">
							<i class="material-icons prefix">note</i>
							<textarea  
								id="create_wallet_note"
								class="materialize-textarea"
								oninput={function(e) {Wallet.current.note = e.target.value}}
								value={Wallet.current.note} />
							<label for="create_wallet_note">Note</label>
						</div>
						<div class="col s12">
							<label>
								<input type="checkbox" 
									class="filled-in" 
									id="create_wallet_count_in_total"
									oninput={function(e) {Wallet.current.count_in_total = e.target.checked}}
									checked={!!(Wallet.current.count_in_total)} />
								<span>Show this wallet in the total count</span>
							</label>
						</div>
						<button class="btn" type="submit">Add wallet&nbsp;<i class="material-icons right">add</i></button>
					</form>
				</div>
			</Layout>);
	}
	};
})();