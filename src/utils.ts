import dayjs from 'dayjs';

export function renderHumanReadable(due: string, delay: number): { minutes: number; hours: number; translationKey: string } {

  const now = dayjs();
  const currentTime = now.format('HH:mm');

  const currentMinutes = convertToMinutes(currentTime);
  let dueMinutes = convertToMinutes(due);

  if (delay > 0) {
    dueMinutes += delay;
  }

  const timeThreshold = 5;
  const timeDifference = dueMinutes - currentMinutes;

  if (timeDifference === 0) {

    return { minutes: 0, hours: 0, translationKey: 'common.departing' };

  } else if (timeDifference <= timeThreshold && timeDifference > 0) {

    const hours = Math.floor(timeDifference / 60);
    const minutes = timeDifference % 60;

    return { minutes, hours, translationKey: 'common.departs' };

  } else if (timeDifference === -2) {

    return { minutes: 1, hours: 0, translationKey: 'common.departed' };

  } else {
    const totalHours = Math.floor(timeDifference / 60);
    const hours = totalHours % 24; // Take the remainder to get the hours within a day
    const minutes = timeDifference % 60;

    return { minutes, hours, translationKey: 'common.arrives' };
  }
}

// Helper function to convert time string to minutes
function convertToMinutes(time) {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}
