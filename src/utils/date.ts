export function formatHour(timeStr: string): string {
  try {
    const date = new Date(timeStr);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  } catch {
    return timeStr.slice(11, 16);
  }
}

export function isCurrentHour(timeStr: string): boolean {
  try {
    const target = new Date(timeStr);
    const now = new Date();
    return (
      target.getFullYear() === now.getFullYear() &&
      target.getMonth() === now.getMonth() &&
      target.getDate() === now.getDate() &&
      target.getHours() === now.getHours()
    );
  } catch {
    return false;
  }
}

const WEEKDAYS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

export function formatDailyDate(dateStr: string): { label: string; subLabel: string } {
  try {
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    const today = new Date();

    const isToday =
      today.getFullYear() === date.getFullYear() &&
      today.getMonth() === date.getMonth() &&
      today.getDate() === date.getDate();

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const isTomorrow =
      tomorrow.getFullYear() === date.getFullYear() &&
      tomorrow.getMonth() === date.getMonth() &&
      tomorrow.getDate() === date.getDate();

    let label = WEEKDAYS[date.getDay()];
    if (isToday) label = '今天';
    else if (isTomorrow) label = '明天';

    return { label, subLabel: `${month}/${day}` };
  } catch {
    return { label: dateStr, subLabel: '' };
  }
}

export function formatLastUpdated(date: Date = new Date()): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
}
