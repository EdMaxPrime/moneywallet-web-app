migrate((db) => {
  const collection = new Collection({
    "id": "ahksbjygrpxeayw",
    "created": "2023-04-17 14:48:23.283Z",
    "updated": "2023-04-17 14:48:23.283Z",
    "name": "wallets",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "1foeafw7",
        "name": "name",
        "type": "text",
        "required": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "oygjcflt",
        "name": "icon",
        "type": "json",
        "required": false,
        "unique": false,
        "options": {}
      },
      {
        "system": false,
        "id": "itgvtq4s",
        "name": "currency",
        "type": "relation",
        "required": false,
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
        "id": "0xhlbzpd",
        "name": "start_money",
        "type": "number",
        "required": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null
        }
      },
      {
        "system": false,
        "id": "063xcp7v",
        "name": "count_in_total",
        "type": "bool",
        "required": false,
        "unique": false,
        "options": {}
      },
      {
        "system": false,
        "id": "e6ommq9y",
        "name": "note",
        "type": "text",
        "required": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "g0vp7if6",
        "name": "archived",
        "type": "bool",
        "required": false,
        "unique": false,
        "options": {}
      },
      {
        "system": false,
        "id": "ioucanen",
        "name": "index",
        "type": "number",
        "required": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null
        }
      },
      {
        "system": false,
        "id": "y4db1dxt",
        "name": "user_owner",
        "type": "relation",
        "required": false,
        "unique": false,
        "options": {
          "collectionId": "_pb_users_auth_",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": []
        }
      }
    ],
    "indexes": [],
    "listRule": "@request.auth.id = user_owner",
    "viewRule": "@request.auth.id = user_owner",
    "createRule": "@request.auth.id != \"\"",
    "updateRule": "@request.auth.id = user_owner",
    "deleteRule": "@request.auth.id = user_owner",
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("ahksbjygrpxeayw");

  return dao.deleteCollection(collection);
})
