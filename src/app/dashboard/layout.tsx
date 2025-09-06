
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Home, LogOut, Goal, GraduationCap, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { OwlIcon } from '@/components/logo';


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("user_session");
    router.replace("/login");
  };

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
             <OwlIcon className="w-8 h-8 text-primary" />
             <span className="text-2xl font-bold font-headline text-primary">
              Morning_Owls
            </span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === '/dashboard'}
                tooltip="My Progress"
              >
                <Link href="/dashboard">
                  <Home />
                  <span>My Progress</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === '/dashboard/goals'}
                tooltip="Your Goals"
              >
                <Link href="/dashboard/goals">
                  <Goal />
                  <span>Your Goals</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith('/dashboard/course')}
                tooltip="My Course"
              >
                <Link href="/dashboard/course">
                  <GraduationCap />
                  <span>My Course</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith('/dashboard/community')}
                tooltip="Community"
              >
                <Link href="/dashboard/community">
                  <Users />
                  <span>Community</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="flex items-center justify-between p-4 border-b">
          <SidebarTrigger />
           <Button onClick={handleLogout} variant="ghost">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </header>
        <main>{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
