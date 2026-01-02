import { Input, Select, SelectOption } from "@/components/common/ui";

const selectOptions: SelectOption[] = [
  { value: "option1", label: "Option 1" },
  { value: "option2", label: "Option 2" },
  { value: "option3", label: "Option 3" },
];
export default function StepDocument() {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Column */}
        <div className="space-y-4">
          <Input label="PAN Card (Front)" placeholder="PAN Card (Front)" />
          <Input
            label="Aadhaar Card (Front)"
            placeholder="Aadhaar Card (Front)"
          />
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          <Input label="Aadhaar Card (Back)" placeholder="Aadhaar Card (Back)" />
          {/* Add more fields here if needed */}
        </div>
      </div>
    </>
  );
}
