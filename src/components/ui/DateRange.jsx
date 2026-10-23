function DateRange({ from, to, onFromChange, onToChange }) {
  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <input
        type="datetime-local"
        value={from}
        onChange={(e) => onFromChange(e.target.value)}
        className="border rounded-lg px-3 py-2 text-sm bg-white"
        title="From"
      />
      <input
        type="datetime-local"
        value={to}
        onChange={(e) => onToChange(e.target.value)}
        className="border rounded-lg px-3 py-2 text-sm bg-white"
        title="To"
      />
    </div>
  );
}

export default DateRange;