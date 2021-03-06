Template.postEdit.onCreated(function() {
  Session.set('postEditErrors', {});
});
Template.postEdit.helpers({
  errorMessage: function(field) {
    return Session.get('postEditErrors')[field];
  },
  errorClass: function (field) {
    return !!Session.get('postEditErrors')[field] ? 'has-error' : '';
  }
});

Template.postEdit.events({
  'submit form':function(e){
    e.preventDefault();//para que el navegador no intente enviar el formulario si volvemos atras o hacemos hacia delante

    var currentPostId = this._id;
    var postProperties ={
      url:$(e.target).find('[name=url]').val(),
      title:$(e.target).find('[name=title]').val()
    };
    var errors = validatePost(postProperties);
    if (errors.title || errors.url)
      return Session.set('postEditErrors', errors);
    Meteor.call('postUpdate',currentPostId,postProperties,function(error,result){
      if(error)return Errors.throw(error.reason);
      if(result.postExists)Errors.throw('This link has already been posted');
      else Router.go('postPage',{_id:result._id});
    });
    // Posts.update(currentPostId,{$set:postProperties},function(err){
    //   if(err)alert(err.reason);
    //   else Router.go('postPage',{_id:currentPostId});
    // });
  },
  'click .delete':function(e){
    e.preventDefault();
    //modificar, por si las dudas se modifica el titulo sin apretar el boton
    if(confirm('Delete this post? (title: '+$(e.target).find('[name=title]').val()+')')){
      var currentPostId = this._id;
      Posts.remove(currentPostId);
      Router.go('home');
    }
  }
});
