(() => {
  const credit_htm = `<p>制作者: <a href="https://nankai-web-lab.blogspot.com" target="blank">なんかいウェブ研究所</a></p>`;
  $Id('credit').innerHTML = credit_htm;

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
