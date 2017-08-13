Posts = new Mongo.Collection('posts');

//para determinar si es propietario, se mandan los datos al server y que el server verifique
Posts.allow({
  //update:function(userId,post){return ownsDocument(userId,post)},
  remove:function(userId,post){return ownsDocument(userId,post)}
});
Posts.deny({
  update:function(userId,post,fieldNames){
    // var postWithSameLink = Posts.findOne({url:post.url,_id:{$ne:post._id}});
    // console.log(post);
    // console.log('ANTES DEL POSTEXISTS');
    // console.log(postWithSameLink);
    // console.log((postWithSameLink) != null);
    // console.log('DESPUES DEL POSTEXISTS');
    return (_.without(fieldNames,'url','title').length > 0);
  }
});
Meteor.methods({
//POST UPDATE//
  postUpdate:function(userId,postAttributes){
    check(userId,String);
    check(postAttributes,{
      title:String,
      url:String
    });
    var postWithSameLink = Posts.findOne({url:postAttributes.url,_id:{$ne:userId}});
    if(postWithSameLink){
      return {
        postExists:true,
        _id:postWithSameLink._id
      };
    }
    var postEdited = _.extend(postAttributes,{
      lastEdition:new Date()
    });
    Posts.update(userId,{$set:postAttributes});
    return {_id:userId};
  },
//POST INSERT//
  postInsert:function(postAttributes){
    check(this.userId,String);
    check(postAttributes,{
      title:String,
      url:String
    });
    //CompensacionLatencia
      //para probar la COMPENSACION DE LATENCIA
      // if(Meteor.isServer){
      //   postAttributes.title+=" (server)";
      //   Meteor._sleepForMs(5000);
      // }else{
      //   postAttributes.title+=" (client)";
      // }
      //Existe?
    //CompensacionLatenciaEnd
    var postWithSameLink = Posts.findOne({url:postAttributes.url});
    if(postWithSameLink){
      return {
        postExists:true,
        _id:postWithSameLink._id
      };
    }
    //console.log('pasa el postWithSameLink');
    var user=Meteor.user();
    var post=_.extend(postAttributes,{
      userId:user._id,
      author:user.username,
      submitted:new Date()
    });
    var postId = Posts.insert(post);
    return {_id:postId};
  }
});

validatePost = function(post){
  var errors = {};
  if(!post.title)errors.title = "Please fill in a Title";
  if(!post.url)errors.url="Please fill in a URL";

  return errors;
};
// Posts.allow({
//   insert:function(userId,doc){
//     //solo usuarios logeados
//     return !!userId;
//   }
// });
