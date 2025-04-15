/*▼ ポリフィル */
if(!String.prototype.replaceAll)
  String.prototype.replaceAll =
    function(beforeReplace, afterReplace){
      const regexp_chars = ['\\', '.', '+', '*', '|', '[', ']', '{', '}', '(', ')', '^', '$', '?'];
      if(typeof beforeReplace === 'string'){
        regexp_chars.forEach((char) => {
          beforeReplace = beforeReplace
            .replace(RegExp('\\' + char, 'g'), '\\' + char);
        });
      }
      return this.replace(RegExp(beforeReplace, 'g'), afterReplace);
    };
/*▲ ポリフィル */
const sentence_txt_elem = $Id('sentence-txt-elem'),
replaced_txt_elem = $Id('replaced-txt-elem'),
input_areas = $Id('input-areas'),
add_input_area = $Id('add-input-area');
exec_replace = $Id('exec-replace');
/* 入力欄の追加 */
function generate_input_area(){
  const htm = `
<div class="input-area">
  <input class="before-txt"> → <input class="after-txt">
</div>
`;
  input_areas.insertAdjacentHTML('beforeend', htm);
}
add_input_area.on('click', generate_input_area);
for(let i = 0; i < 4; i++) generate_input_area();
/* 文字列置換処理 */
exec_replace.on('click', () => {
  let sentence_txt = sentence_txt_elem.value;
  let before_txts = $Class('before-txt'),
  after_txts = $Class('after-txt');
  before_txts = before_txts.map((elem) => elem.value);
  after_txts = after_txts.map((elem) => elem.value);
  for(let i = 0; i < before_txts.length; i++)
    if(before_txts[i] !== ''){ // 置換対象の文字が空白なら無視
      sentence_txt = sentence_txt.replaceAll(before_txts[i], after_txts[i]);
    }
  replaced_txt_elem.value = sentence_txt;
});
/* 文字列のコピー */
replaced_txt_elem.on('click', (event) => {
  if(event.target.value === '') return;
  event.target.select();
  navigator.clipboard.writeText(event.target.value).then(() => {
    alert('コピーしました');
  }, () => {
    alert('コピーに失敗しました');
  });
});