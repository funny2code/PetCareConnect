import {SafeAreaView, Text, TextInput, View} from 'react-native';
import {useState} from 'react';
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
import {signupValidationSchema} from '../../../validations/validation';

const Signup: React.FC<{navigation: any}> = ({navigation}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string>();
  const [showModal, setShowModal] = useState(false);
  return (
    <SafeAreaView className="bg-white items-center justify-center flex-1">
      <Portal>
        <Modal
          onDismiss={() => {
            setShowModal(false);
          }}
          visible={showModal}
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
        initialValues={{
          email: '',
          fullname: '',
          password: '',
          confirmPassword: '',
        }}
        validationSchema={signupValidationSchema}
        onSubmit={async values => {
          try {
            setShowModal(true);
            // create user who must displayName set to fullname
            setLoading(true);
            const {user} = await auth().createUserWithEmailAndPassword(
              values.email,
              values.password,
            );
            await user.updateProfile({
              displayName: values.fullname,
            });
            // SEND EMAIL VERIFICATION
            await user.sendEmailVerification();
            setResponse('created');
            if (!showModal) {
              setShowModal(true);
            }
          } catch (error: any) {
            if (!showModal) {
              setShowModal(true);
            }
            setResponse(error.message as string);
          } finally {
            setLoading(false);
          }
        }}>
        {({handleChange, handleBlur, handleSubmit, values, errors}) => (
          <>
            <TextInput
              onChangeText={handleChange('fullname')}
              onBlur={handleBlur('fullname')}
              value={values.fullname}
              placeholder="Fullname"
              keyboardType="default"
              className="border w-80 mt-6 p-3 rounded-lg"
            />
            {errors.fullname ? (
              <Text className="py-2 text-red-500 text-right w-80">
                {errors.fullname}
              </Text>
            ) : (
              <View className="mt-6"></View>
            )}

            <TextInput
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
              placeholder="Email"
              keyboardType="email-address"
              className="border w-80 p-3  rounded-lg"
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
                placeholder="Password"
                keyboardType="default"
                value={values.password}
                secureTextEntry={!showPassword}
                className="border w-80 p-3 rounded-lg"
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
                <View className="mt-6"></View>
              )}
            </View>
            <View className="relative">
              <TextInput
                placeholder="Confirm Password"
                keyboardType="default"
                value={values.confirmPassword}
                onChangeText={handleChange('confirmPassword')}
                onBlur={handleBlur('confirmPassword')}
                secureTextEntry={!showConfirmPassword}
                className="border w-80 p-3 rounded-lg"
              />
              <IconButton
                icon={showConfirmPassword ? 'eye-off' : 'eye'}
                onPress={() => {
                  setShowConfirmPassword(!showConfirmPassword);
                }}
                className="absolute right-0 top-1"
              />
              {errors.confirmPassword ? (
                <Text className="py-2 text-red-500 text-right w-80">
                  {errors.confirmPassword}
                </Text>
              ) : (
                <View className="mt-6"></View>
              )}
            </View>

            <Button
              onPress={handleSubmit}
              mode="contained"
              className="w-80 mt-1 bg-blue-500">
              <Text className="text-white">Signup</Text>
            </Button>
          </>
        )}
      </Formik>
      <Text className="mt-4 text-blue-500">
        Already have an account?{' '}
        <Text
          onPress={() => {
            navigation.navigate('Login');
          }}
          className="font-bold">
          Login
        </Text>
      </Text>
    </SafeAreaView>
  );
};

export default Signup;
