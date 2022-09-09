import axios from '../api/axios';
import useAuth from './useAuth';

const useRefreshToken = () => {         
    const { setAuth } = useAuth();
    const refresh_token = localStorage.getItem('refresh_token');
    const refresh = async () => {

        const response = await axios.post('/refresh', {
            refresh_token
        });
        localStorage.setItem('refresh_token',response.data.user.refresh_token)
        await setAuth(prev => {
            const auth_data = response
            // console.log("Prev..."+JSON.stringify(prev));
            // console.log(response.data.token);
            return { ...prev, token: response.data.token,auth:response.data,user:response.data.user }
        });
        return response.data.data;
    }
    return refresh;
};

export default useRefreshToken;