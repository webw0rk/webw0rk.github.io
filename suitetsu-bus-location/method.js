Window.prototype.$Id = function(id){ return document.getElementById(id); }
Window.prototype.$Class = function(class_name){
  return Array.from(document.getElementsByClassName(class_name));
}
Element.prototype.$Class = function(class_name){
  return Array.from(this.getElementsByClassName(class_name));
}
Array.prototype.each = Array.prototype.forEach;
NodeList.prototype.each = NodeList.prototype.forEach;
EventTarget.prototype.on = EventTarget.prototype.addEventListener;