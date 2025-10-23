/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("d2l9wf7i2c8cw3u")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "raa8n5k2",
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
  const collection = dao.findCollectionByNameOrId("d2l9wf7i2c8cw3u")

  // remove
  collection.schema.removeField("raa8n5k2")

  return dao.saveCollection(collection)
})
