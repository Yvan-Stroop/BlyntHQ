import { cn } from "@/lib/utils"

interface ProgressStepsProps {
  currentStep: number
  steps: Array<{
    title: string
    description: string
  }>
}

export function ProgressSteps({ currentStep, steps }: ProgressStepsProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.title} className="flex-1">
            <div className="relative flex items-center">
              <div
                className={cn(
                  "h-12 w-12 rounded-full border-2 flex items-center justify-center font-semibold",
                  currentStep > index
                    ? "border-primary bg-primary text-primary-foreground"
                    : currentStep === index
                    ? "border-primary text-primary"
                    : "border-muted text-muted-foreground"
                )}
              >
                {index + 1}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "absolute left-[48px] top-[22px] h-0.5 w-[calc(100%-24px)]",
                    currentStep > index ? "bg-primary" : "bg-muted"
                  )}
                />
              )}
            </div>
            <div className="mt-2">
              <div
                className={cn(
                  "text-sm font-medium",
                  currentStep >= index ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {step.title}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {step.description}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 