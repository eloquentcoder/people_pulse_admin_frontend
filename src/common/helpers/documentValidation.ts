/**
 * Document validation helper for Excel and CSV file uploads
 */

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface ExcelColumn {
  name: string;
  required: boolean;
  type: 'string' | 'email' | 'url' | 'phone' | 'number';
  maxLength?: number;
  pattern?: RegExp;
}

export const ORGANIZATION_EXCEL_COLUMNS: ExcelColumn[] = [
  {
    name: 'name',
    required: true,
    type: 'string',
    maxLength: 255,
  },
  {
    name: 'email',
    required: true,
    type: 'email',
    maxLength: 255,
  },
  {
    name: 'phone',
    required: false,
    type: 'phone',
    maxLength: 20,
  },
  {
    name: 'address',
    required: false,
    type: 'string',
    maxLength: 500,
  },
  {
    name: 'city',
    required: false,
    type: 'string',
    maxLength: 100,
  },
  {
    name: 'state',
    required: false,
    type: 'string',
    maxLength: 100,
  },
  {
    name: 'country',
    required: false,
    type: 'string',
    maxLength: 100,
  },
  {
    name: 'postal_code',
    required: false,
    type: 'string',
    maxLength: 20,
  },
  {
    name: 'website',
    required: false,
    type: 'url',
    maxLength: 255,
  },
  {
    name: 'industry',
    required: false,
    type: 'string',
    maxLength: 100,
  },
  {
    name: 'company_size',
    required: false,
    type: 'string',
    maxLength: 50,
  },
];

export const validateExcelFile = (file: File): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check file type
  const allowedTypes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
    'application/vnd.ms-excel', // .xls
    'text/csv', // .csv
    'application/csv', // .csv (alternative MIME type)
  ];

  if (!allowedTypes.includes(file.type)) {
    errors.push('File must be an Excel file (.xlsx or .xls) or CSV file (.csv)');
  }

  // Check file size (10MB max)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    errors.push('File size must be less than 10MB');
  }

  // Check if file is empty
  if (file.size === 0) {
    errors.push('File cannot be empty');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
};

export const validateExcelHeaders = (headers: string[]): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  const requiredColumns = ORGANIZATION_EXCEL_COLUMNS.filter(col => col.required);
  const allColumns = ORGANIZATION_EXCEL_COLUMNS.map(col => col.name);

  // Check for required columns
  for (const requiredCol of requiredColumns) {
    if (!headers.includes(requiredCol.name)) {
      errors.push(`Missing required column: ${requiredCol.name}`);
    }
  }

  // Check for unknown columns
  const unknownColumns = headers.filter(header => !allColumns.includes(header));
  if (unknownColumns.length > 0) {
    warnings.push(`Unknown columns found: ${unknownColumns.join(', ')}. These will be ignored.`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
};

export const validateExcelRow = (row: Record<string, any>, rowIndex: number): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  for (const column of ORGANIZATION_EXCEL_COLUMNS) {
    const value = row[column.name];
    const isEmpty = value === null || value === undefined || value === '';

    // Check required fields
    if (column.required && isEmpty) {
      errors.push(`Row ${rowIndex + 1}: ${column.name} is required`);
      continue;
    }

    // Skip validation for empty optional fields
    if (!column.required && isEmpty) {
      continue;
    }

    // Type validation
    switch (column.type) {
      case 'email':
        if (!isValidEmail(value)) {
          errors.push(`Row ${rowIndex + 1}: ${column.name} must be a valid email address`);
        }
        break;
      case 'url':
        if (!isValidUrl(value)) {
          errors.push(`Row ${rowIndex + 1}: ${column.name} must be a valid URL`);
        }
        break;
      case 'phone':
        if (!isValidPhone(value)) {
          warnings.push(`Row ${rowIndex + 1}: ${column.name} format may be invalid`);
        }
        break;
    }

    // Length validation
    if (column.maxLength && value && value.length > column.maxLength) {
      errors.push(`Row ${rowIndex + 1}: ${column.name} must be less than ${column.maxLength} characters`);
    }

    // Pattern validation
    if (column.pattern && !column.pattern.test(value)) {
      errors.push(`Row ${rowIndex + 1}: ${column.name} format is invalid`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
};

// Helper validation functions
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const isValidPhone = (phone: string): boolean => {
  // Basic phone validation - allows various formats
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
};

export const getRequiredFields = (): string[] => {
  return ORGANIZATION_EXCEL_COLUMNS
    .filter(col => col.required)
    .map(col => col.name);
};

export const getOptionalFields = (): string[] => {
  return ORGANIZATION_EXCEL_COLUMNS
    .filter(col => !col.required)
    .map(col => col.name);
};

export const getAllFields = (): string[] => {
  return ORGANIZATION_EXCEL_COLUMNS.map(col => col.name);
};

export const getFieldDescription = (fieldName: string): string => {
  const field = ORGANIZATION_EXCEL_COLUMNS.find(col => col.name === fieldName);
  if (!field) return '';

  const descriptions: Record<string, string> = {
    name: 'Organization name (required)',
    email: 'Contact email address (required)',
    phone: 'Phone number (optional)',
    address: 'Street address (optional)',
    city: 'City name (optional)',
    state: 'State/Province (optional)',
    country: 'Country name (optional)',
    postal_code: 'Postal/ZIP code (optional)',
    website: 'Organization website URL (optional)',
    industry: 'Industry type (optional)',
    company_size: 'Number of employees (optional)',
  };

  return descriptions[fieldName] || '';
};
