import { useRef, useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { BiCalendar } from "react-icons/bi";
import { IconContext } from "react-icons";

const DeliveryDatePicker = ({
  onChange,
  callbackOnChange,
  className = "border rounded-lg p-2 w-auto text-center text-sm",
  selected,
  ...props
}: {
  onChange?: (date: Date | null) => void;
  callbackOnChange?: (date: Date | null) => void;
  className?: string;
  selected: Date | null;
}) => {
  const datepickerRef = useRef<any>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Set default to today
  useEffect(() => {
    const today = selected || new Date();
    setSelectedDate(today);
    onChange && onChange(today);
    callbackOnChange && callbackOnChange(today);
  }, []);

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    onChange && onChange(date);
    callbackOnChange && callbackOnChange(date);
  };

  const handleClickDatepickerIcon = () => {
    datepickerRef.current?.setOpen(true);
  };

  return (
    <div className="flex items-center space-x-2">
      <DatePicker
        ref={datepickerRef}
        selected={selectedDate}
        onChange={handleDateChange}
        minDate={new Date()}
        dateFormat="dd/MM/yyyy"
        placeholderText="DD/MM/YYYY"
        autoComplete="off"
        className={className}
      />
      <IconContext.Provider value={{ className: "text-xl cursor-pointer text-primary" }}>
        <div onClick={handleClickDatepickerIcon}>
          <BiCalendar />
        </div>
      </IconContext.Provider>
    </div>
  );
};

export default DeliveryDatePicker;
