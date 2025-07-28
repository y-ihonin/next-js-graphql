
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const formSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string(),
});

const useSignInForm = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema), // Connect Zod resolver
    defaultValues: {
      email: '',
      password: '',
    },
  });

  return {
    handleSubmit,
    control,
    errors,
  }
}

export default useSignInForm;
