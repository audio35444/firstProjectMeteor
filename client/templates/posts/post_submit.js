Template.postSubmit.onCreated(function(){
  Session.set('postSubmitErrors',{});
});

Template.postSubmit.helpers({
  errorMessage:function(field){
    return Session.get('postSubmitErrors')[field];
  },
  errorClass:function(field){
    return !!Session.get('postSubmitErrors')[field]?'has-error':'';
  }
});

Template.postSubmit.events({
  'submit form':function(e){
    e.preventDefault();
    var post = {
      url:$(e.target).find('[name=url]').val(),
      title:$(e.target).find('[name=title]').val()
    };

    var errors = validatePost(post);
    if (errors.title || errors.url)return Session.set('postSubmitErrors',errors);
    var flag ='true';
    Meteor.call('postInsert',post,function(error,result){
      if(error)return Errors.throw(error.reason);
      if(result.postExists){
        flag ='false';
        Errors.throw('This link has already been posted')};
      Router.go('postPage',{_id:result._id},{query:'insertSuccess='+flag});
    });

    //para probar la COMPENSACION DE LATENCIA
    //para probar el method del lado del cliente
    //--si lo dejo adentro del method call, esperaria hasta que vuelva del servidor con el insert
    // Router.go('postsList');


    //es el INSERT viejo
    // post._id = Posts.insert(post);
    // Router.go('postPage',post);
  }
});
