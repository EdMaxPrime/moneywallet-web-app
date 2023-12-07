migrate((db) => {
  const collection = new Collection({
    "id": "o9irgxs5oy34pvz",
    "created": "2023-04-17 14:37:03.305Z",
    "updated": "2023-04-17 14:37:03.305Z",
    "name": "currencies",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "uexuhurl",
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
        "id": "d7reuc6m",
        "name": "symbol",
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
        "id": "jajky535",
        "name": "decimals",
        "type": "number",
        "required": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null
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
  const collection = dao.findCollectionByNameOrId("o9irgxs5oy34pvz");

  return dao.deleteCollection(collection);
})
