import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { provinceMapping } from "@/constants/provinceMapping";

interface ProvinceSelectProps {
  value: string;
  className?: string;
  onChange: (value: string) => void;
  hasAll?: boolean;
};

export const ProvinceSelect: React.FC<ProvinceSelectProps> = ({ value, className, onChange, hasAll }) => (
  <Select onValueChange={onChange} value={value}>
    <SelectTrigger className={className || ''}>
      <SelectValue placeholder="Select a province" />
    </SelectTrigger>
    <SelectContent>
      {hasAll && <SelectItem value="All">All Provinces</SelectItem>}
      {Object.entries(provinceMapping)
        .map(([abbr, name]) => (
          <SelectItem key={abbr} value={abbr}>
            {name} ({abbr})
          </SelectItem>
        ))}
    </SelectContent>
  </Select>
);
