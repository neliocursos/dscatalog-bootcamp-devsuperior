import jwtDecode from 'jwt-decode';

export const CLIENT_ID = 'dscatalog';
export const CLIENT_SECRET = 'dscatalog123';

type LoginResponse = {
    access_token: string;
    token_type: string;
    expires_in: number;
    scope: string;
    userFirstName: string;
    userId: number;
}

export type Role = 'ROLE_OPERATOR' | 'ROLE_ADMIN';

type AccessToken = {
    exp: number;
    user_name: string;
    authorities: Role[];
}

export const saveSessionData = (loginResponse: LoginResponse) => {
    localStorage.setItem('authData', JSON.stringify(loginResponse));
}

export const getSessionData = () => {
    const sessionData = localStorage.getItem('authData') ?? '{}';
    const parsedSessionData = JSON.parse(sessionData);

    return parsedSessionData as LoginResponse;
}

export const getAccessTokenDecoded = () => {
    const sessionData = getSessionData();

    const tokenDecoded = jwtDecode(sessionData.access_token);
    return tokenDecoded as AccessToken;
}

export const isTokenValid = () => {  //Verificando se o token está expirado
    const { exp } = getAccessTokenDecoded();

    return Date.now() <= exp * 1000;
}

export const isAuthenticated = () => {
    const sessionData = getSessionData();

    //Retornando se o usuário está logado e se o token não está expirado
    return sessionData.access_token && isTokenValid();
}

export const isAllowedByRole = (routeRoles: Role[] = []) => {
    if ( routeRoles.length === 0 ) {
        return true;
    }

// Como está na aula, mas está dando erro quando deslogo (apago o registro do login no browser)
// ou entrando pela primeira vez na aplivação, antes de logar.
//    const { authorities } = getAccessTokenDecoded();    
//    return routeRoles.some(role => authorities.includes(role));

//Como estava antes da aula
//    return false;

//Uma outra forma de fazer a mesma coisa, mostrada na aula, mas está dando o mesmo erro.
    const userToken = getAccessTokenDecoded();
    const userRoles = userToken.authorities;
    return routeRoles.some(role => userRoles.includes(role));
}