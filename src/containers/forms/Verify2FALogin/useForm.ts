
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const formSchema = z.object({
  code: z.string(),
});

const useVerify2FALoginForm = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema), // Connect Zod resolver
    defaultValues: {
      code: '',
    },
  });

  return {
    handleSubmit,
    control,
    errors,
  }
}

export default useVerify2FALoginForm;
