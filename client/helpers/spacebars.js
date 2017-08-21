//Es un ayudante GLOBAL//
Template.registerHelper('pluralize',function(n,thing){
  var resultCadena = n+' '+thing;
  if(n !== 0 && n !== 1){resultCadena+='s';}
  return resultCadena;
});
