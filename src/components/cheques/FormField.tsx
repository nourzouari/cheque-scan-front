// frontend/src/components/cheques/FormField.tsx
import React from 'react';
import './FormField.css';

interface FormFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  confidence?: number;
  required?: boolean;
  type?: string;
  placeholder?: string;
  multiline?: boolean;
  step?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  value,
  onChange,
  confidence,
  required,
  type = 'text',
  placeholder,
  multiline,
  step
}) => {
  const getConfidenceClass = (score: number = 0) => {
    if (score >= 90) return 'confidence-high';
    if (score >= 70) return 'confidence-medium';
    return 'confidence-low';
  };

  return (
    <div className="form-field">
      <div className="field-header">
        <label className="field-label">
          {label}
          {required && <span className="required-star">*</span>}
        </label>
        {confidence !== undefined && (
          <span className={`confidence-badge ${getConfidenceClass(confidence)}`}>
            {confidence}% confiance
          </span>
        )}
      </div>
      
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          placeholder={placeholder}
          rows={3}
          className={`field-input ${confidence ? getConfidenceClass(confidence) : ''}`}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          placeholder={placeholder}
          step={step}
          className={`field-input ${confidence ? getConfidenceClass(confidence) : ''}`}
        />
      )}
    </div>
  );
};

export default FormField;