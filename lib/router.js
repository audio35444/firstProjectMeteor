Router.configure({
  layoutTemplate:'layout',
  lodingTemplate:'loading',
  notFoundTemplate:'notFound',
  waitOn:function(){
    return Meteor.subscribe('posts');
  }
});

//Show list posts
Router.route('/',{name:'postsList'});

//Show post
Router.route('/posts/:_id',{
  name:'postPage',
  data:function(){
    var objPost = Posts.findOne(this.params._id);
    objPost.insertSuccess = this.params.query.insertSuccess;
    console.log('ANTES');
    console.log(this.params);
    console.log('DESPUES');
    //,'insertSuccess':this.params.insertSuccess
    return objPost;
  }
});

//Edicion de post
Router.route('/posts/:_id/edit',{
  name:'postEdit',
  data:function(){return Posts.findOne(this.params._id);}
});

//Formulario insert de nuevos post
Router.route('/submit',{
  name:'postSubmit'
});

var requireLogin = function(){
  if(!Meteor.user()){
    if(Meteor.loggingIn()){
      this.render(this.loadingTemplate);
    }else{
    this.render('accessDenied');
    }
  }else{
    this.next();
  }
};
//Hooks
Router.onBeforeAction('dataNotFound',{only:'postPage'});
Router.onBeforeAction(requireLogin,{only:'postSubmit'});
