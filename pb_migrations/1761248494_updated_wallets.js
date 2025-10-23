/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ahksbjygrpxeayw")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "8ivnjqcn",
    "name": "uuid",
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
  const collection = dao.findCollectionByNameOrId("ahksbjygrpxeayw")

  // remove
  collection.schema.removeField("8ivnjqcn")

  return dao.saveCollection(collection)
})
