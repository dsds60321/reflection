import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Text, View, StyleSheet } from 'react-native';
import { DashboardScreen } from '../screens/DashboardScreen';
import { NotificationScreen } from '../screens/NotificationScreen';
import { MyScreen } from '../screens/MyScreen';
import { useColors } from '../hooks/useColors';
import { typography } from '../styles/typography';
import { ReflectionScreen } from '../screens/ReflectionScreen.tsx';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../context/ThemeContext';

const Tab = createBottomTabNavigator();

const TabIcon = ({ name, focused }: { name: string; focused: boolean }) => {
  const { theme } = useTheme();
  const themeColor = theme === 'light' ? '#000' : '#fff';

  const getIcon = () => {
    switch (name) {
      case 'Feed': return <Ionicons name="planet-outline" size={20} color={themeColor} style={{ margin: 10 }} />;
      case 'Reflection': return <Ionicons name="document-outline" size={20} color={themeColor} style={{ margin: 10 }} />;
      case 'Notification': return <Ionicons name="notifications-outline" size={20} color={themeColor} style={{ margin: 10 }} />;
      case 'My': return <Ionicons name="person-outline" size={20} color={themeColor} style={{ margin: 10 }} />;;
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

export const AppNavigator: React.FC = () => {
  const colors = useColors();

  return (
    <NavigationContainer>
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
          component={DashboardScreen}
          options={{ tabBarLabel: '피드' }}
        />
        <Tab.Screen
          name="Reflection"
          component={ReflectionScreen}
          options={{ tabBarLabel: '반성문' }}
        />
        <Tab.Screen
          name="Notification"
          component={NotificationScreen}
          options={{ tabBarLabel: '알림' }}
        />
        <Tab.Screen
          name="My"
          component={MyScreen}
          options={{ tabBarLabel: 'My' }}
        />
      </Tab.Navigator>
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
});