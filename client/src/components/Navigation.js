import Link from 'next/link';
import React from 'react';
import { LuListTodo } from "react-icons/lu";
import { GiStopwatch } from "react-icons/gi";
import { MdNewspaper } from "react-icons/md";
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { LuCalendarDays } from "react-icons/lu";

const Navigation = () => {
  const pathname = usePathname();
  const router = useRouter();

  const handleNavigation = (path) => (e) => {
    e.preventDefault();
    router.push(path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0  border-t border-gray-200 py-2">
      <div className="w-full flex justify-center items-center gap-10">
        <Link 
          href="/" 
          onClick={handleNavigation('/')}
          className="p-2 rounded-full hover:bg-gray-700 transition-colors"
        >
          <LuListTodo 
            size={50}
            className={pathname === '/todo' ? 'text-red-500' : ''}
          />
        </Link>
        <Link 
          href="/pomodoro" 
          onClick={handleNavigation('/pomodoro')}
          className="p-2 rounded-full hover:bg-gray-700 transition-colors"
        >
          <GiStopwatch 
            size={50}
            color={pathname === '/pomodoro' ? '#EF4444' : 'white'}
          />
        </Link>
        <Link 
          href="/news" 
          onClick={handleNavigation('/news')}
          className="p-2 rounded-full hover:bg-gray-700 transition-colors"
        >
          <MdNewspaper 
            size={50}
            color={pathname === '/news' ? '#EF4444' : 'white'}
          />
        </Link>
        <Link 
          href="/Calender" 
          onClick={handleNavigation('/Calender')}
          className="p-2 rounded-full hover:bg-gray-700 transition-colors"
        >
          <LuCalendarDays
            size={50}
            color={pathname === '/Calender' ? '#EF4444' : 'white'}
          />
        </Link>
      </div>
    </div>
  );
};

export default Navigation;