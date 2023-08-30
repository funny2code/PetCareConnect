import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {saveRole} from '../../../../services/user';
import {
  ActivityIndicator,
  Modal,
  Portal,
  RadioButton,
} from 'react-native-paper';
import {Image, Text, View} from 'react-native';
import auth from '@react-native-firebase/auth';
import {userActions} from '../../../../redux/store';

const UserRoleForm: React.FC<any> = ({
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
    if (change && current === 1) {
      handleSubmit();
      if (!user) {
        setChange(false);
        return navigation.navigate('Login');
      }
      if (errors?.role) {
        setChange(false);
        return;
      }
      if (values.role === '') {
        setChange(false);
        return;
      }
      if (initialValues.role !== values.role) {
        setLoading(true);
        saveRole(user.uid, values?.role)
          .then(() => {
            dispatch(
              userActions.setUser({
                ...currentUser,
                role: values.role,
              }),
            );
            setChange(false);
            setCurrent(10);
            setTimeout(() => {
              setCurrent(2);
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
          setCurrent(2);
        }, 1);
      }
    }
  }, [change]);

  return (
    <View className="h-full justify-center w-full items-center">
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
        Who are you?
      </Text>
      <Text
        style={{
          fontSize: 16,
          textAlign: 'center',
          marginTop: 10,
        }}>
        Are you a pet sitter or pet owner?
      </Text>

      <RadioButton.Group
        onValueChange={handleChange('role')}
        value={values.role}
        className="flex flex-row justify-center mt-5">
        <View className="flex flex-row justify-center mt-5">
          <RadioButton.Item label="Pet Owner" value="petOwner" />
          <RadioButton.Item label="Pet Sitter" value="petSitter" />
        </View>
      </RadioButton.Group>
      {errors.role && (
        <Text className="text-right text-red-500 w-60 mt-1">{errors.role}</Text>
      )}
      <Image
        className="mt-5"
        style={{height: 400, width: 300}}
        source={require('../../../../assets/sitter.webp')}
      />
    </View>
  );
};

export default UserRoleForm;
