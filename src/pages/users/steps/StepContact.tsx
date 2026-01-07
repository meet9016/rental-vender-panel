import {
  Input,
  Select,
  SelectOption,
} from "@/components/common/ui";

const selectOptions: SelectOption[] = [
  { value: "option1", label: "Option 1" },
  { value: "option2", label: "Option 2" },
  { value: "option3", label: "Option 3" },
];

export default function StepContact() {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">

        {/* Full Name - Mobile */}
        <Input
          label="Full Name"
          placeholder="Enter your full name"
          className="w-full"
        />
        <Input
          label="Mobile Number"
          placeholder="Enter your mobile number"
          className="w-full"
        />

        {/* Address Line 1 & 2 */}
        <Input
          label="Address Line 1"
          placeholder="Enter your address line 1"
          className="w-full"
        />
        <Input
          label="Address Line 2"
          placeholder="Enter your address line 2"
          className="w-full"
        />

        <Select
          label="Country"
          options={selectOptions}
          value=""
          onChange={() => {}}
          placeholder="Select..."
          className="w-full"
        />
        {/* State - City */}
        <Select
          label="State"
          options={selectOptions}
          value=""
          onChange={() => {}}
          placeholder="Select..."
          className="w-full"
        />
        <Select
          label="City"
          options={selectOptions}
          value=""
          onChange={() => {}}
          placeholder="Select..."
          className="w-full"
        />

        {/* Country - Pincode */}
        <Input
          label="Pincode"
          placeholder="Enter pincode"
          className="w-full"
        /> 
      </div>
    </div>
  );
}
