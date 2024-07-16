const m = require("mithril")

const pb = require("../api")

const dayjs = require("../dayjs-lib")


const CLEAR = 0, WAITING = 1, LOADED = 2, ERROR = 3;


module.exports = function() {
	// COMPONENT STATE
	let status = CLEAR;
	let json_import_response = {};

	// COMPONENT BEHAVIORS
	const submitFormListener = function(event) {
		event.preventDefault(); // don't refresh the page

		status = WAITING; // no need to call m.redraw() because state is updated after events

		const formData = new FormData(); // blank FormData to simulate content-type
		const jsonFileImport = document.querySelector("#json-file-import").files[0];
		formData.append("jsonFileImport", jsonFileImport); // add file to form
		let startTime = dayjs();
		pb.send("/json-upload", {
			method: "POST",
			body: formData,
		})
		.then(response => {
			status = LOADED;
			json_import_response = response;
			json_import_response.results.wallets.errors = ['Error adding wallet "Test" with date 2024-04-04','Error adding wallet "Test" with date 2024-04-04' ];
			json_import_response.results.wallets.success--;
			json_import_response.duration = dayjs().diff(startTime, "second");
		})
		.catch(error => {
			console.log("error: ", error);
			status = ERROR;
			return error;
		})
		.finally(m.redraw);
	};




	return {
		oninit: function(vnode) {
			status = CLEAR;
		},
		view: function(vnode) {
			return (
			<div class="container">
				<div class="section">
					<p>To import your data from the mobile app into this web app
						<ol>
							<li>In the mobile app, go to <i>Left menu, Settings, Database, Backup Services</i> then choose a folder on your device, and press the + button in the lower right corner. Don't enter a password, just press "ok"</li>
							<li>Find the file, change the extension from ".mwbx" to ".zip", and extract the backup.</li>
							<li>Click "choose file" below, and select the "database.json" file inside the extracted folder. If you are using this web app on a different device than your smartphone, then you must transfer that file from your smartphone to this device.</li>
							<li>After clicking submit, wait for the upload to complete.</li>
						</ol>
					</p>
					<form onsubmit={submitFormListener}>
						<input type="file" name="json-file-import" id="json-file-import" />
						<input type="submit" value="Submit" disabled={status == WAITING? "disabled" : null} />
					</form>
					{status == WAITING && (<div>
						<em>Importing your data, this may take a minute</em>
						<div class="progress">
		      				<div class="indeterminate"></div>
		      			</div>
					</div>)}
				</div>
				{status == LOADED && (<div class="z-depth-2" style="padding: 1em;">
					<h2>Results:</h2>
					<p>Time: {json_import_response.duration} seconds</p>
					<ul class="collection">
						<li class="collection-item">
							{json_import_response.results.wallets.success == json_import_response.results.wallets.total?
							(<i class="material-icons green-text">check_circle</i>) :
							(<i class="material-icons amber-text">warning</i>)
							}

							Imported {json_import_response.results.wallets.success} of {json_import_response.results.wallets.total} wallets

							{json_import_response.results.wallets.errors.length > 0 &&
							<ul class="collection">
								{json_import_response.results.wallets.errors.map(error => (<li class="collection-item">{error}</li>))}
							</ul>
							}
						</li>
						<li class="collection-item">
							<i class="material-icons green-text">check_circle</i> Imported {json_import_response.results.categories.success} of {json_import_response.results.categories.total} categories
						</li>
						<li class="collection-item">
							<i class="material-icons green-text">check_circle</i> Imported {json_import_response.results.transactions.success} of {json_import_response.results.transactions.total} transactions
						</li>
						<li class="collection-item">
							<i class="material-icons green-text">check_circle</i> Imported {json_import_response.results.transfers.success} of {json_import_response.results.transfers.total} transfers
						</li>
					</ul>
	      		</div>)}
	      	</div>
			);
		}
	};
};