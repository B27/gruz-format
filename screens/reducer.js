export const GET_REPOS = 'GET_REPOS';
export const GET_REPOS_SUCCESS = 'GET_REPOS_SUCCESS';
export const GET_REPOS_FAIL = 'GET_REPOS_FAIL';

export const GET_REPO_INFO = 'GET_REPO_INFO';
export const GET_REPO_INFO_SUCCESS = 'GET_REPO_INFO_SUCCESS';
export const GET_REPO_INFO_FAIL = 'GET_REPO_INFO_FAIL';

export const GET_USER = 'GET_USER';
export const GET_USER_SUCCESS = 'GET_USER_SUCCESS';
export const GET_USER_FAIL = 'GET_USER_FAIL';

const initialState = { repos: [], repoInfo: {}, user: {} };

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case GET_REPOS:
            return { ...state, loading: true };
        case GET_REPOS_SUCCESS:
            return { ...state, loading: false, repos: action.payload.data };
        case GET_REPOS_FAIL:
            return { ...state, loading: false, error: 'Ошибка при поиске репозиториев' };
        case GET_REPO_INFO:
            return { ...state, loadingInfo: true };
        case GET_REPO_INFO_SUCCESS:
            return { ...state, loadingInfo: false, repoInfo: action.payload.data };
        case GET_REPO_INFO_FAIL:
            console.log(action.payload);
            return {
                ...state,
                loadingInfo: false,
                errorInfo: 'Error getting repo info'
            };
        case GET_USER:
            return { ...state, loadingProfile: true };
        case GET_USER_SUCCESS:
            return { ...state, loadingProfile: false, user: action.payload.data };
        case GET_USER_FAIL:
            return {
                ...state,
                loadingProfile: false,
                errorUser: 'Error getting user info'
            };
        default:
            return state;
    }
}

export function listRepos(user) {
    return {
        type: GET_REPOS,
        payload: {
            request: {
                url: `/users/${user}/repos`
            }
        }
    };
}

export function getRepoDetail(user, repo) {
    return {
        type: GET_REPO_INFO,
        payload: {
            request: {
                url: `/repos/${user}/${repo}`
            }
        }
    };
}

export function getUser(user) {
    return {
      type: GET_USER,
      payload: {
        request: {
          url: `/users/${user}`
        }
      }
    };
  }