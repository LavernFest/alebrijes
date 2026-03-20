import React from 'react';
import UserMenu from '../../alebrijes/components/userMenu';

export default function DashboardHeader() {
  return (
    <header className="hidden lg:flex justify-between items-center mb-12">
      <h1 className="text-3xl lg:text-5xl font-bold text-gray-800 tracking-tight">
        Admin Dashboard
      </h1>
      <UserMenu isAdminPage={true} />
    </header>
  );
}