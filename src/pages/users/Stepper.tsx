type Props = {
  steps?: string[];
  currentStep: number;
};

export default function Stepper({
  steps = [],
  currentStep,
}: Props) {
  return (
    <div className="relative flex justify-between items-start w-full">
      {steps.map((label, index) => {
        const isActive = index <= currentStep;
        const isCompleted = index < currentStep;

        return (
          <div
            key={index}
            className="relative flex flex-col items-center flex-1"
          >
            {/* CONNECTOR LINE */}
            {index !== steps.length - 1 && (
              <div
                className={`absolute top-5 left-1/2 w-full h-1
                ${isCompleted ? "bg-blue-600" : "bg-gray-300"}`}
              />
            )}

            {/* STEP CIRCLE */}
            <div
              className={`z-10 w-10 h-10 flex items-center justify-center
              rounded-full text-sm font-semibold
              ${isActive ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-600"}`}
            >
              {index + 1}
            </div>

            {/* LABEL */}
            <span className="mt-2 text-xs text-center text-gray-700 max-w-[90px]">
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
