import {List, MagnifyingGlass, ShoppingCart, SignOut, UserCircle} from '@phosphor-icons/react';

import logo from './logo-header.png';

const Header: React.FC = () => (
  <header id='header' className='z-10 bg-background text-foreground drop-shadow'>
    <div className='container m-auto flex h-14 items-center gap-6'>
      <div className='pl-4'>
        <img src={logo} alt='ACME Logo' className='w-[100px] min-w-[100px]' />
      </div>
      <nav className='flex w-full items-center pr-4 justify-end md:justify-between'>
        <div className='items-center gap-4 hidden md:flex'>
          {/* Menu */}
          <div className='flex items-center gap-2 rounded-md border px-4 py-2'>
            <List className='text-muted-foreground' weight='regular' size={20} />
            <span className='text-medium text-sm text-slate-700'>All categories</span>
          </div>
          {/* Search bar */}
          <div className='flex w-[400px] items-center gap-4 rounded-md border px-4 py-2'>
            <MagnifyingGlass className='text-muted-foreground' weight='regular' size={20} />
            <span className='text-medium text-sm text-muted-foreground'>Search a product</span>
          </div>
        </div>
        {/* User actions */}
        <div className='flex items-center gap-6 text-primary'>
          <div className='flex items-center gap-2'>
            <UserCircle weight='regular' size={20} />
            <span className='text-sm font-medium'>Login</span>
          </div>
          <ShoppingCart weight='regular' size={20} />
          <List className='md:hidden' weight='regular' size={20} />
          <SignOut className='cursor-pointer text-red-600' weight='regular' size={20} />
        </div>
      </nav>
    </div>
    {/* Mobile search bar */}
    <div className='p-4 pt-2 md:hidden'>
      <div className='flex items-center gap-4 rounded-md border px-4 py-2'>
        <MagnifyingGlass className='text-muted-foreground' weight='regular' size={20} />
        <span className='text-medium text-sm text-muted-foreground'>Search a product</span>
      </div>
    </div>
  </header>
);

export default Header;
