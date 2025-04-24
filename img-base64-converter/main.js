const upload_file_btn = $Id('upload-file-btn'),
drop_file_elem = $Id('drop-file-elem'),
drop_file_msg_elem = $Id('drop-file-msg-elem'),
loading_msg_elem = $Id('loading-msg-elem'),
img_preview_elem = $Id('img-preview-elem'),
output_txt_elem = $Id('output-txt-elem');

const max_file_size = 2 // MB

$Id('max-file-size-elem').innerText = max_file_size;

/*▼ ファイルの処理 */
const filereader = new FileReader();

function file_process($file){
  console.log($file);
  if(!$file) return; // 異物がドロップされたら処理停止

  if(!$file.type.match(/image\/.+/)){
    alert('画像をアップロードして下さい');
    return;
  }

  if($file.size > max_file_size * 1048576){
    alert(`${max_file_size} MB 以下のファイルをアップロードして下さい`);
    return;
  }

  drop_file_msg_elem.dataset.visible = false;
  loading_msg_elem.dataset.visible = true;
  img_preview_elem.dataset.visible = false; // 以前の画像が表示されないようにするため

  filereader.readAsDataURL($file);
}

filereader.on('load', (event) => {
  const url = event.target.result;
  img_preview_elem.style.backgroundImage = `url('${url}')`;
  output_txt_elem.value = url;

  loading_msg_elem.dataset.visible = false;
  img_preview_elem.dataset.visible = true;
});
/*▲ ファイルの処理 */

/*▼ ファイルドロップ */
drop_file_elem.on('dragover', (event) => {
  event.preventDefault(); // ファイル別タブオープン阻止
  event.target.dataset.dragover = true;
  drop_file_msg_elem.dataset.visible = true;
  loading_msg_elem.dataset.visible = false;
  img_preview_elem.dataset.visible = false;
});

drop_file_elem.on('dragleave', (event) => {
  event.target.dataset.dragover = false;

  const img_loaded = img_preview_elem.style.backgroundImage === ''; // 画像読込前の状態への対応

  drop_file_msg_elem.dataset.visible = img_loaded ? true : false;
  loading_msg_elem.dataset.visible = false;
  img_preview_elem.dataset.visible = img_loaded ? false : true;
});

drop_file_elem.on('drop', (event) => {
  event.preventDefault(); // ファイル別タブオープン阻止
  event.target.dataset.dragover = false; // trueのままになるのを防止
  const file = event.dataTransfer.files[0];

  file_process(file);
});
/*▲ ファイルドロップ */

/*▼ ファイルアップロード */
upload_file_btn.on('change', (event) => {
  const file = event.target.files[0];
  file_process(file);
});
/*▲ ファイルアップロード */

/* URLのコピー */
output_txt_elem.on('click', (event) => {
  if(event.target.value === '') return;
  event.target.select();
  navigator.clipboard.writeText(event.target.value).then(() => {
    alert('コピーしました');
  }, () => {
    alert('コピーに失敗しました');
  });
});