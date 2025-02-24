import { SchedulesProps } from './types';

export default function Fees(props: SchedulesProps): JSX.Element | null {
  const { schedules } = props;

  if (schedules.length == 0) {
    return null;
  }

  const formatTime = (h_24: any) => {
    const hour = parseInt(h_24.split(":")[0])
    const minute = h_24.split(":")[1]
    const meridiem = (hour >= 12) ? 'p.m.' : 'a.m.'
    var h = (hour + 11) % 12 + 1;
    return  (`${h}` + ':' + minute + " " + meridiem);
  }

  const formatSchedule = (scheduleHours: any) => {
    const hoursFrom = scheduleHours.split("-")[0];
    const hoursTo = scheduleHours.split("-")[1];

    return formatTime(hoursFrom) + " - " + formatTime(hoursTo);
  }

  return (
    <div className="mt-2">
      <p>Business Hours:</p>
      <ul className="text-sm text-gray-500">
        {
          schedules.map(function(schedule: any, index: number) {
            return (<li key={index}>{`${schedule.day}: ${formatSchedule(schedule.hours)}`}</li>)
          })
        }
      </ul>
    </div>
  );
}
