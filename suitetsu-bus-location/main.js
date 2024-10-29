const select_lines_outer = $Id('select-lines-outer'),
bus_road_display = $Id('bus-road-display');
current_time_display = $Id('current-time-display'),
menu_btn = $Id('menu-btn');
menu = $Id('menu');
/*▼ メニュー表示非表示 */
menu_btn.on('click', () => {
  if(menu.dataset.visible === 'true'){
    menu_btn.dataset.menuVisible = false
    menu.dataset.visible = false;
  } else{
    menu_btn.dataset.menuVisible = true;
    menu.dataset.visible = true;
  }
});
/*▲ メニュー表示非表示 */
/*▼ ロケーション画面生成 */
let bus_road_display_htm = '';
const stop_names = lines_data.stop_names;
const lines = lines_data.lines;
lines.each((line) => {
  let htm = '';
  const stops = line.stops;
  stops.each((stop, i) => {
    const next_stop = stops[i + 1];
    /* 途中止メの目印 */
    const next_option =
      stop === line.line_border
      ? 'data-next-option="undefined"' : '';
    htm += `
<div class="stop-outer">
  <div class="stop-icon">
    <div class="stop-icon-circle" style="--line-color: ${line.line_color};"></div>
  </div>
  <div
    class="stop stop_js"
    data-id="${line.id}"
    data-code="${stop}"
    data-next-default="${next_stop}"
    ${next_option}
  ></div>
  <div class="stop-name">${stop_names[stop]}</div>
</div>`;
    if(next_stop) htm += `
<div class="road-outer">
  <div class="road-icon">
    <div class="road-icon-bar" style="--line-color: ${line.line_color};"></div>
  </div>
  <div class="road road_js" data-id="${line.id}" data-before="${stop}" data-next="${next_stop}"></div>
</div>`;
  });
  htm = `<div id="${line.id}" class="line" style="display: none;">${htm}</div>`;
  bus_road_display_htm += htm;
});
bus_road_display.innerHTML = bus_road_display_htm;
/*▲ ロケーション画面生成 */
/*▼ 系統選択 */
let select_lines_htm = '';
lines.each((line, i) => {
  select_lines_htm += `<option value="${line.id}"${i === 0 ? ' selected' : ''}>${line.title}</option>`;
});
select_lines_htm = `<select id="select-lines" class="select-lines">${select_lines_htm}</select>`;
select_lines_outer.innerHTML = select_lines_htm;
/*▲ 系統選択 */
/*▼ 系統切り替え */
function change_lines(id){
  $Class('line').each((line_htm) => {
    line_htm.id === id
    ? line_htm.style.display = 'block'
    : line_htm.style.display = 'none';
  });
}
const select_lines = $Id('select-lines');
change_lines(select_lines.value);
select_lines.on('change', () => {
  change_lines(select_lines.value);
});
/*▲ 系統切り替え */
const time_zone = 9;
const update_span = 30;
const stopping_time = 30;
let date = {}; // 時刻と平日休日のデータを入れる所
/*▼ 時刻表の時刻を今日のUNIX時間に変換 */
function convert_date_unix(time, add_seconds = 0){
  const convert_date = date.time.replace(/(T).+/, '$1') + time.replace(/^.{2}:.{2}$/, '$&:00');
  return new Date(convert_date).getTime() + add_seconds * 1000 // + ',' + convert_date + ', ' + add_seconds;
}
/*▲ 時刻表の時刻を今日のUNIX時間に変換 */
function display_location(){
  /* リセット */
  document.querySelectorAll('.stop_js, .road_js').each((elem) => { elem.innerHTML = ''; });
  const current_date = new Date(Date.now() + 3600000 * time_zone).toISOString().replace(/\..+Z/, '');
  //const current_date = '2024-10-28T22:06:20';
  date.time = current_date;
  date.unix = new Date(current_date).getTime(); // UNIXミリ秒
  date.type = detect_horiday(date.time);
  current_time_display.innerHTML =
    current_date.replace(/(.+)-(.{2})-(.{2})T(.{2}):(.{2}):.{2}/, '$1/$2/$3 $4:$5 現在') // htmlに出力
  /*▼ 現在位置表示 */
  const lines = lines_data.lines;
  lines.each((line) => {
    const icon = `<img class="bus-icon" src="${line.icon_url}">`;
    line.times[date.type].each((columns) => {
      columns.each((column, i) => {
        const arrival_unix =
          column.arrival_time
          ? convert_date_unix(column.arrival_time)
          : convert_date_unix(column.time, stopping_time * -1),
        departure_unix = 
          column.time
          ? convert_date_unix(column.time)
          : convert_date_unix(column.arrival_time, stopping_time);
        const next_column = columns[i + 1];
        /* 停留所 */
        if(arrival_unix <= date.unix && date.unix < departure_unix)
          document.querySelector(
            `.stop_js[data-id="${line.id}"][data-code="${column.code}"][data-next-default="${next_column?.code}"],
             .stop_js[data-id="${line.id}"][data-code="${column.code}"][data-next-option="${next_column?.code}"]` // 途中止めの場合に必要
          ).innerHTML = icon;
        if(next_column){
          const next_arrival_unix =
            next_column.arrival_time
            ? convert_date_unix(next_column.arrival_time)
            : convert_date_unix(next_column.time, stopping_time * -1);
          /* 道路 */
          if(departure_unix <= date.unix && date.unix < next_arrival_unix)
            document.querySelector(
              `.road_js[data-id="${line.id}"][data-before="${column.code}"][data-next="${next_column.code}"]`
            ).innerHTML = icon;
        }
      });
    });
  });
  /*▲ 現在位置表示 */
}
display_location();
setInterval(display_location, update_span * 1000); // 自動更新