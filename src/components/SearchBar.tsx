interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="form-group skill-search">
      <label className="sr-only" htmlFor="skill-search">Search skills</label>
      <div className="input-group">
        <span className="input-group-addon" aria-hidden="true">
          <span className="glyphicon glyphicon-search" />
        </span>
        <input
          id="skill-search"
          type="search"
          className="form-control"
          placeholder="Search by title, service, category, or skill ID"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
}
