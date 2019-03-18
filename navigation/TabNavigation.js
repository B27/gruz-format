import { createBottomTabNavigator, createAppContainer } from 'react-navigation';
import RepoList from '../screens/RepoList';
import Profile from '../screens/Profile';

const Tabs = createBottomTabNavigator({
    RepoList: {
        screen: RepoList
    },
    Profile: {
        screen: Profile
    }
})

export default createAppContainer(Tabs);//https://reactnavigation.org/docs/en/common-mistakes.html
//запихать все в одну