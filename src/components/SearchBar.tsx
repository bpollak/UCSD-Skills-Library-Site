interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="form-group skill-search">
      <label className="sr-only" htmlFor="skill-search">Search skills</label>
      <input
        id="skill-search"
        type="search"
        className="form-control"
        placeholder="Search skills by name, description, or keywords..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
