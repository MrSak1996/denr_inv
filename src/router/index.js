import { createRouter, createWebHistory } from 'vue-router';
import SigninView from '@/views/Authentication/SigninView.vue';
import InventoryView from '@/views/Inventory/InventoryView.vue';
import InventoryCreate from '@/views/Inventory/InventoryCreate.vue';
import InventoryTransaction from '@/views/Inventory/InventoryTransaction.vue';
import AccountsView from '@/views/UserManagement/index.vue';
import AccountCreateView from '@/views/UserManagement/form_create.vue';
import AccountEditView from '@/views/UserManagement/form_edit.vue';
import api from '@/api/axiosInstance';
import QRCodeScanner from '@/views/Inventory/QRCodeScanner.vue';
import summaryVue from '@/views/Inventory/summary.vue';
import DTRMonitoring from '@/views/monitoring/index.vue'
const api_token = localStorage.getItem('api_token');
const routes = [
    {
        path: '/',
        name: 'signin',
        component: SigninView,
        meta: {
            title: 'Signin',
        }
    },
    {
        path: '/inventory/logs',
        name: 'InventoryLogs',
        component: InventoryTransaction,
        meta: {
            title: 'History Logs',
            requiresAuth: true
        },
        beforeEnter: (to, from, next) => {
            const token = localStorage.getItem('api_token');
            api
                .get('/authenticated', {
                params: {
                    api_token: token
                }
            })
                .then((response) => {
                if (response.data.authenticated) {
                    next();
                }
                else {
                    next({ name: 'signin' });
                }
            })
                .catch(() => {
                next({ name: 'signin' });
            });
        }
    },
    {
        path: '/inventory',
        name: 'Inventory',
        component: InventoryView,
        meta: {
            requiresAuth: true
        },
        beforeEnter: (to, from, next) => {
            const token = localStorage.getItem('api_token');
            api
                .get('/authenticated', {
                params: {
                    api_token: token
                }
            })
                .then((response) => {
                if (response.data.authenticated) {
                    next();
                }
                else {
                    next({ name: 'signin' });
                }
            })
                .catch(() => {
                next({ name: 'signin' });
            });
        }
    },
    {
        path: '/inventory/create',
        name: 'InventoryCreate', // Unique name for the route
        component: InventoryCreate,
        meta: {
            title: 'Inventory Add Item',
            requiresAuth: true
        },
        beforeEnter: (to, from, next) => {
            const token = localStorage.getItem('api_token');
            api
                .get('/authenticated', {
                params: {
                    api_token: token
                }
            })
                .then((response) => {
                if (response.data.authenticated) {
                    next();
                }
                else {
                    next({ name: 'signin' });
                }
            })
                .catch(() => {
                next({ name: 'signin' });
            });
        }
    },
    {
        path: '/inventory/create/:id',
        name: 'InventoryEdit', // Different name for this route
        component: InventoryCreate,
        props: (route) => ({
            id: route.query.id,
            api_token: api_token
        }),
        meta: {
            title: 'Update Item',
            requiresAuth: true
        }
    },
    {
        path: '/inventory/summary',
        name: 'Summary', // Different name for this route
        component: summaryVue,
        props: (route) => ({
            id: route.query.id,
            api_token: api_token
        }),
        meta: {
            title: 'Update Item',
            requiresAuth: true
        }
    },
    
    {
        path: '/user-management/',
        name: 'Account List', // Different name for this route
        component: AccountsView,
        meta: {
            title: 'Account List',
            requiresAuth: true
        }
    },
       
    {
        path: '/monitoring',
        name: 'DataMonitoring', // Different name for this route
        component: DTRMonitoring,
        meta: {
            title: 'DataMonitoring',
            requiresAuth: true
        }
    },
    {
        path: '/user-management/accounts/create/:id',
        name: 'EditAccount', // Different name for this route
        component: AccountEditView,
        props: (route) => ({
            id: route.query.id,
            api_token: api_token
        }),
        meta: {
            title: 'EditAccount',
            requiresAuth: true
        }
    },
    {
        path: '/user-management/accounts/create',
        name: 'CreateAccount', // Different name for this route
        component: AccountCreateView,
        meta: {
            title: 'CreateAccount',
            requiresAuth: true
        }
    },
    {
        path: '/scanner',
        name: 'Scanner', // Different name for this route
        component: QRCodeScanner,
        meta: {
            title: 'Scanner',
            requiresAuth: true
        }
    }
];
// Create router instance
// const router = createRouter({
//   history: createWebHistory(import.meta.env.BASE_URL),
//   routes
// })
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
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
        }
        else {
            // Validate token with the backend
            api
                .get('/authenticated', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then((response) => {
                if (response.data.authenticated) {
                    next(); // Proceed if token is valid
                }
                else {
                    next({ name: 'signin' }); // Redirect to sign-in on invalid token
                }
            })
                .catch(() => {
                next({ name: 'signin' }); // Redirect to sign-in on error
            });
        }
    }
    else {
        next(); // Proceed if route does not require authentication
    }
});
export default router;
