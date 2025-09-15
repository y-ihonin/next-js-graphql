import { renderHook } from '@testing-library/react'
import { useForm } from 'react-hook-form'
import useSignInForm from '../useForm'

// Mock react-hook-form
jest.mock('react-hook-form', () => ({
  useForm: jest.fn(),
}))

// Mock @hookform/resolvers/zod
jest.mock('@hookform/resolvers/zod', () => ({
  zodResolver: jest.fn((schema) => schema),
}))

describe('useSignInForm', () => {
  const mockUseForm = useForm as jest.MockedFunction<typeof useForm>

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns the correct form methods and state', () => {
    const mockControl = {}
    const mockHandleSubmit = jest.fn()
    const mockErrors = {}

    mockUseForm.mockReturnValue({
      control: mockControl,
      handleSubmit: mockHandleSubmit,
      formState: { errors: mockErrors },
      register: jest.fn(),
      unregister: jest.fn(),
      watch: jest.fn(),
      getValues: jest.fn(),
      setValue: jest.fn(),
      trigger: jest.fn(),
      reset: jest.fn(),
      clearErrors: jest.fn(),
      setError: jest.fn(),
      getFieldState: jest.fn(),
      resetField: jest.fn(),
      setFocus: jest.fn(),
    } as unknown as ReturnType<typeof useForm>)

    const { result } = renderHook(() => useSignInForm())

    expect(result.current.control).toBe(mockControl)
    expect(result.current.handleSubmit).toBe(mockHandleSubmit)
    expect(result.current.errors).toBe(mockErrors)
  })

  it('calls useForm with correct configuration', () => {
    const mockControl = {}
    const mockHandleSubmit = jest.fn()
    const mockErrors = {}

    mockUseForm.mockReturnValue({
      control: mockControl,
      handleSubmit: mockHandleSubmit,
      formState: { errors: mockErrors },
      register: jest.fn(),
      unregister: jest.fn(),
      watch: jest.fn(),
      getValues: jest.fn(),
      setValue: jest.fn(),
      trigger: jest.fn(),
      reset: jest.fn(),
      clearErrors: jest.fn(),
      setError: jest.fn(),
      getFieldState: jest.fn(),
      resetField: jest.fn(),
      setFocus: jest.fn(),
    } as unknown as ReturnType<typeof useForm>)

    renderHook(() => useSignInForm())

    const callArgs = mockUseForm.mock.calls[0][0]
    expect(callArgs?.defaultValues).toEqual({
      email: '',
      password: '',
    })
    expect(callArgs?.resolver).toBeDefined()
  })

  it('has correct default values', () => {
    const mockControl = {}
    const mockHandleSubmit = jest.fn()
    const mockErrors = {}

    mockUseForm.mockReturnValue({
      control: mockControl,
      handleSubmit: mockHandleSubmit,
      formState: { errors: mockErrors },
      register: jest.fn(),
      unregister: jest.fn(),
      watch: jest.fn(),
      getValues: jest.fn(),
      setValue: jest.fn(),
      trigger: jest.fn(),
      reset: jest.fn(),
      clearErrors: jest.fn(),
      setError: jest.fn(),
      getFieldState: jest.fn(),
      resetField: jest.fn(),
      setFocus: jest.fn(),
    } as unknown as ReturnType<typeof useForm>)

    renderHook(() => useSignInForm())

    const callArgs = mockUseForm.mock.calls[0][0]
    expect(callArgs?.defaultValues).toEqual({
      email: '',
      password: '',
    })
  })

  it('uses zodResolver for form validation', () => {
    const mockControl = {}
    const mockHandleSubmit = jest.fn()
    const mockErrors = {}

    mockUseForm.mockReturnValue({
      control: mockControl,
      handleSubmit: mockHandleSubmit,
      formState: { errors: mockErrors },
      register: jest.fn(),
      unregister: jest.fn(),
      watch: jest.fn(),
      getValues: jest.fn(),
      setValue: jest.fn(),
      trigger: jest.fn(),
      reset: jest.fn(),
      clearErrors: jest.fn(),
      setError: jest.fn(),
      getFieldState: jest.fn(),
      resetField: jest.fn(),
      setFocus: jest.fn(),
    } as unknown as ReturnType<typeof useForm>)

    renderHook(() => useSignInForm())

    const callArgs = mockUseForm.mock.calls[0][0]
    expect(callArgs?.resolver).toBeDefined()
  })

  it('returns consistent interface', () => {
    const mockControl = {}
    const mockHandleSubmit = jest.fn()
    const mockErrors = {}

    mockUseForm.mockReturnValue({
      control: mockControl,
      handleSubmit: mockHandleSubmit,
      formState: { errors: mockErrors },
      register: jest.fn(),
      unregister: jest.fn(),
      watch: jest.fn(),
      getValues: jest.fn(),
      setValue: jest.fn(),
      trigger: jest.fn(),
      reset: jest.fn(),
      clearErrors: jest.fn(),
      setError: jest.fn(),
      getFieldState: jest.fn(),
      resetField: jest.fn(),
      setFocus: jest.fn(),
    } as unknown as ReturnType<typeof useForm>)

    const { result } = renderHook(() => useSignInForm())

    expect(result.current).toHaveProperty('control')
    expect(result.current).toHaveProperty('handleSubmit')
    expect(result.current).toHaveProperty('errors')
    expect(typeof result.current.control).toBe('object')
    expect(typeof result.current.handleSubmit).toBe('function')
    expect(typeof result.current.errors).toBe('object')
  })
})
