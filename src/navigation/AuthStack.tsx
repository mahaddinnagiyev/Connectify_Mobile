import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Screens
import AuthScreen from "@screens/auth/AuthScreen";
import ConfirmAccountScreen from "@screens/auth/ConfirmAccountScreen";
import ForgotPassword from "@screens/auth/ForgotPassword";
import TermsAndConditionsScreen from "@screens/terms/TermsAndConditionsScreen";

const Stack = createNativeStackNavigator<StackParamList>();

export type StackParamList = {
  Auth: undefined;
  ConfirmAccount: undefined;
  ForgotPassword: undefined;
  TermsAndConditions: undefined;
};

export default function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="Auth"
    >
      <Stack.Screen name="Auth" component={AuthScreen} />
      <Stack.Screen name="ConfirmAccount" component={ConfirmAccountScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen
        name="TermsAndConditions"
        component={TermsAndConditionsScreen}
      />
    </Stack.Navigator>
  );
}
