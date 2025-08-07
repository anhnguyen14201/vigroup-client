export const formatDateCZ = (dateStr: string) => {
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }
  return new Intl.DateTimeFormat('cs-CZ', options).format(new Date(dateStr))
}

export const formatDateTimeCZ = (
  isoString: string,
  options?: Intl.DateTimeFormatOptions,
) => {
  const date = new Date(isoString)
  return date.toLocaleString('cs-CZ', {
    timeZone: 'Europe/Prague',
    dateStyle: 'medium',
    timeStyle: 'short',
    ...options,
  })
}

export const formatTimeCZ = (
  isoString: string,
  options?: Intl.DateTimeFormatOptions,
): string => {
  const date = new Date(isoString)
  return date.toLocaleTimeString('cs-CZ', {
    timeZone: 'Europe/Prague',
    hour: '2-digit', // hiển thị giờ 2 chữ số
    minute: '2-digit', // hiển thị phút 2 chữ số
    ...options, // cho phép override nếu cần
  })
}
