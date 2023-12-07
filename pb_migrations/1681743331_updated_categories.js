migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("89wt72q3zvru4bt")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "q19phefe",
    "name": "parent",
    "type": "relation",
    "required": false,
    "unique": false,
    "options": {
      "collectionId": "89wt72q3zvru4bt",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": []
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("89wt72q3zvru4bt")

  // remove
  collection.schema.removeField("q19phefe")

  return dao.saveCollection(collection)
})
