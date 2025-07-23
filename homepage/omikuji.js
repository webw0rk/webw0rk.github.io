// おみくじスクリプト
var omikuji_data = [["大吉", .1], ["中吉", .3], ["小吉", .4], ["凶", .1], ["大凶", .1]];
var omikuji_result_elem = document.getElementById('omikuji-result-elem'),
draw_btn_elem = document.getElementById('draw-btn');
function draw_lot(){
  var result = null;
  var random_num = Math.random();
  var num = 0;
  for(var i = 0; i < omikuji_data.length; i++){
    var top = Math.floor((num + omikuji_data[i][1]) * 10000) / 10000;
    if(num <= random_num && random_num < top)
      result = omikuji_data[i][0];
    num = top;
  }
  draw_btn_elem.innerText = 'もう一度くじを引く';
  omikuji_result_elem.innerHTML = '<FONT size="8" color="#666666">くじ引き中...</FONT>';
  setTimeout(function(){ omikuji_result_elem.innerHTML = '<FONT size="8">結果: ' + result + '</FONT>'; }, 2000);
}
