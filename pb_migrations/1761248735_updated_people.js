/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("6xfurng04v6d7n4")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "bwbwiu5m",
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
  const collection = dao.findCollectionByNameOrId("6xfurng04v6d7n4")

  // remove
  collection.schema.removeField("bwbwiu5m")

  return dao.saveCollection(collection)
})
