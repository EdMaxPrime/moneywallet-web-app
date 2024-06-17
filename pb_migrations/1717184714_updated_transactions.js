/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("062w5syq5s0te4p")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "jjp7xtoi",
    "name": "type",
    "type": "select",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "0",
        "1",
        "2",
        "3",
        "4"
      ]
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("062w5syq5s0te4p")

  // remove
  collection.schema.removeField("jjp7xtoi")

  return dao.saveCollection(collection)
})
