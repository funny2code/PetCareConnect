import {useEffect, useState} from 'react';
import {Image, ScrollView, Text, View} from 'react-native';
import {ActivityIndicator, Modal, Portal, TextInput} from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import {useDispatch, useSelector} from 'react-redux';
import {saveUsername} from '../../../../services/user';
import {userActions} from '../../../../redux/store';

const FirstFormikForm: React.FC<any> = ({
  handleChange,
  handleBlur,
  errors,
  values,
  handleSubmit,
  initialValues,
  navigation,
  change,
  current,
  setChange,
  setCurrent,
}) => {
  const user = auth().currentUser;
  const currentUser = useSelector((state: any) => state.user);
  const [error, setError] = useState();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (change && current === 0) {
      handleSubmit();
      if (!user) {
        setChange(false);
        return navigation.navigate('Login');
      }
      if (errors?.username) {
        setChange(false);
        return;
      }
      if (values.username === '') {
        setChange(false);
        return;
      }

      if (initialValues.username !== values.username) {
        setLoading(true);
        saveUsername(user.uid, values?.username)
          .then(() => {
            dispatch(
              userActions.setUser({
                ...currentUser,
                username: values.username,
              }),
            );
            setChange(false);
            setCurrent(10);
            setTimeout(() => {
              setCurrent(1);
            }, 1);
          })
          .catch(error => {
            setError(error.message);
          })
          .finally(() => {
            setLoading(false);
          });
      } else {
        setChange(false);
        setCurrent(10);
        setTimeout(() => {
          setCurrent(1);
        }, 1);
      }
    }
  }, [change]);

  return (
    <ScrollView automaticallyAdjustKeyboardInsets className="min-w-full">
      <View className="justify-center items-center">
        <Portal>
          <Modal
            onDismiss={() => {
              setError(undefined);
              setLoading(false);
            }}
            visible={error !== undefined || loading}
            className="p-5">
            <View
              style={{minHeight: 150}}
              className="bg-white flex items-center justify-center rounded-md p-4">
              {!loading ? (
                <View>
                  <Text className="text-xl font-semibold text-red-500 text-center">
                    There was error while setting your username!
                  </Text>
                  <Text className="mt-2">{error}</Text>
                </View>
              ) : (
                <ActivityIndicator color="rgb(59 130 246)" size="large" />
              )}
            </View>
          </Modal>
        </Portal>
        <Text
          style={{
            fontSize: 24,
            fontWeight: 'bold',
            textAlign: 'center',
            marginTop: 20,
          }}>
          What is your username?
        </Text>
        <Text
          style={{
            fontSize: 16,
            textAlign: 'center',
            marginTop: 10,
          }}>
          You can change this later
        </Text>

        <TextInput
          mode="outlined"
          label="Username"
          onChangeText={handleChange('username')}
          onBlur={handleBlur('username')}
          value={values.username}
          keyboardType="default"
          className="w-80 rounded-lg mt-5"
        />
        {errors.username && (
          <Text className="text-right text-red-500 w-80 mt-1">
            {errors.username}
          </Text>
        )}
        <Image source={require('../../../../assets/pet.png')} />
      </View>
    </ScrollView>
  );
};

export default FirstFormikForm;
