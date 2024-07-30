/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "6xfurng04v6d7n4",
    "created": "2024-07-30 18:33:36.207Z",
    "updated": "2024-07-30 18:33:36.207Z",
    "name": "people",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "uqq2r12f",
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
        "id": "0w8aiibk",
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
        "id": "dli4kh73",
        "name": "note",
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
        "id": "oaex6fxa",
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
        "id": "49ogkgh1",
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
  const collection = dao.findCollectionByNameOrId("6xfurng04v6d7n4");

  return dao.deleteCollection(collection);
})
