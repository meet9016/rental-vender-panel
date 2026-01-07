import { Input, Select, SelectOption } from "@/components/common/ui";

const selectOptions: SelectOption[] = [
  { value: "option1", label: "Option 1" },
  { value: "option2", label: "Option 2" },
  { value: "option3", label: "Option 3" },
];

export default function StepIdentity() {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">

        {/* PAN Number */}
        <Input
          label="PAN Number"
          placeholder="Enter PAN number"
          className="w-full"
        />

        {/* Aadhaar Number */}
        <Input
          label="Aadhaar Number"
          placeholder="Enter Aadhaar number"
          className="w-full"
        />

        {/* Business Name */}
        <Input
          label="Business Name"
          placeholder="Enter business name"
          className="w-full"
        />

        {/* GST Number */}
        <Input
          label="GST Number"
          placeholder="Enter GST number"
          className="w-full"
        />

      </div>
    </div>
  );
}
