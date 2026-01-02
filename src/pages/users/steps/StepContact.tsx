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
export default function StepContact() {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Column */}
        <div className="space-y-4">
          <Input label="Full Name" placeholder="Enter your full name" />
          <Input label="Mobile Number" placeholder="Enter your mobile number" />
          <Input
            label="Address Line 1"
            placeholder="Enter your address line 1"
          />
        <Select
            label="State"
            options={selectOptions}
            value=""
            onChange={() => {}}
            placeholder="Select..."
          />
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          <Input label="Email" placeholder="Enter email" />
          <Input
            label="Address Line 2"
            placeholder="Enter your address line 2"
          />
           <Select
            label="City"
            options={selectOptions}
            value=""
            onChange={() => {}}
            placeholder="Select..."
          />
            <Select
            label="Country"
            options={selectOptions}
            value=""
            onChange={() => {}}
            placeholder="Select..."
          />
          {/* Add more fields here if needed */}
        </div>
      </div>
    </>
  );
}
