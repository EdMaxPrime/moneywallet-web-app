/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "d2l9wf7i2c8cw3u",
    "created": "2024-07-30 18:31:17.539Z",
    "updated": "2024-07-30 18:31:17.539Z",
    "name": "events",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "2awncfwb",
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
        "id": "9rqvcsgo",
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
        "id": "hch4qeby",
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
        "id": "bzhg38xo",
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
        "id": "fliycin7",
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
        "id": "w30qvp1g",
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
        "id": "81sagbop",
        "name": "user_owner",
        "type": "relation",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "_pb_users_auth_",
          "cascadeDelete": true,
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
  const collection = dao.findCollectionByNameOrId("d2l9wf7i2c8cw3u");

  return dao.deleteCollection(collection);
})
