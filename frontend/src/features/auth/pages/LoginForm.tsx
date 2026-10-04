import { Mail, Key } from 'iconoir-react'
import { Button } from '@/shared/ui/Button';
import { Checkbox } from '@/shared/ui/Checkbox';
import { useNavigate } from 'react-router-dom';
import Illustration from "@/assets/login-illustration.jpg";
import { useAuth } from '@/context/AuthContext';
import { useId, useState } from 'react';
import { authApi } from '@/api/auth';
import type { ApiUser } from '@/types/api';
import { AuthDivider, AuthField, authIconStyles, GoogleButton } from '../components/AuthField';
import Heading from '@/shared/ui/Heading';

export const LoginForm = () => {

    const navigate = useNavigate();
    const { login } = useAuth();
    const id = useId();

    const [formInput, setFormInput] = useState({
        login: "",
        password: "",
        remember: false
    })

    const [message, setMessage] = useState("");

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        let user: ApiUser | null = null;
        try {
            await authApi.login(formInput)
            user = await authApi.me()
            login(user)
            navigate("/home");
        } catch {
            setMessage("An error occurred during login")
        }
    }

    return (
        <div className='w-full md:grid md:grid-cols-2 md:pt-5 gap-x-10 items-center'>
            <div className='hidden md:block h-full'>
                <img className='w-full h-full rounded-4xl object-cover' src={Illustration} />
            </div>
            <form onSubmit={handleLogin} className="relative flex flex-col gap-4 w-full pb-5 my-5">
                <Heading level={2}>Sign In</Heading>
                {message && (
                    <p className="rounded-xl bg-status-error-soft p-3 text-body-sm text-status-error">{message}</p>
                )}

                <AuthField
                    id={`${id}-login`}
                    label="Username or email"
                    type="text"
                    placeholder="Enter username or email"
                    icon={<Mail className={authIconStyles} strokeWidth={2} />}
                    value={formInput.login}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormInput(prv => ({ ...prv, login: e.target.value }))}
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

                <label htmlFor={`${id}-remember`} className='flex items-center gap-2 text-body-sm text-content-muted cursor-pointer'>
                    <Checkbox
                        id={`${id}-remember`}
                        checked={formInput.remember}
                        onChange={(e) => setFormInput(prv => ({ ...prv, remember: e.target.checked }))}
                    />
                    Remember me
                </label>

                <Button variant="primary" type="submit">Sign In</Button>

                <AuthDivider label="Or sign in with" />

                <GoogleButton />
            </form>
        </div>
    )
}
