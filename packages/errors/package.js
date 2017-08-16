Package.describe({
  name: 'audio35444:errors',
  version: '1.0.0',
  // Brief, one-line summary of the package.
  summary: 'The pattern to display application errors to the user',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api,where) {
  api.versionsFrom('1.5.1');
  api.use(['minimongo', 'mongo-livedata', 'templating'], 'client');
  api.addFiles(['errors.js', 'errors_list.html', 'errors_list.js'], 'client');
  if (api.export)
    api.export('Errors');
});


Package.onTest(function(api) {
  api.use('errors', 'client');
  api.use(['tinytest', 'test-helpers'], 'client');

  api.add_files('errors_tests.js', 'client');
});
