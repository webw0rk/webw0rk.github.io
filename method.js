/* 独自メソッド */
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

/* コンソールにSelf-XSSの警告を出す */
(() => {
  [
    {
      txt: '⚠️警告',
      css: 'color: red; font-size: 28px;'
    }, {
      txt: 'ここに何かを貼り付けると Self-XSS により個人情報の盗難やアカウント乗っ取りの被害に遭う恐れがあります。\n今よく分からないものを貼り付けようとしているなら、直ちに中止して下さい！',
      css: 'font-size: 16px;'
    }
  ]
    .each((txt_data) => { console.log(`%c${txt_data.txt}`, txt_data.css); });
})();
