let stream;
let blob_url;
const mime_type = 
  ['video/mp4', 'video/webm', 'video/ogg', 'video/x-matroska']
    .find((mt) => MediaRecorder.isTypeSupported(mt)); // 対応するmime typeを上から順に探す
function elem_visible($id, $class_name){
  $Class($class_name).each((elem) => { elem.dataset.visible = elem.id === $id ? true : false; });
}
function recording_process($stream){
  elem_visible('start-recording-screen', 'content_js');
  stream = $stream;
  const recorder = new MediaRecorder(stream, { mimeType: mime_type }),
  tracks = stream.getTracks();
  $Id('start-recording').on('click', () => {
    recorder.start();
    elem_visible('now-recording-screen', 'content_js');
  }, { once: true });
  $Id('stop-recording').on('click', () => {
    recorder.stop();
    elem_visible('load-preview', 'content_js');
  }, { once: true });
  recorder.on('dataavailable', (event) => {
    const blob = new Blob([event.data], { type: mime_type });
    blob_url = URL.createObjectURL(blob);
    $Id('preview').src = blob_url;
    $Id('download').href = blob_url;
  }, { once: true });
  tracks[0].on('ended', () => {
    if(blob_url) URL.revokeObjectURL(blob_url); // 前の録画データを削除
    elem_visible('start-share-screen', 'content_js');
  }, { once: true });
}
elem_visible('start-share-screen', 'content_js'); // トップ画面を表示
elem_visible(null, 'msg_js'); // デフォルトではエラーメッセージを表示しない
/* getDisplayMedia の対応チェック */
try{
  if(!navigator.mediaDevices.getDisplayMedia)
    elem_visible('not-recording-support-msg', 'msg_js');
} catch{
  if(!navigator.mediaDevices)
    elem_visible('not-recording-support-msg', 'msg_js');
}

/* 画面共有の開始 */
$Id('share-screen').on('click', () => {
  if(!navigator.userAgentData) // 録音対応のチェック 非対応: Safari、FireFox
    if(!confirm('あなたのブラウザは音声の録音に非対応ですが OK ですか？')) return;
  navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
    .then((stream) => { recording_process(stream); }, (reject) => {});
});
$Id('return-recording-screen').on('click', () => {
  if(!confirm('ダウンロードしていない画面録画は削除されますが OK ですか？')) return;
  elem_visible('recording-screen', 'content_js');
  if(blob_url) URL.revokeObjectURL(blob_url);
  recording_process(stream);
});