/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("062w5syq5s0te4p")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "l58gx6p1",
    "name": "deleted",
    "type": "bool",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ptljmkxk",
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
  const collection = dao.findCollectionByNameOrId("062w5syq5s0te4p")

  // remove
  collection.schema.removeField("l58gx6p1")

  // remove
  collection.schema.removeField("ptljmkxk")

  return dao.saveCollection(collection)
})
