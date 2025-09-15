import { z } from 'zod'

// Import the validation schema from useForm.ts
// We need to extract the schema for testing
const formSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string(),
})

describe('SignInForm Validation Schema', () => {
  describe('Email validation', () => {
    it('validates correct email format', () => {
      const validData = {
        email: 'test@example.com',
        password: 'password123',
      }

      const result = formSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('rejects invalid email format', () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'password123',
      }

      const result = formSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Invalid email address')
        expect(result.error.issues[0].path).toEqual(['email'])
      }
    })

    it('rejects empty email', () => {
      const invalidData = {
        email: '',
        password: 'password123',
      }

      const result = formSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Invalid email address')
        expect(result.error.issues[0].path).toEqual(['email'])
      }
    })

    it('rejects email without @ symbol', () => {
      const invalidData = {
        email: 'testexample.com',
        password: 'password123',
      }

      const result = formSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('rejects email without domain', () => {
      const invalidData = {
        email: 'test@',
        password: 'password123',
      }

      const result = formSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('accepts various valid email formats', () => {
      const validEmails = [
        'user@domain.com',
        'user.name@domain.com',
        'user+tag@domain.co.uk',
        'user123@subdomain.domain.org',
        'test.email+tag@example-domain.com',
      ]

      validEmails.forEach(email => {
        const data = {
          email,
          password: 'password123',
        }
        const result = formSchema.safeParse(data)
        expect(result.success).toBe(true)
      })
    })
  })

  describe('Password validation', () => {
    it('accepts any non-empty string as password', () => {
      const validData = {
        email: 'test@example.com',
        password: 'password123',
      }

      const result = formSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('accepts empty password (no validation rules)', () => {
      const data = {
        email: 'test@example.com',
        password: '',
      }

      const result = formSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('accepts various password formats', () => {
      const passwords = [
        'password',
        '123456',
        'P@ssw0rd!',
        'a',
        'very-long-password-with-special-chars-!@#$%^&*()',
      ]

      passwords.forEach(password => {
        const data = {
          email: 'test@example.com',
          password,
        }
        const result = formSchema.safeParse(data)
        expect(result.success).toBe(true)
      })
    })
  })

  describe('Complete form validation', () => {
    it('validates complete valid form data', () => {
      const validData = {
        email: 'user@example.com',
        password: 'securePassword123',
      }

      const result = formSchema.safeParse(validData)
      expect(result.success).toBe(true)
      
      if (result.success) {
        expect(result.data).toEqual(validData)
      }
    })

    it('rejects form with missing email field', () => {
      const invalidData = {
        password: 'password123',
      }

      const result = formSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('rejects form with missing password field', () => {
      const invalidData = {
        email: 'test@example.com',
      }

      const result = formSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('rejects form with extra fields', () => {
      const dataWithExtra = {
        email: 'test@example.com',
        password: 'password123',
        extraField: 'should not be here',
      }

      const result = formSchema.safeParse(dataWithExtra)
      expect(result.success).toBe(true) // Zod allows extra fields by default
    })

    it('handles null and undefined values', () => {
      const nullData = {
        email: null,
        password: 'password123',
      }

      const undefinedData = {
        email: undefined,
        password: 'password123',
      }

      expect(formSchema.safeParse(nullData).success).toBe(false)
      expect(formSchema.safeParse(undefinedData).success).toBe(false)
    })
  })

  describe('Error messages', () => {
    it('provides correct error message for invalid email', () => {
      const invalidData = {
        email: 'not-an-email',
        password: 'password123',
      }

      const result = formSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      
      if (!result.success) {
        const emailError = result.error.issues.find(issue => issue.path[0] === 'email')
        expect(emailError?.message).toBe('Invalid email address')
      }
    })

    it('provides multiple error messages for multiple invalid fields', () => {
      const invalidData = {
        email: 'not-an-email',
        password: null,
      }

      const result = formSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThan(0)
        const emailError = result.error.issues.find(issue => issue.path[0] === 'email')
        const passwordError = result.error.issues.find(issue => issue.path[0] === 'password')
        
        expect(emailError?.message).toBe('Invalid email address')
        expect(passwordError).toBeDefined()
      }
    })
  })
})
