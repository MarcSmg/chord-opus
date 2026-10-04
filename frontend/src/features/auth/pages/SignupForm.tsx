import { Mail, Key } from "iconoir-react"
import { Checkbox } from "../../../shared/ui/Checkbox"
import { Button } from "../../../shared/ui/Button"
import { useNavigate } from "react-router-dom"
import Illustration from "@/assets/signup-illustration.jpg"
import { useId, useState } from "react"
import { authApi } from "@/api/auth"
import { AuthDivider, AuthField, authIconStyles, GoogleButton } from "../components/AuthField"
import Heading from "@/shared/ui/Heading"

export const SignupForm = () => {

  const navigate = useNavigate();
  const id = useId();

  const [formInput, setFormInput] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    confirmPassword: "",
    remember: false,
  });

  const [message, setMessage] = useState("");

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formInput.password !== formInput.confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      await authApi.register({
        username: formInput.username,
        password: formInput.password,
        firstName: formInput.firstName,
        lastName: formInput.lastName,
      });
      navigate("/login");
    } catch {
      setMessage("An error occurred during sign up");
    }
  }

  return (
    <div className='w-full md:grid md:grid-cols-2 md:pt-5 gap-x-10 items-center'>
      <div className='hidden md:block h-full'>
        <img className='w-full h-full rounded-4xl object-cover' src={Illustration} />
      </div>

      <form onSubmit={handleSignUp} className="relative flex flex-col gap-4 w-full pb-5 my-5">
        <Heading level={2}>Create an account</Heading>
        {message && (
          <p className="rounded-xl bg-status-error-soft p-3 text-body-sm text-status-error">{message}</p>
        )}

        <div className="flex flex-col gap-3 sm:flex-row">
          <AuthField
            id={`${id}-first-name`}
            label="First Name"
            type="text"
            placeholder="First Name"
            value={formInput.firstName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormInput(prv => ({ ...prv, firstName: e.target.value }))}
          />
          <AuthField
            id={`${id}-last-name`}
            label="Last Name"
            type="text"
            placeholder="Last Name"
            value={formInput.lastName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormInput(prv => ({ ...prv, lastName: e.target.value }))}
          />
        </div>

        <AuthField
          id={`${id}-username`}
          label="Username"
          type="text"
          placeholder="Username"
          icon={<Mail className={authIconStyles} strokeWidth={2} />}
          value={formInput.username}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormInput(prv => ({ ...prv, username: e.target.value }))}
        />

        <AuthField
          id={`${id}-password`}
          label="Password"
          type="password"
          placeholder="Enter your password"
          icon={<Key className={authIconStyles} strokeWidth={2} />}
          value={formInput.password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormInput(prv => ({ ...prv, password: e.target.value }))}
        />
        <AuthField
          id={`${id}-confirm-password`}
          label="Confirm password"
          type="password"
          placeholder="Confirm your password"
          icon={<Key className={authIconStyles} strokeWidth={2} />}
          value={formInput.confirmPassword}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormInput(prv => ({ ...prv, confirmPassword: e.target.value }))}
        />

        <label htmlFor={`${id}-remember`} className='flex items-center gap-2 text-body-sm text-content-muted cursor-pointer'>
          <Checkbox
            id={`${id}-remember`}
            checked={formInput.remember}
            onChange={(e) => setFormInput(prv => ({ ...prv, remember: e.target.checked }))}
          />
          Remember me
        </label>

        <Button variant="primary" type="submit">Create Account</Button>

        <AuthDivider label="Or sign up with" />

        <GoogleButton />
      </form>

    </div>
  )
}
