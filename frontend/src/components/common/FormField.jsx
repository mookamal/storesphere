import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const FormField = ({ 
  label, 
  id, 
  value, 
  onChange, 
  error, 
  required, 
  className, 
  ...props 
}) => {
  return (
    <div className={`w-full ${className}`}>
      <Label htmlFor={id}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Input
        id={id}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className={`mt-2 ${error ? 'border-red-500' : ''}`}
        aria-invalid={!!error}
        {...props}
      />
      {error && (
        <p className="text-red-500 text-sm mt-1" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default FormField;