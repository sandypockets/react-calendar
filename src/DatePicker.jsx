import { useEffect, useState } from "react";

const fullMonths = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]
const fullDays = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
]

function formatCompleteDate() {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentDayNameIndex = today.getDate()
  const currentDayNumber = today.getDay()
  const currentMonthIndex = today.getMonth();

  const currentDayName = fullDays[currentDayNumber]
  const currentMonthName = fullMonths[currentMonthIndex]

  function getDateSuffix(number) {
    let suffix = ''
    if (number.length > 1) {
      number = number[1]
    }
    switch (number) {
      case 1:
        suffix = 'st';
        break;
      case 2:
        suffix = 'nd'
        break;
      case 3:
        suffix = 'rd'
        break;
      default:
        suffix = 'th'
    }
    return suffix;
  }

  function addSuffixToDate(number, suffix) {
    return `${number.toString()}${suffix}`
  }

  const dateSuffix = getDateSuffix(currentDayNameIndex)
  const outputSuffix = addSuffixToDate(currentDayNameIndex, dateSuffix)
  return `${currentDayName}, ${currentMonthName} ${outputSuffix}, ${currentYear}`
}

export default function DatePicker() {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentDayNumber = today.getDate()
  const currentDayNameIndex = today.getDay()
  const currentMonthIndex = today.getMonth();

  const [monthToShow, setMonthToShow] = useState(Number(currentMonthIndex))
  const [yearToShow, setYearToShow] = useState(Number(currentYear))
  const [dayToShow, setDayToShow] = useState(Number(currentDayNumber))
  const dateToday = formatCompleteDate()

  const [firstSelectedDay, setFirstSelectedDay] = useState()
  const [secondSelectedDay, setSecondSelectedDay] = useState()
  const [firstDayIsSet, setFirstDayIsSet] = useState(false)

  let selectedMonthStartDayIndex = (new Date(yearToShow, monthToShow)).getDay();
  let daysInSelectedMonth = 32 - new Date(yearToShow, monthToShow, 32).getDate();
  console.log("Day to show: ", currentDayNameIndex)

  function handleDayClick(itemClicked) {
    // set first day selection
    if (!firstDayIsSet) {
      setFirstSelectedDay(itemClicked)
      setSecondSelectedDay(itemClicked)
      setFirstDayIsSet(true)
    } else {
      // set second day selection
      if (itemClicked > firstSelectedDay) {
        setSecondSelectedDay(itemClicked)
        setFirstDayIsSet(false)
      } else {
        setFirstSelectedDay(itemClicked)
        setSecondSelectedDay(null)
        setFirstDayIsSet(true)
        console.log("Second date must be after the first date")
      }
    }
    // highlight all days between
    setDayToShow(itemClicked)
  }

  useEffect(() => {
    console.log("firstSelectedDay", firstSelectedDay)
    console.log("secondSelectedDay", secondSelectedDay)
  }, [firstSelectedDay, secondSelectedDay])

  function handleButtonClick(action) {
    if (action === 'prev') {
      if (monthToShow > 0) {
        setMonthToShow(monthToShow - 1)
      } else {
        setYearToShow(yearToShow - 1)
        setMonthToShow(11)
      }
    }
    if (action === 'next') {
      if (monthToShow < 11) {
        setMonthToShow(monthToShow + 1)
      } else {
        setYearToShow(yearToShow + 1)
        setMonthToShow(0)
      }
    }
    console.log(monthToShow)
  }

  function addEmptyDays(calendarDates) {
    const emptyDates = ['']
    // Add empty space if needed
    for (let i = 1; i < selectedMonthStartDayIndex; i++) {
      emptyDates.push('')
    }
    calendarDates.push(emptyDates)
  }

  function createWeek(calendarDates) {
    let newWeekArr = []
    // Adjust j starting value to change week starting date
    // 0 is sunday, 1 is monday, 2 is tuesday, etc
    for (let j = 1; j <= daysInSelectedMonth; j++) {
      if (calendarDates[0].length % 7 === 0) {
        // Create new array/line
        newWeekArr.push(j)
        if ((newWeekArr.length !== 0 && newWeekArr.length % 7 === 0) || newWeekArr[newWeekArr.length - 1] >= daysInSelectedMonth) {
          calendarDates.push(newWeekArr)
          newWeekArr = []
        }
      } else {
        // add to same array/line
        calendarDates[0].push(j)
      }
    }
  }

  let calendarDates = []
  function createCalendar() {
    addEmptyDays(calendarDates)
    createWeek(calendarDates)
  }
  createCalendar()

  const dayInitial = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

  return (
    <div className="flex flex-col">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="h-64 my-auto6 shadow overflow-hidden border-b border-gray-200 border-1 border-solid border-gray-300 border-b-0 rounded p-4">
            <div className="flex justify-between text-sm">
              <h2 className="w-56">{dateToday}</h2>
              <h2 className="font-semibold">{fullMonths[monthToShow]}, {yearToShow}</h2>
            </div>
            <table className="min-w-full divide-y divide-gray-200 mt-2">
              <thead className="bg-gray-50 border-1 border-gray-200 border-solid">
              <tr>
              {dayInitial.map((initial) => (
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center"
                  >
                    {initial}
                  </th>
                ))}
              </tr>
              </thead>
              <tbody className="border-1 border-solid border-black">
              {calendarDates.map((item, index) => (
                <tr key={index}>
                  {calendarDates[index].map((subItem, subIndex) => (
                    <td
                      key={subIndex}
                      className={
                        (subItem === firstSelectedDay || subItem >= firstSelectedDay)
                        &&
                        (subItem <= secondSelectedDay || subItem === secondSelectedDay)
                          ?
                          "border-solid border-gray-300 border-1 text-center bg-gray-200" :
                          "border-solid border-gray-200 border-1 text-center"
                      }
                      onClick={() => handleDayClick(subItem)}
                    >
                      {subItem}
                    </td>
                  ))}
                </tr>
              ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-center mt-6">
            <div className="max-w-2xl flex justify-between">
              <button
                onClick={() => handleButtonClick('prev')}
                className="mx-2 px-6 py-1 bg-gray-300"
              >
                Prev
              </button>
              <button
                onClick={() => handleButtonClick('next')}
                className="mx-2 px-6 py-1 bg-gray-300"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}