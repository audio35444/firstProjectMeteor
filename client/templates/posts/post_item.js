Template.postItem.helpers({
  //para que no puedan editar los post aquellos que no lo hayan creado
  ownPost:function(){
    return this.userId === Meteor.userId();
  },
  domain:function(){
    var a = document.createElement('a');
    a.href = this.url;
    return a.hostname;//el return es para mostrar lo que sale entre {} del emmber
  },
  upvotedClass:function(){
    var userId = Meteor.userId();
    if (userId && !_.include(this.upvoters, userId)) {
      return 'btn-primary upvotable';
    } else {
      return 'disabled';
    }
  },
  insertSuccess:function(){
    console.log(this.insertSuccess);
    return (this.insertSuccess != null && this.insertSuccess === 'true');
  }
});

Template.postItem.events({
  'click .upvotable':function(e){
    e.preventDefault();
    Meteor.call('upvote',this._id);
  }
});
