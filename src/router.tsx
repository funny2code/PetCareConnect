import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Signup from './screens/auth/Signup';
import Login from './screens/auth/Login';
import {CommonActions, NavigationContainer} from '@react-navigation/native';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import OnBoarding from './screens/auth/onboarding/OnBoarding';
import Home from './screens/pages/Home';
import {createEmptyUser, getUser} from '../services/user';
import {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native';
import {ActivityIndicator, BottomNavigation} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import {userActions} from '../redux/store';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Settings from './screens/pages/Settings';
import {createDrawerNavigator} from '@react-navigation/drawer';
import Pets from './screens/pages/Pets';
import Profile from './screens/pages/drawer/Profile';

const Tab = createBottomTabNavigator();

const Drawer = createDrawerNavigator();

const DrawerPages = () => {
  return (
    <Drawer.Navigator >
      <Drawer.Screen  name='Profile' component={Profile}/>
      <Drawer.Screen name="settings" component={Settings}/>
    </Drawer.Navigator>
  )
}

const HomePages = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBar={({navigation, state, descriptors, insets}) => (
        <BottomNavigation.Bar
          navigationState={state}
          safeAreaInsets={insets}
          onTabPress={({route, preventDefault}) => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (event.defaultPrevented) {
              preventDefault();
            } else {
              navigation.dispatch({
                ...CommonActions.navigate(route.name, route.params),
                target: state.key,
              });
            }
          }}
          renderIcon={({route, focused, color}) => {
            const {options} = descriptors[route.key];
            if (options.tabBarIcon) {
              return options.tabBarIcon({focused, color, size: 24});
            }

            return null;
          }}
          getLabelText={({route}) => {
            const {options} = descriptors[route.key];
            const label =
              options.tabBarLabel !== undefined
                ? options.tabBarLabel
                : options.title !== undefined
                ? options.title
                : route.title;

            return label;
          }}
        />
      )}>
      <Tab.Screen
        name="Home"
        component={DrawerPages}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({color, size}) => {
            return (
              <MaterialCommunityIcons name="home" size={size} color={color} />
            );
          },
        }}
      />
      <Tab.Screen
        name="Search"
        component={Settings}
        options={{
          tabBarLabel: 'Search  ',
          tabBarIcon: ({color, size}) => {
            return <MaterialIcons name="search" size={size} color={color} />;
          },
        }}
      />
      <Tab.Screen
        name="Pets"
        component={Pets}
        options={{
          tabBarLabel: 'Pets',
          tabBarIcon: ({color, size}) => {
            return <MaterialIcons name="pets" size={size} color={color} />;
          },
        }}
      />
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({color, size}) => {
            return (
              <MaterialCommunityIcons name="cog" size={size} color={color} />
            );
          },
        }}
      />
    </Tab.Navigator>
  );
};

const Stack = createNativeStackNavigator();

const HomeOnBoarding: React.FC<any> = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const firebaseUser = auth().currentUser;
  const dispatch = useDispatch();
  const [initialRouteName, setInitialRouteName] = useState('home');
  useEffect(() => {
    const getExistUser = async (user: FirebaseAuthTypes.User) => {
      try {
        setLoading(true);
        const existUser = await getUser(user.uid);
        dispatch(userActions.setUser(existUser));
        if (existUser.position < 2) {
          setInitialRouteName('onboarding');
        }
      } catch (error: any) {
        if (error.message === 'User does not exist') {
          dispatch(userActions.setUser({position: 0}));
          setInitialRouteName('onboarding');
          createEmptyUser(user.uid);
        }
      } finally {
        setLoading(false);
      }
    };

    if (!firebaseUser) {
      navigation.navigate('Login');
    } else {
      getExistUser(firebaseUser);
    }
  }, [firebaseUser]);
  return loading ? (
    <SafeAreaView className="flex items-center bg-white h-full w-full justify-center">
      <ActivityIndicator color="rgb(59 130 246)" size="large" />
    </SafeAreaView>
  ) : (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName={initialRouteName}>
      <Stack.Screen
        options={{headerShown: false}}
        component={OnBoarding}
        name="onboarding"
      />
      <Stack.Screen
        options={{headerShown: false}}
        component={HomePages}
        name="home"
      />
    </Stack.Navigator>
  );
};

const Router = () => {
  const user = auth().currentUser;
  // get user from firestore and store it in redux
  
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={user ? 'homeonboarding' : 'Login'}
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Signup"
          component={Signup}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="homeonboarding"
          component={HomeOnBoarding}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Router;
