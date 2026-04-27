'use client';

import { AdminLink } from '@/components/admin/AdminLink';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  Tag,
  Mail,
  Settings,
  Store,
  BarChart3,
  Warehouse,
  Gauge,
} from 'lucide-react';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/admin/reports', label: 'Reports', icon: BarChart3 },
  { href: '/admin/performance', label: 'Performance', icon: Gauge },
  { href: '/admin/inventory', label: 'Inventory', icon: Warehouse },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/customers', label: 'Customers', icon: Users },
  { href: '/admin/discounts', label: 'Discounts', icon: Tag },
  { href: '/admin/inquiries', label: 'Inquiries', icon: Mail },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

type AdminSidebarProps = {
  open?: boolean;
  onClose?: () => void;
};

export function AdminSidebar({ open = false, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  const linkClass = (href: string) => {
    const isActive = href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);
    return `flex min-h-[44px] items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors touch-manipulation ${
      isActive
        ? 'bg-orange-50 text-orange-700'
        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
    }`;
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-64 flex-shrink-0 border-r border-gray-200 bg-white pt-14 shadow-xl transition-transform duration-200 ease-out md:static md:w-56 md:pt-0 md:shadow-none ${
        open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}
    >
      <nav className="flex h-full flex-col gap-0.5 overflow-y-auto p-3">
        {navItems.map(({ href, label, icon: Icon }) => (
          <AdminLink key={href} href={href} onClick={onClose} className={linkClass(href)}>
            <Icon className="h-5 w-5 flex-shrink-0" />
            {label}
          </AdminLink>
        ))}
        <div className="my-2 border-t border-gray-100" />
        <AdminLink
          href="/"
          onClick={onClose}
          className="flex min-h-[44px] items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 touch-manipulation"
        >
          <Store className="h-5 w-5 flex-shrink-0" />
          Back to store
        </AdminLink>
      </nav>
    </aside>
  );
}
