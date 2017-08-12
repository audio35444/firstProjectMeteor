Template.postSubmit.events({
  'submit form':function(e){
    e.preventDefault();
    var post = {
      url:$(e.target).find('[name=url]').val(),
      title:$(e.target).find('[name=title]').val()
    };
    Meteor.call('postInsert',post,function(error,result){
      if(error)return alert(error.reason);
      if(result.postExists)alert('This link has already been posted');
      Router.go('postPage',{_id:result._id},{query:'insertSuccess=true'});
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
