import { BehaviorSubject } from 'rxjs';
import getConfig from 'next/config';
import Router from 'next/router'

import { fetchWrapper } from '../helpers/fetch-wrapper';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/users`;
const userSubject = new BehaviorSubject(process.browser && JSON.parse(localStorage.getItem('user')));

export const userService = {
    user: userSubject.asObservable(),
    get userValue () { return userSubject.value },
    login,
    logout,
    getAll
};

function login(username, password) {
    // return fetchWrapper.post(`${baseUrl}/authenticate`, { username, password })
    return fetchWrapper.post(`http://192.168.1.70:8082/users/login`, { username, password })
        .then(user => {
            // publish user to subscribers and store in local storage to stay logged in between page refreshes
            userSubject.next(user);
            localStorage.setItem('user', JSON.stringify(user));

            return user;
        });
}

function logout() {
    // remove user from local storage, publish null to user subscribers and redirect to login page
    const a = localStorage.getItem('user')
    const user = JSON.parse(a)
    // console.log(user.token)
    fetch("http://192.168.1.70:8082/logout", {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${user.token}`
        }
    })
    localStorage.removeItem('user');
    userSubject.next(null);
    Router.push('/login');
    // fetch("http://192.168.1.70:8082/logout", {
    //     method: "DELETE"
    // })
}

function getAll() {
    return fetchWrapper.get(baseUrl);
}