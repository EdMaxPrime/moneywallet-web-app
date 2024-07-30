/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("mtktzzbsr4of9dz")

  collection.options = {
    "query": "WITH groupedByDay AS (\n\tSELECT \n\t\tdate(transactions.`date`) AS `date`,\n\t\twallets.user_owner AS `users`,\n\t\twallets.id AS `wallets`,\n\t\twallets.start_money AS `start_money`,\n\t\tSUM(CASE WHEN transactions.direction = 0 THEN -transactions.money ELSE transactions.money END) AS `cashflow`,\n        SUM(CASE WHEN transactions.direction = 0 THEN -transactions.money END) AS `expenses`\n\tFROM transactions\n\tJOIN wallets ON wallets.id = transactions.wallet\n\tGROUP BY date(transactions.`date`), wallets.id\n )\n SELECT\n    (ROW_NUMBER() OVER ()) as id,\n\tgroupedByDay.date,\n\tgroupedByDay.users,\n\tgroupedByDay.wallets,\n    groupedByDay.expenses,\n\tgroupedByDay.cashflow,\n\t((SUM(groupedByDay.cashflow) OVER (PARTITION BY `wallets` ORDER BY `date` ASC)) + groupedByDay.start_money) AS `balance`\nFROM groupedByDay\nORDER BY `date` ASC;"
  }

  // remove
  collection.schema.removeField("7xwcjxco")

  // remove
  collection.schema.removeField("mjultjj0")

  // remove
  collection.schema.removeField("61pxwwr1")

  // remove
  collection.schema.removeField("hbrkahs8")

  // remove
  collection.schema.removeField("suoqlpmf")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "yr61yfsx",
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
    "id": "ocumjvnt",
    "name": "users",
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
    "id": "6ggiaugf",
    "name": "wallets",
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
    "id": "2hce9luq",
    "name": "expenses",
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
    "id": "3p3apfiv",
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
    "id": "f97ncoxy",
    "name": "balance",
    "type": "json",
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
  const collection = dao.findCollectionByNameOrId("mtktzzbsr4of9dz")

  collection.options = {
    "query": "WITH groupedByDay AS (\n\tSELECT \n\t\tdate(transactions.`date`) AS `date`,\n\t\twallets.user_owner AS `users`,\n\t\twallets.id AS `wallets`,\n\t\twallets.start_money AS `start_money`,\n\t\tSUM(CASE WHEN transactions.direction = 0 THEN -transactions.money ELSE transactions.money END) AS `cashflow`\n\tFROM transactions\n\tJOIN wallets ON wallets.id = transactions.wallet\n\tGROUP BY date(transactions.`date`), wallets.id\n )\n SELECT\n    (ROW_NUMBER() OVER ()) as id,\n\tgroupedByDay.date,\n\tgroupedByDay.users,\n\tgroupedByDay.wallets,\n\tgroupedByDay.cashflow,\n\t((SUM(groupedByDay.cashflow) OVER (PARTITION BY `wallets` ORDER BY `date` ASC)) + groupedByDay.start_money) AS `balance`\nFROM groupedByDay\nORDER BY `date` ASC;"
  }

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "7xwcjxco",
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
    "id": "mjultjj0",
    "name": "users",
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
    "id": "61pxwwr1",
    "name": "wallets",
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
    "id": "hbrkahs8",
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
    "id": "suoqlpmf",
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
  collection.schema.removeField("yr61yfsx")

  // remove
  collection.schema.removeField("ocumjvnt")

  // remove
  collection.schema.removeField("6ggiaugf")

  // remove
  collection.schema.removeField("2hce9luq")

  // remove
  collection.schema.removeField("3p3apfiv")

  // remove
  collection.schema.removeField("f97ncoxy")

  return dao.saveCollection(collection)
})
