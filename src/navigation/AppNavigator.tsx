import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { Text, View, StyleSheet, ActivityIndicator } from 'react-native';
import { DashboardScreen } from '../screens/DashboardScreen';
import { FriendsScreen } from '../screens/FriendsScreen.tsx';
import { MyScreen } from '../screens/MyScreen';
import { useColors } from '../hooks/useColors';
import { typography } from '../styles/typography';
import { ReflectionScreen } from '../screens/ReflectionScreen.tsx';
import { ReflectionDetailScreen } from '../screens/ReflectionDetailScreen.tsx';
import { ReflectionFormScreen } from '../screens/ReflectionFormScreen.tsx';
import { PraiseDetailScreen } from '../screens/PraiseDetailScreen.tsx';
import { PraiseFormScreen } from '../screens/PraiseFormScreen.tsx';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../context/ThemeContext';
import { InviteFriendScreen } from '../screens/InviteFriendScreen.tsx';
import { PraiseScreen } from '../screens/PraiseScreen.tsx';
import { EditProfileScreen } from '../screens/EditProfileScreen.tsx';
import { NoticeScreen } from '../screens/NoticeScreen.tsx';
import { LoginScreen } from '../screens/LoginScreen.tsx';
import { SignUpScreen } from '../screens/SignUpScreen.tsx';
import { useAuth } from '../context/AuthContext.tsx';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Auth Stack Navigator
const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
    </Stack.Navigator>
  );
};


// Dashboard Stack Navigator
const DashboardStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DashboardMain" component={DashboardScreen} />
      <Stack.Screen name="ReflectionDetail" component={ReflectionDetailScreen} />
      <Stack.Screen name="ReflectionForm" component={ReflectionFormScreen} />
      <Stack.Screen name="PraiseDetail" component={PraiseDetailScreen} />
      <Stack.Screen name="PraiseForm" component={PraiseFormScreen} />
      <Stack.Screen name="Friends" component={FriendsScreen} />
      <Stack.Screen name="InviteFriend" component={InviteFriendScreen} />
    </Stack.Navigator>
  );
};

// Reflection Stack Navigator
const ReflectionStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ReflectionMain" component={ReflectionScreen} />
      <Stack.Screen name="ReflectionDetail" component={ReflectionDetailScreen} />
      <Stack.Screen name="ReflectionForm" component={ReflectionFormScreen} />
    </Stack.Navigator>
  );
};

const PraiseStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PraiseMain" component={PraiseScreen} />
      <Stack.Screen name="PraiseDetail" component={PraiseDetailScreen} />
      <Stack.Screen name="PraiseForm" component={PraiseFormScreen} />
    </Stack.Navigator>
  );
};

const MyStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MyMain" component={MyScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="Notice" component={NoticeScreen} />
    </Stack.Navigator>
  );
};


const MainTabNavigator = () => {
  const colors = useColors();
  const { theme } = useTheme();

  const TabIcon = ({ name, focused }: { name: string; focused: boolean }) => {
    const themeColor = theme === 'light' ? '#000' : '#fff';

    const getIcon = () => {
      switch (name) {
        case 'Feed': return <Ionicons name="planet-outline" size={20} color={themeColor} style={{ margin: 10 }} />;
        case 'Reflection': return <Ionicons name="document-outline" size={20} color={themeColor} style={{ margin: 10 }} />;
        case 'Praise': return <Ionicons name="gift-outline" size={20} color={themeColor} style={{ margin: 10 }} />;
        case 'Friends': return <Ionicons name="people-outline" size={20} color={themeColor} style={{ margin: 10 }} />;
        case 'My': return <Ionicons name="person-outline" size={20} color={themeColor} style={{ margin: 10 }} />;
        default: return <Ionicons name="planet-outline" size={20} color={themeColor} style={{ margin: 10 }} />;
      }
    };

    return (
      <View style={styles.tabIconContainer}>
        <Text style={[styles.tabIcon, { opacity: focused ? 1 : 0.6 }]}>
          {getIcon()}
        </Text>
      </View>
    );
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.background.tabBar,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          paddingBottom: 8,
          paddingTop: 8,
          height: 80,
        },
        tabBarIcon: ({ focused }) => (
          <TabIcon name={route.name} focused={focused} />
        ),
        tabBarLabel: ({ focused }) => (
          <Text style={[
            styles.tabLabel,
            {
              color: focused ? colors.text.primary : colors.text.secondary,
              fontWeight: focused ? typography.weights.semibold : typography.weights.regular
            }
          ]}>
            {route.name}
          </Text>
        ),
        tabBarActiveTintColor: colors.text.primary,
        tabBarInactiveTintColor: colors.text.secondary,
      })}
    >
      <Tab.Screen
        name="Feed"
        component={DashboardStack}
        options={{ tabBarLabel: '피드' }}
      />
      <Tab.Screen
        name="Reflection"
        component={ReflectionStack}
        options={{ tabBarLabel: '반성문' }}
      />
      <Tab.Screen
        name="Praise"
        component={PraiseStack}
        options={{ tabBarLabel: '칭찬' }}
      />
      <Tab.Screen
        name="Friends"
        component={FriendsScreen}
        options={{ tabBarLabel: '친구' }}
      />
      <Tab.Screen
        name="My"
        component={MyStack}
        options={{ tabBarLabel: 'My' }}
      />
    </Tab.Navigator>
  );
};

// Loading Screen
const LoadingScreen = () => {
  const colors = useColors();
  return (
    <View style={[styles.loadingContainer, { backgroundColor: colors.background.primary }]}>
      <ActivityIndicator size="large" color={colors.primary.coral} />
      <Text style={[styles.loadingText, { color: colors.text.primary }]}>
        로딩 중...
      </Text>
    </View>
  );
};

export const AppNavigator: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <NavigationContainer>
      {isLoading ? (
        <LoadingScreen />
      ) : isAuthenticated ? (
        <MainTabNavigator />
      ) : (
        <AuthStack />
      )}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIcon: {
    fontSize: 24,
  },
  tabLabel: {
    fontSize: typography.sizes.xs,
    marginTop: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: typography.sizes.md,
    fontFamily: typography.fontFamily.regular,
  },
});
