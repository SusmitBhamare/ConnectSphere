import React from 'react'
import { Button } from "../ui/button";
import { FaBarsStaggered } from "react-icons/fa6";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import Home from './Home';
import { getToken } from '@/app/utils/isLoggedIn';

function ResponsiveNavbar() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant={"default"} className="md:hidden">
          <FaBarsStaggered />
        </Button>
      </SheetTrigger>
      <SheetContent className="dark md:hidden">
        <SheetHeader>
          <SheetTitle></SheetTitle>
          <SheetDescription className=''>
            <Home token={getToken()?.value}/>
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}

export default ResponsiveNavbar;