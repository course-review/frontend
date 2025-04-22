import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import CourseView from '@/views/CourseView.vue';
import { jwtVerify } from 'jose';
import { useCookies } from 'vue3-cookies';
const { cookies } = useCookies();


type tokenProperties = {
  student: boolean;
	exp: number;
  unique_id: string;
};

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: false }
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/course/:id',
      name: 'course',
      component: CourseView,
      meta: { requiresAuth: false }
    },
    {
      path: '/user',
      name: 'user',
      component: () => import('../views/UserView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/add',
      name: 'add',
      component: () => import('../views/AddView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/AdminView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/tokenset',
      name: 'tokenset',
      component: () => import('../views/TokenView.vue'),
    },
  ]
});

export async function decodeToken(token: string): Promise<tokenProperties> {
  const publicKeyString = import.meta.env.VITE_JWT_PUBLIC_KEY;
  const publicKeyBuffer = Uint8Array.from(atob(publicKeyString), c => c.charCodeAt(0));
  const publicKey = await crypto.subtle.importKey(
    'spki',
    publicKeyBuffer,
    {
      name: 'RSASSA-PKCS1-v1_5',
      hash: 'SHA-256'
    },
    true,
    ['verify']
  );

  // Verify the token
  const { payload } = await jwtVerify(token, publicKey);
  return payload as tokenProperties;
}

export const studentAuth = async (): Promise<boolean> => {
  const token = cookies.get('jwt');

  if (!token) {
    return false; // No token, unauthorized
  }

  try {
    // Ensure the token is for a student
    const props = await decodeToken(token);
    if (!props.student) {
      return false;
    }
    return true;
  } catch (error) {
    console.error('JWT verification failed:', error);
    return false;
  }
}

// Navigation Guard for Authentication
router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAuth) {
    const isAuthenticated = await studentAuth();
    if (!isAuthenticated) {
      //redirect to login page -> n.ethz.ch
      const redirectUrl = `${window.location.origin}/tokenset`;
      const originUrl = to.fullPath;
      const authorizationUrl = "https://n.ethz.ch/~lteufelbe/auth"; //todo set as env var
      window.location.href = `${authorizationUrl}?redirect=${encodeURI(redirectUrl)}&origin=${encodeURI(originUrl)}`;
    }
    next();
  } else {
    next();
  }
});

export default router;
