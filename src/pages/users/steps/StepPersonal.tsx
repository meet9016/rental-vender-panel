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

export default function StepPersonal() {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Column */}
        <div className="space-y-4">
          <Input label="Full Name" placeholder="Enter your full name" />
          <Select
            label="Basic Select"
            options={selectOptions}
            value=""
            onChange={() => {}}
            placeholder="Select..."
          />
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          <Input label="Spouse Name" placeholder="Enter spouse name" />
          <RadioGroup
            name="gender"
            label="Select Gender"
            options={radioOptions}
            value=""
            onChange={() => {}}
          />
          {/* Add more fields here if needed */}
        </div>
      </div>
    </>
  );
}
