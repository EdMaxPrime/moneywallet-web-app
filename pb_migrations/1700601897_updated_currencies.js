/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("o9irgxs5oy34pvz")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "nbtvf32u",
    "name": "iso",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("o9irgxs5oy34pvz")

  // remove
  collection.schema.removeField("nbtvf32u")

  return dao.saveCollection(collection)
})
