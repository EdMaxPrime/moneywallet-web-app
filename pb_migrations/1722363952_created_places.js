/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "k11bp64qiz2e0qe",
    "created": "2024-07-30 18:25:52.932Z",
    "updated": "2024-07-30 18:25:52.932Z",
    "name": "places",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "1rxnp33q",
        "name": "name",
        "type": "text",
        "required": true,
        "presentable": true,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "jlfs83ie",
        "name": "icon",
        "type": "json",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "maxSize": 2000000
        }
      },
      {
        "system": false,
        "id": "dmotzjdu",
        "name": "address",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "kigoeef3",
        "name": "latitude",
        "type": "number",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": -90,
          "max": 90,
          "noDecimal": false
        }
      },
      {
        "system": false,
        "id": "cvtmgrvk",
        "name": "longitude",
        "type": "number",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": -180,
          "max": 180,
          "noDecimal": false
        }
      },
      {
        "system": false,
        "id": "3gems4pb",
        "name": "uuid",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "n8rjqqxk",
        "name": "user_owner",
        "type": "relation",
        "required": true,
        "presentable": true,
        "unique": false,
        "options": {
          "collectionId": "_pb_users_auth_",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": null
        }
      }
    ],
    "indexes": [],
    "listRule": "@request.auth.id = user_owner",
    "viewRule": "@request.auth.id = user_owner",
    "createRule": "@request.auth.id != '' && @request.auth.id = user_owner",
    "updateRule": "@request.auth.id = user_owner",
    "deleteRule": "@request.auth.id = user_owner",
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("k11bp64qiz2e0qe");

  return dao.deleteCollection(collection);
})
