import * as Yup from 'yup';

export interface LoginFormValues {
  email: string;
  password: string;
  remember: boolean;
}

export const loginValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  remember: Yup.boolean(),
});

export const initialLoginValues: LoginFormValues = {
  email: '',
  password: '',
  remember: false,
};

