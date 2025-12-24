'use client'

import { forwardRef } from 'react'

interface CheckboxProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  disabled?: boolean
  className?: string
  id?: string
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ checked, onChange, label, disabled = false, className = '', id }, ref) => {
    const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`

    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div className="relative">
          <input
            ref={ref}
            type="checkbox"
            id={checkboxId}
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            disabled={disabled}
            className={`
              h-4 w-4 rounded border-gray-300 text-blue-600
              focus:ring-blue-500 focus:ring-2 focus:ring-offset-0
              disabled:opacity-50 disabled:cursor-not-allowed
              ${disabled ? 'bg-gray-100' : 'bg-white'}
            `}
          />
          {checked && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <svg
                className="h-3 w-3 text-blue-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}
        </div>

        {label && (
          <label
            htmlFor={checkboxId}
            className={`
              text-sm font-medium text-gray-700 select-none cursor-pointer
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            {label}
          </label>
        )}
      </div>
    )
  }
)

Checkbox.displayName = 'Checkbox'