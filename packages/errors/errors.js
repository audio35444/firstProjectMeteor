// Write your package code here!

// Variables exported by this module can be imported by other packages and
// applications. See errors-tests.js for an example of importing.
Errors = {
  // Local (client-only) collection
  collection: new Meteor.Collection(null),

  throw: function(message) {
    Errors.collection.insert({message: message, seen: false})
  },
  clearSeen: function() {
    Errors.collection.remove({seen: true});
  }
};
