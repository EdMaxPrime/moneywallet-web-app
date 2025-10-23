/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ahksbjygrpxeayw")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "y4tsq5zm",
    "name": "data_source",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "qoz6uuwdbl7a8wv",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ahksbjygrpxeayw")

  // remove
  collection.schema.removeField("y4tsq5zm")

  return dao.saveCollection(collection)
})
