/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "qoz6uuwdbl7a8wv",
    "created": "2025-10-22 20:38:03.149Z",
    "updated": "2025-10-22 20:38:03.149Z",
    "name": "data_source",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "bieybv3x",
        "name": "user",
        "type": "relation",
        "required": true,
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
        "id": "eriwzbi8",
        "name": "type",
        "type": "select",
        "required": true,
        "presentable": true,
        "unique": false,
        "options": {
          "maxSelect": 1,
          "values": [
            "web",
            "json_import"
          ]
        }
      }
    ],
    "indexes": [],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("qoz6uuwdbl7a8wv");

  return dao.deleteCollection(collection);
})
