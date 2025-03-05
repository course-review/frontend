<script lang="ts">
import router, { decodeToken } from '@/router';
import { useCookies } from 'vue3-cookies';

const { cookies } = useCookies();
const url = new URL(window.location.href);
const jwt = url.searchParams.get('jwt') || '';
const props = await decodeToken(jwt);
cookies.set('jwt', jwt, new Date(props.exp * 1000), "/");

// redirect to get value of origin

const origin = url.searchParams.get('origin') || '';
router.push(origin);

</script>