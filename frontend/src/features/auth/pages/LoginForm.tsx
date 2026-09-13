import { Mail, Lock } from 'iconoir-react'
import { Button } from '@/shared/ui/Button';
import { Checkbox } from '@/shared/ui/Checkbox';
import GoogleIcon from "@/assets/google-icon.svg"
import { Input } from '@/shared/ui/Input';
import { useNavigate } from 'react-router-dom';
import Illustration from "@/assets/illust.svg";
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import { authApi } from '@/api/auth';
import type { ApiUser } from '@/types/api';

export const LoginForm = () => {

    const navigate = useNavigate();
    const { login } = useAuth();

    const inputStyles = "pl-11 py-3 w-full border-2 border-stroke-subtle rounded-xl outline-primary/50 outline-0 focus:outline-3 transition-all duration-100";
    const iconStyles = "absolute left-4 text-stroke-strong";

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
        <div className='md:grid md:grid-cols-2'>
            <img className='hidden md:block' src={Illustration} />
            <form onSubmit={handleLogin} action="" className="relative flex flex-col justify-center gap-5 w-full pb-5">
                {message}
                <Input
                    type="text"
                    placeholder="Enter username or email"
                    className={inputStyles}
                    icon={<Mail className={iconStyles} strokeWidth={2} />}
                    value={formInput.login}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormInput(prv => ({ ...prv, login: e.target.value }))}
                />

                <Input
                    type="password"
                    placeholder="Enter your password"
                    className={inputStyles}
                    icon={<Lock className={iconStyles} strokeWidth={2} />}
                    value={formInput.password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormInput(prv => ({ ...prv, password: e.target.value }))}
                />

                <div className='flex gap-3'>
                    <Checkbox value='remember' />
                    Remember me
                </div>

                <Button variant="primary" type="submit" >Log In</Button>
                <div className='relative flex justify-center items-center w-full h-[0.08rem] my-2 bg-gray-300'>
                    <p className='absolute px-2 bg-ui-card'>Or sign in with</p>
                </div>
                <div className='w-full'>
                    <Button icon={<img className='size-6' src={GoogleIcon} />} className='w-full border border-stroke-strong/50'>Google</Button>
                </div>

            </form>
        </div>
    )
}
