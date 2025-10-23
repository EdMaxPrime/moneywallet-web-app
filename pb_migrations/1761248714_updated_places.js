/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("k11bp64qiz2e0qe")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "n1yflffk",
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
  const collection = dao.findCollectionByNameOrId("k11bp64qiz2e0qe")

  // remove
  collection.schema.removeField("n1yflffk")

  return dao.saveCollection(collection)
})
