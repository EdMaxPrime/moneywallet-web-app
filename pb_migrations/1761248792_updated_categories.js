/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("89wt72q3zvru4bt")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "5tioosig",
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
  const collection = dao.findCollectionByNameOrId("89wt72q3zvru4bt")

  // remove
  collection.schema.removeField("5tioosig")

  return dao.saveCollection(collection)
})
