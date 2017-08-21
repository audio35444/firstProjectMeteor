Template.header.helpers({
  activeRouteClass:function(/*esto es un comentario, se puede pasar un numero indefinido de parametros y se los obtiene en la variable Array... arguments*/){
    var args = Array.prototype.slice.call(arguments,0);
    args.pop();
    var active = _.any(args,function(name){
      return Router.current() && Router.current().route.getName()===name;
    });
    return active && 'active';//false + string devuelve falso, true + string devuelve el string
  }
});
