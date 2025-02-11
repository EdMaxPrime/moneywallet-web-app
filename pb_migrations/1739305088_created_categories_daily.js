/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "7h8c1c95oj817uj",
    "created": "2025-02-11 15:58:54.183Z",
    "updated": "2025-02-11 15:58:54.183Z",
    "name": "categories_daily",
    "type": "view",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "hy1min0y",
        "name": "categories",
        "type": "relation",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "89wt72q3zvru4bt",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": null
        }
      },
      {
        "system": false,
        "id": "xk8pgeih",
        "name": "categories_type",
        "type": "select",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "maxSelect": 1,
          "values": [
            "0",
            "1",
            "2"
          ]
        }
      },
      {
        "system": false,
        "id": "jowvcam4",
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
      },
      {
        "system": false,
        "id": "sb4qvkoo",
        "name": "currencies",
        "type": "relation",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "o9irgxs5oy34pvz",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": []
        }
      },
      {
        "system": false,
        "id": "cixfgi8o",
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
          "displayFields": null
        }
      },
      {
        "system": false,
        "id": "k3zgom7w",
        "name": "date",
        "type": "date",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": "",
          "max": ""
        }
      },
      {
        "system": false,
        "id": "aha7v257",
        "name": "money",
        "type": "number",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "noDecimal": true
        }
      }
    ],
    "indexes": [],
    "listRule": "@request.auth.id != '' && @request.auth.id = users",
    "viewRule": "@request.auth.id != '' && @request.auth.id = users",
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {
      "query": "SELECT\n  (categories.id || wallets.id || date(transactions.date)) AS `id`,\n  categories.id AS `categories`,\n  categories.type AS `categories_type`,\n  wallets.id AS `wallets`,\n  wallets.currency AS `currencies`,\n  users.id AS `users`,\n  date(transactions.date) AS `date`,\n  SUM(transactions.money) AS `money`\nFROM\n  transactions\nJOIN\n  categories ON categories.id = transactions.category\nJOIN\n  wallets ON wallets.id = transactions.wallet\nJOIN\n  users ON users.id = wallets.user_owner\nGROUP BY categories.id, date(transactions.date), wallets.id"
    }
  });


  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("7h8c1c95oj817uj");

  return dao.deleteCollection(collection);
})
