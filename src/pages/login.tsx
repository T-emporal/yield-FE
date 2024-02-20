import { useState } from 'react';
import Router from 'next/router';
import Image from 'next/image';
import {
    EyeIcon,
    EyeSlashIcon
  } from "@heroicons/react/24/outline";

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch('/api/auth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (res.ok) {
            Router.push('/'); // Redirect to a protected route or homepage
        } else {
            alert('Failed to login');
        }
    };

    return (
        <div style={{ backgroundImage: 'url("/Background_clean.svg")' }}
            className="flex items-center justify-center flex-col bg-cover h-screen bg-fixed overflow-y-scroll py-8 relative">
<div
        className="orb top-left"
        style={{ top: '10vw', left: '10vh' }}
      ></div>
      <div
        className="orb bottom-right"
        style={{ bottom: '10vw', right: '10vw' }}
      ></div>
            <div>
                <Image
                    src={"/TemporalLogoSmall.svg"}
                    alt="Temporal Logo"
                    className="mb-24"
                    width={100}
                    height={100}
                />
            </div>

            <div className="w-[500px] bg-gray-700/20 backdrop-blur-[4px] rounded-xl p-10 border-temporal50/30 border-[1px]">
                {/* <h3 className="text-center text-xl md:text-2xl font-semibold text-gray-300 pb-10">
                    LOG IN
                </h3> */}

                <h3 className="text-center text-xl md:text-2xl font-semibold text-gray-300 pb-10">
                    WELCOME TO <span className="text-temporal "> DEVNET </span>
                </h3>

                <form onSubmit={handleSubmit} className="flex w-md flex-col space-y-12">
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                        className="p-2 rounded-xl border-1 border-temporal50 bg-neutral-950/30 flex-grow py-3 xl:py-4 pl-7 text-gray-300 focus:outline-none"
                    />
                    <div className="flex items-center relative ">
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            className="p-2 rounded-xl border-1 border-temporal50 bg-neutral-950/30 flex-grow py-3 xl:py-4 pl-7 text-gray-300 focus:outline-none"
                        />
                        <button
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-300"
                            type="button"
                        >
                            {showPassword ? <EyeSlashIcon className={`h-6 w-6 text-gray-300`}aria-hidden="true"/> : <EyeIcon className={`h-6 w-6 text-gray-300`}aria-hidden="true"/>}
                        </button>
                    </div>
                    <button type="submit" className=" hover:bg-temporal50 button mx-auto py-2 text-gray-300 rounded-xl shadow-md border-1 border-temporal">
                        <span className={`button-text z-10`}>
                            LOG IN
                        </span>
                    </button>

                </form>
            </div>

        </div>
    );
};

export default Login;
