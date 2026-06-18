interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div style={{ marginBottom: '24px' }}>
      <input
        type="search"
        className="search-input"
        placeholder="Search skills by name, description, or keywords..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Search skills"
      />
    </div>
  );
}
