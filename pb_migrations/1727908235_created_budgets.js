/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "rkod9uccj5k0s82",
    "created": "2024-10-02 22:30:35.574Z",
    "updated": "2024-10-02 22:30:35.574Z",
    "name": "budgets",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "nx3ygg7w",
        "name": "user_owner",
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
        "id": "xkfokcp1",
        "name": "type",
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
        "id": "hxomasov",
        "name": "category",
        "type": "relation",
        "required": false,
        "presentable": true,
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
        "id": "lo14o24w",
        "name": "start_date",
        "type": "date",
        "required": true,
        "presentable": true,
        "unique": false,
        "options": {
          "min": "",
          "max": ""
        }
      },
      {
        "system": false,
        "id": "wfob6dog",
        "name": "end_date",
        "type": "date",
        "required": true,
        "presentable": true,
        "unique": false,
        "options": {
          "min": "",
          "max": ""
        }
      },
      {
        "system": false,
        "id": "wo27guzv",
        "name": "money",
        "type": "number",
        "required": false,
        "presentable": true,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "noDecimal": true
        }
      },
      {
        "system": false,
        "id": "0gztvss0",
        "name": "currency",
        "type": "relation",
        "required": true,
        "presentable": true,
        "unique": false,
        "options": {
          "collectionId": "o9irgxs5oy34pvz",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": null
        }
      },
      {
        "system": false,
        "id": "etgpkjo0",
        "name": "wallets",
        "type": "relation",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "ahksbjygrpxeayw",
          "cascadeDelete": false,
          "minSelect": 1,
          "maxSelect": null,
          "displayFields": null
        }
      }
    ],
    "indexes": [],
    "listRule": "@request.auth.id = user_owner",
    "viewRule": "@request.auth.id = user_owner",
    "createRule": "@request.auth.id != '' && @request.auth.id = user_owner && @request.auth.id = wallets.user_owner",
    "updateRule": "@request.auth.id = user_owner && @request.auth.id = wallets.user_owner",
    "deleteRule": "@request.auth.id = user_owner",
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("rkod9uccj5k0s82");

  return dao.deleteCollection(collection);
})
