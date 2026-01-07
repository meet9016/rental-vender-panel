import {
  Input,
  RadioGroup,
  Select,
  SelectOption,
} from "@/components/common/ui";

const selectOptions: SelectOption[] = [
  { value: "option1", label: "Option 1" },
  { value: "option2", label: "Option 2" },
  { value: "option3", label: "Option 3" },
];

export default function StepBankDetails() {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">

        {/* Holder Name - Account Number */}
        <Input
          label="Bank Account Holder Name"
          placeholder="Enter Bank Account Holder Name"
          className="w-full"
        />

        <Input
          label="Account Number"
          placeholder="Enter Account Number"
          className="w-full"
        />

        {/* Confirm Account - IFSC */}
        <Input
          label="Confirm Account Number"
          placeholder="Re-enter Account Number"
          className="w-full"
        />

        <Input
          label="IFSC Code"
          placeholder="Enter your IFSC Code"
          className="w-full"
        />

        {/* Account Type */}
        <Select
          label="Account Type"
          options={selectOptions}
          value=""
          onChange={() => {}}
          placeholder="Select..."
          className="w-full"
        />

        {/* Full width placeholder area (future use: MICR, Branch etc.) */}
        <div className="hidden md:block"></div>
      </div>
    </div>
  );
}
