import React from 'react';
import { Icon } from './Icon';

export function Navigation() {
  return (
    <nav className="w-full bg-white border-b border-zinc-200 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2 text-zinc-900 font-semibold">
          <Icon name="layers" size={24} className="text-indigo-600" />
          <span>Catalyst UI</span>
        </div>
        <div className="hidden md:flex items-center gap-1">
          <a href="#" className="px-3 py-2 text-sm font-medium text-zinc-900 bg-zinc-100 rounded-md">Components</a>
          <a href="#" className="px-3 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 rounded-md transition-colors">Foundation</a>
          <a href="#" className="px-3 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 rounded-md transition-colors">Templates</a>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative hidden sm:block">
          <Icon name="search" size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="pl-8 pr-3 py-1.5 text-sm bg-zinc-100 border-transparent rounded-md focus:bg-white focus:border-zinc-300 focus:ring-2 focus:ring-zinc-900/20 outline-none transition-all w-48"
          />
        </div>
        <button className="p-2 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-md transition-colors">
          <Icon name="notifications" size={20} />
        </button>
        <div className="h-8 w-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-medium text-sm border border-indigo-200">
          JD
        </div>
      </div>
    </nav>
  );
}
