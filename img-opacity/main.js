const body_elem = document.body,
upload_file_btn = $Id('upload-file-btn'),
opacity_controller = $Id('opacity-controller'),
dl_btn = $Id('dl-btn'),
select_color_viewer = $Id('select-color-viewer'),
upload_img_canvas = $Id('upload-img-canvas'),
file_drag_overlay = $Id('file-drag-overlay'),
max_file_size_elem = $Id('max-file-size-elem');

const max_file_size = 2; // MB
const default_opacity = 100; //%
const allow_file_type = ['image/png', 'image/webp'];

let img_info = { name: null, type: null, width: null, height: null };
let img_data = null;
let clicked_img_pixel = [];

const img_context = upload_img_canvas.getContext('2d', { willReadFrequently: true }); // 第2引数ないとconsoleで注意される

upload_file_btn.accept = allow_file_type.join(', '); // 属性値追加

/*▼ 透明度設定 */
opacity_controller.value = default_opacity;
opacity_controller.on('change', (event) => {
  let v = event.target.value;
  if(
    isNaN(v) || v === '' || +v < 0 || +v > 100
  ){
    alert('0 ～ 100 の半角数字を入力して下さい');
    opacity_controller.value = default_opacity;
  }
});
/*▲ 透明度設定 */

/*▼ ファイル読み込み */
const filereader = new FileReader();

function read_file($file){
  if(!$file) return; // ファイルアップロードキャンセル時は処理停止
  if(!allow_file_type.includes($file.type)){
    alert('PNG 画像または Webp 画像をアップロードして下さい');
    upload_file_btn.value = '';
    return;
  }
  if($file.size > max_file_size * 1048576){
    alert(`${max_file_size} MB 以下のファイルをアップロードして下さい`);
    upload_file_btn.value = '';
    return;
  }
  img_info.name = $file.name;
  img_info.type = $file.type;

  body_elem.dataset.loading = true;

  filereader.readAsDataURL($file);
}

const hidden_img_elem = new Image();

filereader.on('load', (event) => {
  hidden_img_elem.src = event.target.result;
});

hidden_img_elem.on('load', (event) => {
  img_info.width = event.target.naturalWidth;
  img_info.height = event.target.naturalHeight;
  upload_img_canvas.width = img_info.width;
  upload_img_canvas.height = img_info.height;
  img_context.drawImage(event.target, 0, 0);

  img_data = null; // 前の画像のピクセルデータを削除
  img_data = img_context.getImageData(0, 0, img_info.width, img_info.height);

  body_elem.dataset.loading = false;
});
/*▲ ファイル読み込み */

/*▼ ファイルアップロード */
upload_file_btn.on('change', (event) => {
  const file = event.target.files[0];
  read_file(file);
});
/*▲ ファイルアップロード */

/*▼ ドラッグアンドドロップ */
let dragenter_dragleave_count = 0; // ドラッグが外に出たら0になる

body_elem.on('dragenter', () => {
  dragenter_dragleave_count++; // dragenterの回数をプラス方向にカウント
});
body_elem.on('dragover', (event) => {
  event.preventDefault(); // ファイル別タブオープン阻止
  if(event.dataTransfer.types.includes('Files')) // ローカルファイルのドラッグ時
    file_drag_overlay.dataset.dragged = true;
});
body_elem.on('dragleave', () => {
  dragenter_dragleave_count--; // dragleaveの回数をマイナス方向にカウント
  if(dragenter_dragleave_count === 0) file_drag_overlay.dataset.dragged = false;
});

body_elem.on('drop', (event) => {
  event.preventDefault(); // ファイル別タブオープン阻止
  file_drag_overlay.dataset.dragged = false; // ファイルドロップではdragleaveが発生しないため
  const file = event.dataTransfer.files[0];
  read_file(file);
});
/*▲ ドラッグアンドドロップ */

/*▼ マウスを当てたピクセルの色を表示 */
function get_hovered_pixel_color($event){
  const clicked_pixel_data_index = ($event.offsetX + $event.offsetY * img_info.width) * 4;
  clicked_img_pixel = []; // 以前のピクセル情報を削除
  for(let i = 0; i < 4; i++)
    clicked_img_pixel.push(img_data.data[clicked_pixel_data_index + i]);
  select_color_viewer.innerHTML =
    '<span style="color: rgba('
    + `${clicked_img_pixel[0]}, ${clicked_img_pixel[1]}, ${clicked_img_pixel[2]}, ${clicked_img_pixel[3]}`
  + ')">■</span>'
  + `(R:${clicked_img_pixel[0]} G:${clicked_img_pixel[1]} B:${clicked_img_pixel[2]} A:${clicked_img_pixel[3]})`;
}

function reset_color_preview(){ select_color_viewer.innerText = '未選択'; }

reset_color_preview();
upload_img_canvas.on('mousemove', (event) => { get_hovered_pixel_color(event); });
upload_img_canvas.on('mouseleave', reset_color_preview);

upload_img_canvas.on('click', (event) => {
  get_hovered_pixel_color(event);
  /*▲ マウスを当てたピクセルの色を表示 */

  /*▼ クリックした色の透明度編集 */
  const set_alpha = Math.floor(255 * (1 - opacity_controller.value / 100)); // 透明度の%を0～255の整数に変換

  for(let i = 0; i < img_data.data.length; i = i + 4)
    if(
      img_data.data[i] === clicked_img_pixel[0] &&
      img_data.data[i + 1] === clicked_img_pixel[1] &&
      img_data.data[i + 2] === clicked_img_pixel[2] &&
      img_data.data[i + 3] === clicked_img_pixel[3]
    )
      img_data.data[i + 3] = set_alpha;

  img_context.putImageData(img_data, 0, 0);
  /*▲ クリックした色の透明度編集 */
});

/*▼ 画像DL */
dl_btn.on('click', () => {
  if(upload_img_canvas.width === 0){
    alert('先に画像をアップロードして下さい');
    return;
  }
  /* 見えないaタグを作ってクリック */
  const p_elem = document.createElement('p');
  p_elem.innerHTML =
    `<a href="${upload_img_canvas.toDataURL(img_info.type)}" download="編集_${img_info.name}"></a>`;
  p_elem.children[0].click();
});
/*▲ 画像DL */

max_file_size_elem.innerText = max_file_size; // ファイルサイズ上限表示