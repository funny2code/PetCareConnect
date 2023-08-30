import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {savePreference} from '../../../../services/user';
import {
  ActivityIndicator,
  Modal,
  Portal,
  RadioButton,
} from 'react-native-paper';
import {Image, ScrollView, Text, View} from 'react-native';
import auth from '@react-native-firebase/auth';
import {userActions} from '../../../../redux/store';

const PreferenceForm: React.FC<any> = ({
  handleChange,
  current,
  errors,
  values,
  handleSubmit,
  initialValues,
  navigation,
  change,
  setChange,
  setCurrent,
}) => {
  const user = auth().currentUser;
  const currentUser = useSelector((state: any) => state.user);
  const [error, setError] = useState();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
  
    if (change && current === 2) {
      handleSubmit();

      if (!user) {
        setChange(false);
        return navigation.navigate('Login');
      }
      if (errors?.preference) {
        setChange(false);
        return;
      }
      if (values.preference === '') {
        setChange(false);
        return;
      }
      if (initialValues.preference !== values.preference) {
        setLoading(true);
        savePreference(user.uid, values?.preference)
          .then(() => {
            dispatch(
              userActions.setUser({
                ...currentUser,
                preference: values.preference,
              }),
            );
            setChange(false);
            setCurrent(10);
            setTimeout(() => {
              // setCurrent(3);
              navigation.navigate('home');
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
          // setCurrent(3);
          navigation.navigate('home');
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
          What is your preference?
        </Text>
        <Text
          style={{
            fontSize: 16,
            textAlign: 'center',
            marginTop: 10,
          }}>
          Select your preference
        </Text>

        <RadioButton.Group
          onValueChange={handleChange('preference')}
          value={values.preference}
          className="flex flex-row justify-center mt-5">
          <View className="flex flex-row justify-center mt-5">
            <RadioButton.Item label="Dog" value="dog" />
            <RadioButton.Item label="Cat" value="cat" />
            <RadioButton.Item label="Both" value="both" />
          </View>
        </RadioButton.Group>

        {errors.preference && (
          <Text className="text-center text-red-500 w-60 mt-1">
            {errors.preference}
          </Text>
        )}
        <Image
          className="mt-5"
          style={{height: 400, width: 300}}
          source={require('../../../../assets/owner-sitter.jpeg')}
        />
      </View>
    </ScrollView>
  );
};

export default PreferenceForm;
