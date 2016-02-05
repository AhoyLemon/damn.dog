// jshint -W117

var ref = new Firebase('https://damndog.firebaseio.com/pictures');
var wikiHow;

ref.once("value", function(snapshot) {
  wikiHow = snapshot.val();
  console.log(wikiHow);
});