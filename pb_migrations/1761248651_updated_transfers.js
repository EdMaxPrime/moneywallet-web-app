/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("421znaa1vfrcias")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "dw8vmyg3",
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
  const collection = dao.findCollectionByNameOrId("421znaa1vfrcias")

  // remove
  collection.schema.removeField("dw8vmyg3")

  return dao.saveCollection(collection)
})
