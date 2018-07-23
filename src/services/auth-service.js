import axios from 'axios'


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
            axios.post('http://localhost:8000/api/login',user)
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
            axios.post('http://localhost:8000/api/register',user)
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
            console.log('Token valid')
            return true;
        }
        console.log('Token expired')
        return false;
    }
}