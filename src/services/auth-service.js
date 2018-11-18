import axios from 'axios'
import { requestUrl } from '../constants/const'

export default {

    saveToken(token){
        console.log(token);
        let tokenToDate={
            value: token.token,
            expireDate: token.expires_in*1000 + Date.now()
        }
        localStorage.setItem('AuthenticationToken', JSON.stringify(tokenToDate));
    },

    login(user){
        return new Promise((resolve, reject)=>{
            console.log(user);
            axios.post(requestUrl() + '/login',user)
            .then((response)=> {
                this.saveToken(response.data);
                resolve(response.data);
            })
            .catch((error)=> {
                console.log(error);
                reject('Jebga');
            });
        })
    },

    register(user){
        return new Promise((resolve, reject)=>{
            console.log(user);
            axios.post(requestUrl() + '/register',user)
            .then((response)=> {
                resolve(response.data);
            })
            .catch((error)=> {
                console.log(error);
                reject('Jebga');
            });
        })
    },

    isLoggedIn(){
        let savedToken = localStorage.getItem('AuthenticationToken');
        if(!savedToken){
            console.log('No token')
            return false;
        }
        let parsedToken = JSON.parse(savedToken);
        if(parsedToken.expireDate >= Date.now()){
            return true;
        }
        console.log('Token expired')
        return false;
    }
}