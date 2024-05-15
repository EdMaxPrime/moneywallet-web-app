/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "ng2vixyj0v7dkfy",
    "created": "2024-05-11 03:08:09.397Z",
    "updated": "2024-05-11 03:08:09.397Z",
    "name": "net_worth",
    "type": "view",
    "system": false,
    "schema": [
      {
          "id": "mpnnvymw",
          "name": "date",
          "options": {},
          "presentable": false,
          "required": false,
          "system": false,
          "type": "text",
          "unique": false
      },
      {
          "id": "adcc7ac8",
          "name": "users",
          "options": {
              "cascadeDelete": false,
              "collectionId": "_pb_users_auth_",
              "displayFields": [],
              "maxSelect": 1,
              "minSelect": null
          },
          "presentable": false,
          "required": false,
          "system": false,
          "type": "relation",
          "unique": false
      },
      {
          "id": "0z5dpq0t",
          "name": "wallets",
          "options": {
              "cascadeDelete": false,
              "collectionId": "ahksbjygrpxeayw",
              "displayFields": null,
              "maxSelect": 1,
              "minSelect": null
          },
          "presentable": false,
          "required": false,
          "system": false,
          "type": "relation",
          "unique": false
      },
      {
          "id": "zrwwukco",
          "name": "cashflow",
          "options": {},
          "presentable": false,
          "required": false,
          "system": false,
          "type": "number",
          "unique": false
      },
      {
          "id": "fxpeovbp",
          "name": "balance",
          "options": {},
          "presentable": false,
          "required": false,
          "system": false,
          "type": "number",
          "unique": false
      }
    ],
    "indexes": [],
    "listRule": "@request.auth.id != \"\" && @request.auth.id = users && (@request.query.wallet = 'Total' || @request.query.wallet = wallets)",
    "viewRule": "@request.auth.id != \"\" && @request.auth.id = users && (@request.query.wallet = 'Total' || @request.query.wallet = wallets)",
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {
      "query": "SELECT\n    (ROW_NUMBER() OVER()) as id,\n    date(transactions.`date`, 'start of month') AS `date`,\n    wallets.user_owner AS `users`,\n    wallets.id AS `wallets`,\n    SUM(CASE WHEN transactions.direction = 0 THEN transactions.money ELSE -transactions.money END) AS `cashflow`,\n    ((SUM(CASE WHEN transactions.direction = 0 THEN transactions.money ELSE -transactions.money END) OVER (ORDER BY `date` ASC ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)) + wallets.start_money) AS `balance`\n  FROM transactions\n  JOIN wallets ON wallets.id = transactions.wallet\n  GROUP BY date(transactions.`date`, 'start of month'), wallets.id\n  ORDER BY date(transactions.`date`, 'start of month') ASC"
    }
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("ng2vixyj0v7dkfy");

  return dao.deleteCollection(collection);
})
