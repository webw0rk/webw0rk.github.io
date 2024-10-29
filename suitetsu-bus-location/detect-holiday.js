function detect_horiday(time){
  const national_holidays = [
'2024-11-03', '2024-11-04', '2024-11-23',
'2025-01-01', '2025-01-13', '2025-02-11', '2025-02-23', '2025-02-24', '2025-03-20', '2025-04-29', '2025-05-03', '2025-05-04', '2025-05-05', '2025-05-06', '2025-07-21', '2025-08-11', '2025-09-15', '2025-09-23', '2025-10-13', '2025-11-03', '2025-11-23', '2025-11-24'
  ];
  const result =
  [0, 6].includes(new Date(time).getDay())
  || national_holidays.includes(time.replace(/T.+/, ''))
  ? 'holiday' : 'weekday';
  return result;
}