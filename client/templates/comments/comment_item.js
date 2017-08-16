//le damos formato string a un date
Template.commentItem.helpers({
  submittedText:function(){
    return this.submitted.toString();
  }
});
