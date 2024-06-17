/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ng2vixyj0v7dkfy")

  collection.options = {
    "query": "WITH groupedByMonth AS (\n\tSELECT \n\t\tdate(transactions.`date`, 'start of month') AS `date`,\n\t\twallets.user_owner AS `users`,\n\t\twallets.id AS `wallets`,\n\t\twallets.start_money AS `start_money`,\n\t\tSUM(CASE WHEN transactions.direction = 0 THEN -transactions.money ELSE transactions.money END) AS `cashflow`\n\tFROM transactions\n\tJOIN wallets ON wallets.id = transactions.wallet\n\tGROUP BY date(transactions.`date`, 'start of month'), wallets.id\n )\n SELECT\n    (ROW_NUMBER() OVER ()) as id,\n\tgroupedByMonth.date,\n\tgroupedByMonth.users,\n\tgroupedByMonth.wallets,\n\tgroupedByMonth.cashflow,\n\t((SUM(groupedByMonth.cashflow) OVER (PARTITION BY `wallets` ORDER BY `date` ASC)) + groupedByMonth.start_money) AS `balance`\nFROM groupedByMonth\nORDER BY `date` ASC;"
  }

  // remove
  collection.schema.removeField("csffh18r")

  // remove
  collection.schema.removeField("pudj6615")

  // remove
  collection.schema.removeField("wcr2mf2f")

  // remove
  collection.schema.removeField("mefoa3pk")

  // remove
  collection.schema.removeField("tnyntrmz")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "lssmgxmm",
    "name": "date",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSize": 1
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "obphqyuy",
    "name": "users",
    "options": {
      "cascadeDelete": false,
      "collectionId": "_pb_users_auth_",
      "displayFields": [],
      "maxSelect": 1,
      "minSelect": null
    },
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "udpxpsl4",
    "name": "wallets",
    "options": {
      "cascadeDelete": false,
      "collectionId": "ahksbjygrpxeayw",
      "displayFields": null,
      "maxSelect": 1,
      "minSelect": null
    },
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSize": 1
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "twonftj0",
    "name": "cashflow",
    "type": "number",
    "required": false,
    "presentable": true,
    "unique": false,
    "options": {
      "maxSize": 1
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "b6ujodid",
    "name": "balance",
    "type": "number",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSize": 1
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ng2vixyj0v7dkfy")

  collection.options = {
    "query": "SELECT\n    (ROW_NUMBER() OVER()) as id,\n    date(transactions.`date`, 'start of month') AS `date`,\n    wallets.user_owner AS `users`,\n    wallets.id AS `wallets`,\n    SUM(CASE WHEN transactions.direction = 1 THEN transactions.money ELSE -transactions.money END) AS `cashflow`,\n    ((SUM(CASE WHEN transactions.direction = 1 THEN transactions.money ELSE -transactions.money END) OVER (ORDER BY `date` ASC ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)) + wallets.start_money) AS `balance`\n  FROM transactions\n  JOIN wallets ON wallets.id = transactions.wallet\n  GROUP BY date(transactions.`date`, 'start of month'), wallets.id\n  ORDER BY date(transactions.`date`, 'start of month') ASC"
  }

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "csffh18r",
    "name": "date",
    "type": "json",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSize": 1
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "pudj6615",
    "name": "users",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "_pb_users_auth_",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": []
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "wcr2mf2f",
    "name": "wallets",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "ahksbjygrpxeayw",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "mefoa3pk",
    "name": "cashflow",
    "type": "json",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSize": 1
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "tnyntrmz",
    "name": "balance",
    "type": "json",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSize": 1
    }
  }))

  // remove
  collection.schema.removeField("lssmgxmm")

  // remove
  collection.schema.removeField("obphqyuy")

  // remove
  collection.schema.removeField("udpxpsl4")

  // remove
  collection.schema.removeField("twonftj0")

  // remove
  collection.schema.removeField("b6ujodid")

  return dao.saveCollection(collection)
})
