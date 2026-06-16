import React from 'react'

const defaultSteps = [
  'Basic info',
  'Event details',
  'Content',
  'Schedule',
  'Media',
  'Organizer',
  'Preview',
]

function StepWrapper({
  steps = defaultSteps,
  currentStep = 0,
  title,
  description,
  children,
  onBack,
  onNext,
  onSubmit,
  nextLabel = 'Continue',
  backLabel = 'Back',
  submitLabel = 'Save event',
  canGoBack = currentStep > 0,
  isLastStep = currentStep >= steps.length - 1,
}) {
  const progress = Math.round(((currentStep + 1) / steps.length) * 100)

  return (
    <section className="min-h-screen bg-neutral-50 py-8">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <button
            type="button"
            onClick={onBack}
            className="mb-6 text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1"
          >
            ← Back
          </button>

          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm font-semibold text-primary-600 mb-2">STEP {currentStep + 1} OF {steps.length}</p>
                <h1 className="text-4xl font-bold text-neutral-900">
                  {title || steps[currentStep]}
                </h1>
                {description && (
                  <p className="text-lg text-neutral-600 mt-3 max-w-2xl">{description}</p>
                )}
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-neutral-900">{progress}%</p>
                <p className="text-xs text-neutral-600 mt-1">Complete</p>
              </div>
            </div>

            <div className="h-1 bg-neutral-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary-600 to-secondary-600 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {steps.map((step, index) => {
              const isActive = index === currentStep
              const isComplete = index < currentStep

              return (
                <button
                  key={step}
                  type="button"
                  className={`p-3 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-primary-600 text-white shadow-md'
                      : isComplete
                        ? 'bg-accent-100 text-accent-700'
                        : 'bg-neutral-200 text-neutral-600'
                  } hidden sm:flex flex-col items-center justify-center gap-1`}
                  title={step}
                >
                  <span className="text-lg">
                    {isActive ? '•' : isComplete ? '✓' : index + 1}
                  </span>
                  <span className="truncate">{step}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-200 shadow-md overflow-hidden">
          <div className="p-8 md:p-12">
            {children}
          </div>

          <div className="border-t border-neutral-200 bg-neutral-50 px-8 md:px-12 py-6 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-4">
            <button
              type="button"
              onClick={onBack}
              disabled={!canGoBack}
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-neutral-300 bg-white text-neutral-900 font-medium hover:bg-neutral-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {backLabel}
            </button>
            <button
              type="button"
              onClick={isLastStep ? onSubmit : onNext}
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-medium hover:shadow-lg transition-all"
            >
              {isLastStep ? submitLabel : nextLabel}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
export default StepWrapper