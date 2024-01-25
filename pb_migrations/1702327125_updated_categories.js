/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("89wt72q3zvru4bt")

  collection.listRule = "@request.auth.id != \"\" && @request.auth.id = user_owner"
  collection.viewRule = "@request.auth.id != \"\" && @request.auth.id = user_owner"
  collection.createRule = "@request.auth.id != \"\""
  collection.updateRule = "@request.auth.id != \"\" && @request.auth.id = user_owner"
  collection.deleteRule = "@request.auth.id != \"\" && @request.auth.id = user_owner"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("89wt72q3zvru4bt")

  collection.listRule = null
  collection.viewRule = null
  collection.createRule = null
  collection.updateRule = null
  collection.deleteRule = null

  return dao.saveCollection(collection)
})
