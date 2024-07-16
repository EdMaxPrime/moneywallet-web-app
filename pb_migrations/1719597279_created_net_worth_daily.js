/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "mtktzzbsr4of9dz",
    "created": "2024-06-28 17:54:39.330Z",
    "updated": "2024-06-28 17:54:39.330Z",
    "name": "net_worth_daily",
    "type": "view",
    "system": false,
    "schema": [
      {
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
      },
      {
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
      },
      {
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
      },
      {
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
      },
      {
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
      }
    ],
    "indexes": [],
    "listRule": "@request.auth.id != \"\" && @request.auth.id = users && (@request.query.wallet = 'Total' || @request.query.wallet = wallets)",
    "viewRule": "@request.auth.id != \"\" && @request.auth.id = users && (@request.query.wallet = 'Total' || @request.query.wallet = wallets)",
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {
      "query": "WITH groupedByDay AS (\n\tSELECT \n\t\tdate(transactions.`date`) AS `date`,\n\t\twallets.user_owner AS `users`,\n\t\twallets.id AS `wallets`,\n\t\twallets.start_money AS `start_money`,\n\t\tSUM(CASE WHEN transactions.direction = 0 THEN -transactions.money ELSE transactions.money END) AS `cashflow`\n\tFROM transactions\n\tJOIN wallets ON wallets.id = transactions.wallet\n\tGROUP BY date(transactions.`date`), wallets.id\n )\n SELECT\n    (ROW_NUMBER() OVER ()) as id,\n\tgroupedByDay.date,\n\tgroupedByDay.users,\n\tgroupedByDay.wallets,\n\tgroupedByDay.cashflow,\n\t((SUM(groupedByDay.cashflow) OVER (PARTITION BY `wallets` ORDER BY `date` ASC)) + groupedByDay.start_money) AS `balance`\nFROM groupedByDay\nORDER BY `date` ASC;"
    }
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("mtktzzbsr4of9dz");

  return dao.deleteCollection(collection);
})
