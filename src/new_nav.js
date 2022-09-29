import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBarChart,
  cilBell,
  cilBritishPound,
  cilCalculator,
  cilCart,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilShareBoxed,
  cilSpeedometer,
  cilStar,
  cilTags,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const new_nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },
  {
    component: CNavTitle,
    name: 'Inventory',
  },
  {
    component: CNavItem,
    name: 'Products',
    to: '/products',
    icon: <CIcon icon={cilTags} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Cateogry',
    to: '/category',
    icon: <CIcon icon={cilShareBoxed} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Inventory',
    to: '/theme/typography',
    icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'User Managemnt',
  },
  {
    component: CNavGroup,
    name: 'All Users',
    to: '/base',
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Users',
        to: '/base/accordion',
      },
      {
        component: CNavItem,
        name: 'Vendors',
        to: '/base/breadcrumbs',
      },
    ],
  },
  {
    component: CNavTitle,
    name: 'Sales & Purchases',
  },
  {
    component: CNavGroup,
    name: 'Sales',
    to: '/base',
    icon: <CIcon icon={cilCart} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Customers',
        to: '/customers',
      },
      {
        component: CNavItem,
        name: 'Sales Orders',
        to: '/sales-orders',
      },
      {
        component: CNavItem,
        name: 'Packages',
        to: '/base/breadcrumbs',
      },
      {
        component: CNavItem,
        name: 'Shipments',
        to: '/base/breadcrumbs',
      },
      {
        component: CNavItem,
        name: 'Delivery Challans',
        to: '/base/breadcrumbs',
      },
      {
        component: CNavItem,
        name: 'Invoices',
        to: '/base/breadcrumbs',
      },
      {
        component: CNavItem,
        name: 'Payments Received',
        to: '/base/breadcrumbs',
      },
      {
        component: CNavItem,
        name: 'Sales Return',
        to: '/base/breadcrumbs',
      },
      {
        component: CNavItem,
        name: 'Credit Notes',
        to: '/base/breadcrumbs',
      },

    ],
  },
  {
    component: CNavGroup,
    name: 'Purchases',
    to: '/base',
    icon: <CIcon icon={cilBarChart} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Vendors',
        to: '/vendors',
      },
      {
        component: CNavItem,
        name: 'Expenses',
        to: '/base/breadcrumbs',
      },
      {
        component: CNavItem,
        name: 'Purshase Order',
        to: '/purchase-orders',
      },
      {
        component: CNavItem,
        name: 'Purchase Receives',
        to: '/base/breadcrumbs',
      },
      {
        component: CNavItem,
        name: 'Bills',
        to: '/base/breadcrumbs',
      },
      {
        component: CNavItem,
        name: 'Payments Made',
        to: '/base/breadcrumbs',
      },
      {
        component: CNavItem,
        name: 'Vendor Credits',
        to: '/base/breadcrumbs',
      },
    ],
  },
  {
    component: CNavTitle,
    name: 'Extras',
  },
  {
    component: CNavGroup,
    name: 'Pages',
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Login',
        to: '/login',
      },
      {
        component: CNavItem,
        name: 'Register',
        to: '/register',
      },
      {
        component: CNavItem,
        name: 'Error 404',
        to: '/404',
      },
      {
        component: CNavItem,
        name: 'Error 500',
        to: '/500',
      },
    ],
  },
  {
    component: CNavItem,
    name: 'Docs',
    href: 'https://coreui.io/react/docs/templates/installation/',
    icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
  },
]

export default new_nav
