const input_txt_elem = $Id('input-txt-elem'),
convert_btn = $Id('convert-btn'),
unicode_txt_elem = $Id('unicode-txt-elem'),
pseudo_txt_elem = $Id('pseudo-txt-elem');

/* Unicode変換 */
convert_btn.on('click', () => {
  const input_txt = input_txt_elem.value;

  /* Unicode表記 */
  const txt_arr = input_txt.split(''); // サロゲートペアを分割
  const unicode_arr = txt_arr.map((char) => `\\u${char.charCodeAt().toString(16).padStart(4, 0)}` ); // 文字をUnicode表記に変換した配列
  const unicode_txt = unicode_arr.join('');

  unicode_txt_elem.value = unicode_txt;

  /* 疑似要素 */
  const txt_arr_extension = [...input_txt]; // サロゲートペアを保持
  const pseudo_arr = txt_arr_extension.map((char) => `\\${char.codePointAt().toString(16)}` ); // 文字を疑似要素用表記に変換した配列
  const pseudo_txt = pseudo_arr.join('');

  pseudo_txt_elem.value = pseudo_txt;
});

/* 文字列のコピー */
function copy_txt($elem){
  $elem.on('click', (event) => {
    if(event.target.value === '') return;
    event.target.select();
    navigator.clipboard.writeText(event.target.value).then(() => {
      alert('コピーしました');
    }, () => {
      alert('コピーに失敗しました');
    });
  });
}

copy_txt(unicode_txt_elem);
copy_txt(pseudo_txt_elem);