/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("rkod9uccj5k0s82")

  collection.indexes = [
    "CREATE INDEX `idx_5HR37FO` ON `budgets` (`user_owner`)"
  ]

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "dahztvyu",
    "name": "tag",
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
  const collection = dao.findCollectionByNameOrId("rkod9uccj5k0s82")

  collection.indexes = []

  // remove
  collection.schema.removeField("dahztvyu")

  return dao.saveCollection(collection)
})
