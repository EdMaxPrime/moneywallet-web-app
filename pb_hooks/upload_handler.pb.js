

routerAdd("POST", "/csv-upload", (c) => {
	console.log("Upload endpoint begin");
	let contents = "";
	const [multipartFile, multipartHeader] = c.request().formFile("csvFileImport"); //props: filename, header, size //https://pkg.go.dev/mime/multipart#FileHeader
	try {
		console.log("got form file");
		contents = readerToString(multipartFile);
		console.log("reader to string: ", contents);
	} catch (exception) {
		console.log("error getting file", exception);
	} finally {
		multipartFile.close();
	}
	return c.json(200, { "success": true, "contents": contents });
}, $apis.requireRecordAuth("users"));



routerAdd("POST", "/json-upload", (c) => {
	const requestInfo = $apis.requestInfo(c);
	const [multipartFile, multipartHeader] = c.request().formFile("jsonFileImport"); //props: filename, header, size //https://pkg.go.dev/mime/multipart#FileHeader
	let results = {
		"wallets": {
			"total": 0,
			"success": 0,
			"errors": []
		},
		"categories": {
			"total": 0,
			"success": 0,
			"errors": []
		},
		"transactions": {
			"total": 0,
			"success": 0,
			"errors": []
		},
		"transfers": {
			"total": 0,
			"success": 0,
			"errors": []
		},
	};
	try {
		const contents = readerToString(multipartFile);
		const jsonContents = JSON.parse(contents);
		const jsonUUIDToPocketbaseId = {}; //map IDs from JSON file to new IDs made by Pocketbase
		// create wallets
		if(jsonContents.wallets && jsonContents.wallets.length > 0) {
			results.wallets.total = jsonContents.wallets.length;
			const walletCollection = $app.dao().findCollectionByNameOrId("wallets");
			const existingWallets = $app.dao().findRecordsByExpr("wallets", 
				$dbx.hashExp({"user_owner": requestInfo.authRecord.id}));
			for(let i = 0; i < jsonContents.wallets.length; i++) {
				// find an existing wallet with this name, otherwise create new one
				let record = existingWallets.filter(
					wallet => wallet.getString("name") == jsonContents.wallets[i].name);
				if(record.length == 0) {
					record = new Record(walletCollection);
				} else {
					record = record[0];
				}
				const form = new RecordUpsertForm($app, record);
				try {
					const currencyRecord = $app.dao().findFirstRecordByData("currencies", "iso", jsonContents.wallets[i].currency);
					form.loadData({
						"archived" : jsonContents.wallets[i].archived,
						"count_in_total" : jsonContents.wallets[i].count_in_total,
						"currency" : currencyRecord.getString("id"),
						"icon" : jsonContents.wallets[i].icon,
						"index" : jsonContents.wallets[i].index,
						"name" : jsonContents.wallets[i].name,
						"start_money" : jsonContents.wallets[i].start_money,
						"user_owner" : requestInfo.authRecord.getString("id"),
					});
					form.submit();
					jsonUUIDToPocketbaseId[jsonContents.wallets[i].id] = record.getId(); // associate old ID with new one
					results.wallets.success++; // if you reach this line, then everything succeeded
				} catch (findException) {
					console.error(findException);
					results.wallets.errors.push("Could not create wallet \"" + jsonContents.wallets[i].name + "\"");
				}
			}
		}
		// create categories
		if(jsonContents.categories && jsonContents.categories.length > 0) {
			results.categories.total = jsonContents.categories.length;
			const categoryCollection = $app.dao().findCollectionByNameOrId("categories");
			const existingCategories = $app.dao().findRecordsByExpr("categories", 
				$dbx.hashExp({"user_owner": requestInfo.authRecord.id}));
			for(let i = 0; i < jsonContents.categories.length; i++) {
				// find an existing category with this name, otherwise create new one
				let record = existingCategories.filter(
					category => category.getString("name") == jsonContents.categories[i].name);
				if(record.length == 0) {
					record = new Record(categoryCollection);
				} else {
					record = record[0];
				}
				const form = new RecordUpsertForm($app, record);
				// try
				try {
					form.loadData({
						"icon" : jsonContents.categories[i].icon,
						"index" : jsonContents.categories[i].index,
						"name" : jsonContents.categories[i].name,
						"show_in_report" : jsonContents.categories[i].show_report,
						"type" : jsonContents.categories[i].type,
						"user_owner" : requestInfo.authRecord.getString("id"),
					});
					form.submit();
					jsonUUIDToPocketbaseId[jsonContents.categories[i].id] = record.getId(); // associate old ID with new one
					results.categories.success++; // if you reach this line, then everything succeeded
				} catch (findException) {
					console.error(findException);
					results.categories.errors.push("Could not create category \"" + jsonContents.categories[i].name + "\"");
				}
			}
			// now that we have IDs, build a hierarchy of categories
			for(let category of jsonContents.categories) {
				if(category.parent == null) continue; //skip categories that aren't children
				try {
					$app.dao().db()
					.newQuery("UPDATE categories AS childCat SET parent = `parentCat`.id FROM (SELECT * FROM categories WHERE user_owner = {:user_owner} AND name = {:parent_name}) AS parentCat WHERE childCat.user_owner = {:user_owner} AND childCat.name = {:child_name}")
					.bind({
						"user_owner": requestInfo.authRecord.id,
						"child_name": category.name,
						"parent_name": jsonContents.categories.filter(c => c.id == category.parent)[0].name,
					})
					.execute();
				} catch (updateException) {
					console.error("Could not set parent for " + category.name, updateException);
					results.categories.push(category.name + " could not be attached as a subcategory; it will appear as a top level category");
				}
			}
		}

		// create transactions
		if(jsonContents.transactions && jsonContents.transactions.length > 0) {
			results.transactions.total = jsonContents.transactions.length;
			const transactionCollection = $app.dao().findCollectionByNameOrId("transactions");
			const existingTransactions = $app.dao().findRecordsByFilter(
				"transactions",                      // collection
				"wallet.user_owner = {:user_owner}", // filter
				"",                                  // sort
				10000,                               // limit
				0,                                   // offset
				{"user_owner": requestInfo.authRecord.id} // filter params
				);
			for(let i = 0; i < jsonContents.transactions.length; i++) {
				// find an existing transaction with this uuid, otherwise create new one
				let record = existingTransactions.filter(
					transaction => transaction.getString("uuid") == jsonContents.transactions[i].id);
				if(record.length == 0) {
					record = new Record(transactionCollection);
				} else {
					record = record[0];
				}
				const form = new RecordUpsertForm($app, record);
				try {
					form.loadData({
						"category" : jsonUUIDToPocketbaseId[jsonContents.transactions[i].category],
						"confirmed" : jsonContents.transactions[i].confirmed,
						"count_in_total" : jsonContents.transactions[i].count_in_total,
						"date" : jsonContents.transactions[i].date,
						"description" : jsonContents.transactions[i].description,
						"direction" : jsonContents.transactions[i].direction,
						"icon" : jsonContents.transactions[i].icon,
						"money" : jsonContents.transactions[i].money,
						"note" : jsonContents.transactions[i].note,
						"type" : jsonContents.transactions[i].type,
						"wallet" : jsonUUIDToPocketbaseId[jsonContents.transactions[i].wallet],
						"uuid" : jsonContents.transactions[i].id,
					});
					form.submit();
					jsonUUIDToPocketbaseId[jsonContents.transactions[i].id] = record.getId(); // associate old ID with new one
					results.transactions.success++; // if you reach this line, then everything succeeded
				} catch (findException) {
					console.error(findException);
					results.transactions.errors.push("Could not create transaction \"" + jsonContents.transactions[i].description + "\" with date " + jsonContents.transactions[i].date);
				}
			}
		}

		// create transfers
		if(jsonContents.transfers && jsonContents.transfers.length > 0) {
			results.transfers.total = jsonContents.transfers.length;
			const transferCollection = $app.dao().findCollectionByNameOrId("transfers");
			const existingTransfers = $app.dao().findRecordsByFilter(
				"transfers",                         // collection
				"transaction_from.wallet.user_owner = {:user_owner}", // filter
				"",                                  // sort
				10000,                               // limit
				0,                                   // offset
				{"user_owner": requestInfo.authRecord.id} // filter params
				);
			for(let i = 0; i < jsonContents.transfers.length; i++) {
				// find an existing tranfer with this uuid, otherwise create new one
				let record = existingTransfers.filter(
					transfer => transfer.getString("uuid") == jsonContents.transfers[i].id);
				if(record.length == 0) {
					record = new Record(transferCollection);
				} else {
					record = record[0];
				}
				const form = new RecordUpsertForm($app, record);
				try {
					form.loadData({
						"confirmed" : jsonContents.transfers[i].confirmed,
						"count_in_total" : jsonContents.transfers[i].count_in_total,
						"date" : jsonContents.transfers[i].date,
						"description" : jsonContents.transfers[i].description,
						"note" : jsonContents.transfers[i].note,
						"transaction_from" : jsonUUIDToPocketbaseId[jsonContents.transfers[i]["from"]],
						"transaction_tax" : (jsonContents.transfers[i]["tax"] in jsonUUIDToPocketbaseId)? jsonUUIDToPocketbaseId[jsonContents.transfers[i]["tax"]] : null,
						"transaction_to" : jsonUUIDToPocketbaseId[jsonContents.transfers[i]["to"]],
						"uuid" : jsonContents.transfers[i].id,
					});
					form.submit();
					jsonUUIDToPocketbaseId[jsonContents.transfers[i].id] = record.getId(); // associate old ID with new one
					results.transfers.success++; // if you reach this line, then everything succeeded
				} catch (findException) {
					console.error(findException);
					results.transfers.errors.push("Could not create transfer \"" + jsonContents.transfers[i].description + "\" with date " + jsonContents.transfers[i].date);
				}
			}
		}
	} catch (exception) {
		console.log("error getting file", exception);
	} finally {
		multipartFile.close();
	}
	return c.json(200, { "success": true, "results": results });
}, $apis.requireRecordAuth("users"));
