import { createRouter, createWebHistory } from 'vue-router'
import axios from 'axios'
import SigninView from '@/views/Authentication/SigninView.vue'
import SignupView from '@/views/Authentication/SignupView.vue'
import CalendarView from '@/views/CalendarView.vue'
import BasicChartView from '@/views/Charts/BasicChartView.vue'
import ECommerceView from '@/views/Dashboard/ECommerceView.vue'
import FormElementsView from '@/views/Forms/FormElementsView.vue'
import FormLayoutView from '@/views/Forms/FormLayoutView.vue'
import SettingsView from '@/views/Pages/SettingsView.vue'
import ProfileView from '@/views/ProfileView.vue'
import TablesView from '@/views/TablesView.vue'
import AlertsView from '@/views/UiElements/AlertsView.vue'
import ButtonsView from '@/views/UiElements/ButtonsView.vue'

import InventoryView from '@/views/Inventory/InventoryView.vue'
import InventoryCreate from '@/views/Inventory/InventoryCreate.vue'
import InventoryTransaction from '@/views/Inventory/InventoryTransaction.vue'

// User Management
import AccountsView from '@/views/UserManagement/index.vue';
import AccountCreateView from '@/views/UserManagement/form_create.vue';

import api from '../../laravel-backend/resources/js/axiosInstance.js'
import QRCodeScanner from '@/views/Inventory/QRCodeScanner.vue'

const routes = [
  {
    path: '/',
    name: 'signin',
    component: SigninView,
    meta: {
      title: 'Signin'
    }
  },
  {
    path: '/ecommerce',
    name: 'eCommerce',
    component: ECommerceView,
    meta: {
      title: 'eCommerce Dashboard',
      requiresAuth: true,
    },
   
  },
  {
    path: '/inventory',
    name: 'Inventory',
    component: InventoryView,
    props: route => ({
      id: route.query.id,
      api_token: route.query.api_token,
    }),
    meta: {
      title: 'Inventory Dashboard',
      requiresAuth: false,
    },
    
  },
  {
    path: '/inventory/create',
    name: 'InventoryCreate', // Unique name for the route
    component: InventoryCreate,
    // props: route => ({
    //   id: route.query.id,
    //   api_token: route.query.api_token,
    // }),
    meta: {
      title: 'Inventory Add Item',
      requiresAuth:true
    },
  },
  {
    path: '/inventory/create/:id',
    name: 'InventoryEdit', // Different name for this route
    component: InventoryCreate,
    props: route => ({
      id: route.query.id,
      api_token: route.query.api_token,
    }),
    meta: {
      title: 'Update Item',
      requiresAuth:true
    },
  },  
  {
    path: '/inventory/transactions',
    name: 'InventoryTransaction', // Different name for this route
    component: InventoryTransaction,
    props: route => ({
      id: route.query.id,
      api_token: route.query.api_token,
    }),
    meta: {
      title: 'Update Item',
      requiresAuth:true
    },
  },  
  {
    path: '/user-management/',
    name: 'Account List', // Different name for this route
    component: AccountsView,
    meta: {
      title: 'Account List',
      // requiresAuth:true
    },
  },  
  {
    path: '/user-management/accounts/create',
    name: 'CreateAccount', // Different name for this route
    component: AccountCreateView,
    meta: {
      title: 'CreateAccount',
      // requiresAuth:true
    },
  },  
  {
    path: '/scanner',
    name: 'Scanner', // Different name for this route
    component: QRCodeScanner,
    meta: {
      title: 'Scanner',
      // requiresAuth:true
    },
  },  

 

];

// Create router instance
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Define global `beforeEach` guard
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('api_token');

  // Set document title
  document.title = `DENR CALABARZON | ${to.meta.title || 'Application'}`;

  // Check if route requires authentication
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!token) {
      // Redirect to sign-in if no token is found
      next({ name: 'signin' });
    } else {
      // Validate token with the backend
      api
        .get('/authenticated', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          if (response.data.authenticated) {
            next(); // Proceed if token is valid
          } else {
            next({ name: 'signin' }); // Redirect to sign-in on invalid token
          }
        })
        .catch(() => {
          next({ name: 'signin' }); // Redirect to sign-in on error
        });
    }
  } else {
    next(); // Proceed if route does not require authentication
  }
});

export default router;

