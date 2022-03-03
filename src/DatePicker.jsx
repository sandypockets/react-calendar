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

export default function DatePicker() {
  const today = new Date(); //?
  const currentYear = today.getFullYear();
  const currentDayNameIndex = today.getDay() //?
  const currentMonthIndex = today.getMonth();
  const currentDate = today.getDate()

  const [monthToShow, setMonthToShow] = useState(Number(currentMonthIndex))

  const [startHighlightMonthToShow, setStartHighlightMonthToShow] = useState(monthToShow)
  const [endHighlightMonthToShow, setEndHighlightMonthToShow] = useState(monthToShow)

  const [yearToShow, setYearToShow] = useState(Number(currentYear))

  const [firstSelectedDay, setFirstSelectedDay] = useState()
  const [secondSelectedDay, setSecondSelectedDay] = useState()
  const [firstDayIsSet, setFirstDayIsSet] = useState(false)
  const [secondDayIsSet, setSecondDayIsSet] = useState(false)

  let selectedMonthStartDayIndex = (new Date(yearToShow, monthToShow)).getDay();
  let daysInSelectedMonth = 32 - new Date(yearToShow, monthToShow, 32).getDate();
  console.log("Day to show: ", currentDayNameIndex)

  function handleDayClick(itemClicked) {
    if (firstDayIsSet && secondDayIsSet) {
      setFirstDayIsSet(false)
      setSecondDayIsSet(false)
      setSecondSelectedDay(null)
      setFirstSelectedDay(null)
    }
    // set first day selection
    if (!firstDayIsSet) {
      setFirstSelectedDay(itemClicked)
      setSecondSelectedDay(itemClicked)
      setFirstDayIsSet(true)
      setStartHighlightMonthToShow(monthToShow)
    } else {
      // set second day selection
      if (itemClicked > firstSelectedDay) {
        setSecondSelectedDay(itemClicked)
        setFirstDayIsSet(false)
        setEndHighlightMonthToShow(monthToShow)
      } else {
        setFirstSelectedDay(itemClicked)
        setSecondSelectedDay(null)
        setFirstDayIsSet(true)
        console.log("Second date must be after the first date")
      }
    }
  }

  useEffect(() => {
    // Debugging
    console.log("firstSelectedDay", firstSelectedDay)
    console.log("secondSelectedDay", secondSelectedDay)
    console.log("startHighlightMonthToShow", startHighlightMonthToShow)
    console.log("endHighlightMonthToShow", endHighlightMonthToShow)
  }, [firstSelectedDay, secondSelectedDay, startHighlightMonthToShow, endHighlightMonthToShow])

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
      <div className="overflow-x-auto">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="h-64 my-auto6 shadow overflow-hidden border-b border-gray-200 border-1 border-solid border-gray-300 border-b-0 rounded p-4">
            <div className="flex justify-between text-sm">
              <h2 className="font-semibold">{fullMonths[monthToShow]}, {yearToShow}</h2>
            </div>
            <table className="min-w-full divide-y divide-gray-200 mt-2">
              <thead className="bg-gray-50 border-2 border-gray-200 border-solid">
              <tr>
              {dayInitial.map((initial, index) => (
                  <th
                    scope="col"
                    className=" py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center"
                    key={index}
                  >
                    {initial}
                  </th>
                ))}
              </tr>
              </thead>
              <tbody>
              {calendarDates.map((item, index) => (
                <tr key={index}>
                  {calendarDates[index].map((subItem, subIndex) => (
                    <td
                      key={subIndex}
                      className={
                        firstSelectedDay && secondSelectedDay ? (
                          (subItem === firstSelectedDay || subItem >= firstSelectedDay)
                          &&
                          (subItem <= secondSelectedDay || subItem === secondSelectedDay)
                          &&
                          (monthToShow >= startHighlightMonthToShow && monthToShow <= endHighlightMonthToShow)
                            ?
                            "border-solid border-gray-300 border-2 text-center bg-gray-200 p-0.5" :
                            "border-solid border-gray-200 border-2 text-center p-0.5"
                        ) :
                          "border-solid border-gray-200 border-2 text-center p-0.5"
                      }
                      onClick={() => handleDayClick(subItem)}
                    >
                      <span className={monthToShow === currentMonthIndex && subItem === currentDate ? "bg-gray-900 py-1 px-2 rounded-full text-white" : "py-1 px-2"}>
                        {subItem}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-center mt-3">
            <div className="max-w-2xl flex justify-between">
              <button
                onClick={() => handleButtonClick('prev')}
                className="mx-2 px-14 py-1 bg-gray-300 rounded-sm bg-black text-white shadow-md"
              >
                Prev
              </button>
              <button
                onClick={() => handleButtonClick('next')}
                className="mx-2 px-14 py-1 bg-gray-300 rounded-sm bg-black text-white shadow-md"
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