import { Input, Select, SelectOption } from "@/components/common/ui";

const selectOptions: SelectOption[] = [
  { value: "option1", label: "Option 1" },
  { value: "option2", label: "Option 2" },
  { value: "option3", label: "Option 3" },
];

export default function StepIdentity() {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Column */}
        <div className="space-y-4">
          <Input label="PAN Number" placeholder="Enter pan number" />
          <Input label="Aadhaar Linked Mobile" placeholder="Enter aadhaar linked mobile" />
          <Input label="Business Name" placeholder="Enter business name" />
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          <Input
            label="Aadhaar Number"
            placeholder="Enter aadhaar number"
          />
          <Input
            label="GST Number"
            placeholder="Enter gst number"
          />
          {/* Add more fields here if needed */}
        </div>
      </div>
    </>
  );
}
