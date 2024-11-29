'use client'; // Necesario para manejar eventos en el cliente
import { ApiService } from '@/services/api';
import { useRouter } from 'next/navigation'; // Importar useRouter
import { split } from 'postcss/lib/list';
import React from 'react';
import Swal from 'sweetalert2';

export default function LoginPage() {
  const router = useRouter(); // Instancia de useRouter

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const email = (event.target as any).email.value;
    const password = (event.target as any).password.value;
    try {
      const data = await ApiService.login({ email, password });
      localStorage.setItem('user', JSON.stringify(data.data.user));
      Swal.fire({
        icon: 'success',
        title: data.message,
        text: 'You have successfully logged in!',
      });
      router.push('/dashboard');
    } catch (error) {
    }
  };

  const handleRegisterRedirect = () => {
    router.push('/register'); // Redirigir al registro
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Columna del formulario */}
      <div className="flex flex-col justify-center w-full px-6 py-12 lg:w-1/2">
        <div className="mx-auto w-full max-w-sm">
          <img
            alt="Your Company"
            src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
            className="h-10 w-auto"
          />
          <h2 className="mt-8 text-2xl font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Not a member?{' '}
            <a
              href="#"
              onClick={handleRegisterRedirect}
              className="font-semibold text-indigo-600 hover:text-indigo-500"
            >
              Register here
            </a>
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="block w-full rounded-md border py-2 px-3 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  className="block w-full rounded-md border py-2 px-3 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Columna de la imagen */}
      <div className="relative hidden lg:block w-1/2">
        <img
          alt=""
          src="https://images.unsplash.com/photo-1496917756835-20cb06e75b4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1908&q=80"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    </div>
  );
}