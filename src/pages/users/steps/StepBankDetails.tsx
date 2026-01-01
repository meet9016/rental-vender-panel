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

const radioOptions = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
];
export default function StepBankDetails() {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Column */}
        <div className="space-y-4">
          <Input
            label="Bank Account Holder Name"
            placeholder="Enter Bank Account Holder Name"
          />
          <Input
            label="Confirm Account Number"
            placeholder="Enter Confirm Account Number"
          />
          <Select
            label="Account Type"
            options={selectOptions}
            value=""
            onChange={() => {}}
            placeholder="Select..."
          />
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          <Input label="Account Number" placeholder="Enter Account Number" />
          <Input label="IFSC Code" placeholder="Enter your IFSC Code" />

          {/* Add more fields here if needed */}
        </div>
      </div>
    </>
  );
}
