import dayjs from "dayjs";
import "dayjs/locale/ko";

export function dateFormat(date: string) {
  dayjs.locale("ko");

  return dayjs(date).format("YY-MM-DD A h:mm");
}

export function allDateFormat(date: string) {
  dayjs.locale("ko");

  return dayjs(date).format("YYYY-MM-DD A h:mm");
}
