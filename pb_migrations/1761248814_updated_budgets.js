/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("rkod9uccj5k0s82")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "1nneyzav",
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
  const collection = dao.findCollectionByNameOrId("rkod9uccj5k0s82")

  // remove
  collection.schema.removeField("1nneyzav")

  return dao.saveCollection(collection)
})
