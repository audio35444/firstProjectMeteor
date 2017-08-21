Router.configure({
  layoutTemplate:'layout',
  lodingTemplate:'loading',
  notFoundTemplate:'notFound',
  waitOn:function(){
    return Meteor.subscribe('notifications');
  }
});


//Show list posts
// Router.route('/',{name:'postsList'});

//Show post
Router.route('/posts/:_id',{
  name:'postPage',
  waitOn:function(){
    return [
      Meteor.subscribe('singlePost',this.params._id),
      Meteor.subscribe('comments',this.params._id)];
  },
  data:function(){
    var objPost = Posts.findOne(this.params._id);
    objPost.insertSuccess = this.params.query.insertSuccess;
    //,'insertSuccess':this.params.insertSuccess
    return objPost;
  }
});

//Edicion de post
Router.route('/posts/:_id/edit',{
  name:'postEdit',
  waitOn:function(){
    return Meteor.subscribe('singlePost',this.params._id);
  },
  data:function(){return Posts.findOne(this.params._id);}
});

//Formulario insert de nuevos post
Router.route('/submit',{
  name:'postSubmit'
});

//Packete de rutas
PostsListController = RouteController.extend({
  template: 'postsList',
  increment: 5,
  postsLimit: function() {
    return parseInt(this.params.postsLimit) || this.increment;
  },
  findOptions: function() {
    return {sort: this.sort, limit: this.postsLimit()};
  },
  // waitOn: function() {
  //   return Meteor.subscribe('posts', this.findOptions());
  // },
  subscriptions:function(){
    this.postsSub = Meteor.subscribe('posts',this.findOptions());
  },
  posts: function() {
    return Posts.find({}, this.findOptions());
  },
  data:function(){
    var hasMore = this.posts().count() === this.postsLimit();
    var nextPath = this.route.path({postsLimit:this.postsLimit()+this.increment});
    return {
      posts:this.posts(),
      ready:this.postsSub.ready,
      nextPath:hasMore?this.nextPath:null}
  }
});

//NUEVO CODIGO NEWPOSTS Y BESTPOSTS
NewPostsController = PostsListController.extend({
  sort: {submitted: -1, _id: -1},
  nextPath: function() {
    return Router.routes.newPosts.path({postsLimit: this.postsLimit() + this.increment})
  }
});
BestPostsController = PostsListController.extend({
  sort: {votes: -1, submitted: -1, _id: -1},
  nextPath: function() {
    return Router.routes.bestPosts.path({postsLimit: this.postsLimit() + this.increment})
  }
});
Router.route('/', {
  name: 'home',
  controller: NewPostsController
});
Router.route('/new/:postsLimit?', {name: 'newPosts'});
Router.route('/best/:postsLimit?', {name: 'bestPosts'});
//END NUEVO CODIGO NEWPOSTS Y BESTPOSTS
//paginacion de postsList, es una ruta muy general, por lo que las rutas :id deben ir primero
//ES UNA FORMA VIEJA CUANDO NO EXISTIA NEWPOSTS Y BESTPOSTS
// Router.route('/:postsLimit?',{
//   name:'postsList'
// });

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
