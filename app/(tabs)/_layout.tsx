// app/(tabs)/_layout.tsx - VERSIÓN LIMPIA Y CORREGIDA

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/hook/useColorScheme';
import { MaterialIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import TeacherFloatingMenu from '../../components/TeacherFloatingMenu';
import { useAuth } from '../../src/contexts/AuthContext';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { user, isDocente, isRepresentante, isNino } = useAuth();

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: Platform.select({
            ios: {
              position: 'absolute',
            },
            default: {},
          }),
        }}>
        
        {/* =================== TABS PARA DOCENTES =================== */}
        {isDocente && (
          <>
            {/* Dashboard Docente */}
            <Tabs.Screen
              name="teacher-dashboard"
              options={{
                title: 'Dashboard',
                tabBarIcon: ({ color }) => <MaterialIcons name="analytics" size={28} color={color} />,
              }}
            />

            {/* Mis Aulas */}
            <Tabs.Screen
              name="classroom-management"
              options={{
                title: 'Mis Aulas',
                tabBarIcon: ({ color }) => <MaterialIcons name="school" size={28} color={color} />,
              }}
            />

            {/* Juego Ortografía */}
            <Tabs.Screen
              name="JuegoDeOrtografia"
              options={{
                title: 'Ortografía',
                tabBarIcon: ({ color }) => <MaterialIcons name="edit" size={28} color={color} />,
              }}
            />

            {/* Juego Titanic */}
            <Tabs.Screen
              name="titanic"
              options={{
                title: 'Titanic',
                tabBarIcon: ({ color }) => <MaterialIcons name="directions-boat" size={28} color={color} />,
              }}
            />

            {/* Juego Explorar */}
            <Tabs.Screen
              name="explore"
              options={{
                title: 'Explorar',
                tabBarIcon: ({ color }) => <MaterialIcons name="explore" size={28} color={color} />,
              }}
            />
          </>
        )}

        {/* =================== TABS PARA REPRESENTANTES =================== */}
        {isRepresentante && (
          <>
            {/* Dashboard Representante */}
            <Tabs.Screen
              name="parent-dashboard"
              options={{
                title: 'Mi Panel',
                tabBarIcon: ({ color }) => <MaterialIcons name="family-restroom" size={28} color={color} />,
              }}
            />

            {/* Juegos para jugar con sus hijos */}
            <Tabs.Screen
              name="JuegoDeOrtografia"
              options={{
                title: 'Ortografía',
                tabBarIcon: ({ color }) => <MaterialIcons name="edit" size={28} color={color} />,
              }}
            />
            
            <Tabs.Screen
              name="titanic"
              options={{
                title: 'Titanic',
                tabBarIcon: ({ color }) => <MaterialIcons name="directions-boat" size={28} color={color} />,
              }}
            />
            
            <Tabs.Screen
              name="explore"
              options={{
                title: 'Explorar',
                tabBarIcon: ({ color }) => <MaterialIcons name="explore" size={28} color={color} />,
              }}
            />
          </>
        )}

        {/* =================== TABS PARA NIÑOS =================== */}
        {isNino && (
          <>
            {/* Home/Juegos */}
            <Tabs.Screen
              name="index"
              options={{
                title: 'Juegos',
                tabBarIcon: ({ color }) => <MaterialIcons name="games" size={28} color={color} />,
              }}
            />

            {/* Juegos individuales */}
            <Tabs.Screen
              name="JuegoDeOrtografia"
              options={{
                title: 'Ortografía',
                tabBarIcon: ({ color }) => <MaterialIcons name="edit" size={28} color={color} />,
              }}
            />
            
            <Tabs.Screen
              name="titanic"
              options={{
                title: 'Titanic',
                tabBarIcon: ({ color }) => <MaterialIcons name="directions-boat" size={28} color={color} />,
              }}
            />
            
            <Tabs.Screen
              name="explore"
              options={{
                title: 'Explorar',
                tabBarIcon: ({ color }) => <MaterialIcons name="explore" size={28} color={color} />,
              }}
            />
          </>
        )}

        {/* =================== OCULTAR PANTALLAS DE OTROS ROLES =================== */}
        
        {/* Ocultar dashboards de otros roles */}
        {!isDocente && (
          <Tabs.Screen
            name="teacher-dashboard"
            options={{ href: null }}
          />
        )}

        {!isRepresentante && (
          <Tabs.Screen
            name="parent-dashboard"
            options={{ href: null }}
          />
        )}

        {!isNino && (
          <Tabs.Screen
            name="index"
            options={{ href: null }}
          />
        )}

        {/* Ocultar classroom management para no-docentes */}
        {!isDocente && (
          <Tabs.Screen
            name="classroom-management"
            options={{ href: null }}
          />
        )}

        {/* =================== PANTALLAS OCULTAS DEL TAB BAR (navegables por otras vías) =================== */}
        
        <Tabs.Screen
          name="teacher-reports"
          options={{ href: null }}
        />
        
        <Tabs.Screen
          name="titanic-admin"
          options={{ href: null }}
        />

        <Tabs.Screen
          name="student-classroom-selection"
          options={{ href: null }}
        />

        <Tabs.Screen
          name="classroom-progress"
          options={{ href: null }}
        />

        <Tabs.Screen
          name="child-progress"
          options={{ href: null }}
        />

        <Tabs.Screen
          name="student-parents-management"
          options={{ href: null }}
        />

        <Tabs.Screen
          name="parent-link-child"
          options={{ href: null }}
        />
      </Tabs>

      {/* FLOATING ACTION BUTTON SOLO PARA DOCENTES */}
      {isDocente && <TeacherFloatingMenu />}
    </>
  );
}