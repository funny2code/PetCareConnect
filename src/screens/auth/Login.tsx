import {SafeAreaView, Text, View, TextInput} from 'react-native';
import React, {useState} from 'react';
import {
  ActivityIndicator,
  Button,
  IconButton,
  Modal,
  Portal,
} from 'react-native-paper';
import Logo from '../../components/Logo';
import auth from '@react-native-firebase/auth';
import {Formik} from 'formik';
import {loginValidationSchema} from '../../../validations/validation';

const Login: React.FC<{navigation: any}> = ({navigation}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string>();
  return (
    <SafeAreaView className="bg-white items-center justify-center flex-1">
      <Portal>
        <Modal
          onDismiss={() => {
            setResponse(undefined);
            setLoading(false);
          }}
          visible={loading || response !== undefined}
          className="p-5">
          <View
            style={{minHeight: 150}}
            className="bg-white flex items-center justify-center rounded-md p-4">
            {!loading ? (
              <>
                {response !== 'created' ? (
                  <View>
                    <Text className="text-xl font-semibold text-red-500 text-center">
                      There was error while creating your account!
                    </Text>
                    <Text className="mt-2">{response}</Text>
                  </View>
                ) : (
                  <View>
                    <Text className="text-2xl text-blue-500 font-bold text-center">
                      Account Created
                    </Text>
                    <Text className="mt-2 text-base leading-5">
                      Your Account has been created now check your email address
                      and confirm your account.
                    </Text>
                  </View>
                )}
              </>
            ) : (
              <ActivityIndicator color="rgb(59 130 246)" size="large" />
            )}
          </View>
        </Modal>
      </Portal>
      <Logo />
      <Formik
        initialValues={{email: '', password: ''}}
        validationSchema={loginValidationSchema}
        onSubmit={async values => {
          try {
            setLoading(true);
            await auth().signInWithEmailAndPassword(
              values.email,
              values.password,
            );
            navigation.navigate('homeonboarding');
          } catch (error: any) {
            setResponse(error.message);
          } finally {
            setLoading(false);
          }
        }}>
        {({handleChange, handleBlur, handleSubmit, values, errors}) => (
          <>
            <TextInput
              placeholder="Email"
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
              keyboardType="email-address"
              className="border w-80 p-3 mt-6 rounded-lg"
            />
            {errors.email ? (
              <Text className="py-2 text-red-500 text-right w-80">
                {errors.email}
              </Text>
            ) : (
              <View className="mt-6"></View>
            )}
            <View className="relative">
              <TextInput
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                value={values.password}
                placeholder="Password"
                keyboardType="default"
                secureTextEntry={!showPassword}
                className="border w-80 p-3  rounded-lg"
              />
              <IconButton
                icon={showPassword ? 'eye-off' : 'eye'}
                onPress={() => {
                  setShowPassword(!showPassword);
                }}
                className="absolute right-0 top-1"
              />
              {errors.password ? (
                <Text className="py-2 text-red-500 text-right w-80">
                  {errors.password}
                </Text>
              ) : (
                <View className="mt-2"></View>
              )}
            </View>
            <Text className="  text-blue-500 text-right w-80">
              Forgot Password?
            </Text>
            <Button
              onPress={handleSubmit}
              mode="contained"
              className="w-80 mt-7 bg-blue-500">
              <Text className="text-white">Login</Text>
            </Button>
          </>
        )}
      </Formik>
      <Text className="mt-4 text-blue-500">
        Don't have an account?{' '}
        <Text
          onPress={() => {
            navigation.navigate('Signup');
          }}
          className="font-bold">
          Signup
        </Text>
      </Text>
    </SafeAreaView>
  );
};

export default Login;
