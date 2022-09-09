import axios from "../api/axios";
import useAuth from "./useAuth";

const useLogout = () => {
    const { setAuth,auth } = useAuth();

    const logout = async () => {
        try {
            console.log('here at logout!')
            /* const response = await axios('/logout', {
                withCredentials: true,
                'Authorization':'Bearer '+auth.token
            }); */
            return axios.post("/logout", {},{headers:{"Authorization":'Bearer '+auth.token}});
        } catch (err) {
            console.error(err);
        }finally{
            setAuth({});
            localStorage.removeItem('refresh_token','');
        }
    }

    return logout;
}

export default useLogout