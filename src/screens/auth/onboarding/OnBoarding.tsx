import {
  View,
  SafeAreaView,
  KeyboardAvoidingView,
  KeyboardAvoidingViewComponent,
} from 'react-native';
import React, {useEffect, useState} from 'react';

import {Formik} from 'formik';
import {
  preferenceValidation,
  roleValidation,
  usernameValidationSchema,
} from '../../../../validations/validation';
import {
  ActivityIndicator,
  Button,
  Modal,
  Portal,
  RadioButton,
  Text,
  TextInput,
} from 'react-native-paper';
import {saveRole, saveUsername} from '../../../../services/user';
import auth from '@react-native-firebase/auth';
import {useDispatch, useSelector} from 'react-redux';
import {userActions} from '../../../../redux/store';
import {User} from '../../../../types/user';
import UserRoleForm from './UserRoleForm';
import UsernameForm from './UsernameForm';
import PreferenceForm from './PreferenceForm';
import DateTimeForm from './DateTimeForm';

const Pagination: React.FC<{size: number; current: number}> = ({
  size,
  current,
}) => {
  // return dots depending on the size and filled depending on the current
  return (
    <View className="flex-row justify-center mt-5 items-center">
      {Array(size)
        .fill(0)
        .map((_, i) => (
          <View
            key={i}
            style={{
              width: 9,
              height: 9,
              borderRadius: 4,
              marginHorizontal: 4,
              backgroundColor: current === i ? '#525151' : '#fff',
            }}
          />
        ))}
    </View>
  );
};

const OnBoarding: React.FC<any> = ({navigation}) => {
  const user: User = useSelector((state: any) => state.user);
  const [change, setChange] = useState(false);
  const [current, setCurrent] = useState<number>();
  useEffect(() => {
    if (user) {
      setCurrent(user.position);
    }
  }, [user]);

  return (
    <SafeAreaView>
      <View className="flex flex-col h-full justify-center">
        <View className="flex-row h-[80%] items-center ">
          {current === 0 ? (
            <Formik
              initialValues={{username: user.username ?? ''}}
              onSubmit={values => {}}
              validationSchema={usernameValidationSchema}>
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                initialValues,
              }) => {
                return (
                  <UsernameForm
                    navigation={navigation}
                    initialValues={initialValues}
                    handleSubmit={handleSubmit}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    errors={errors}
                    values={values}
                    change={change}
                    current={current}
                    setChange={setChange}
                    setCurrent={setCurrent}
                  />
                );
              }}
            </Formik>
          ) : current === 1 ? (
            <Formik
              initialValues={{role: user.role ?? ''}}
              onSubmit={values => {}}
              validationSchema={roleValidation}>
              {({
                handleChange,
                handleSubmit,
                values,
                errors,
                initialValues,
              }) => {
                return (
                  <UserRoleForm
                    navigation={navigation}
                    initialValues={initialValues}
                    handleSubmit={handleSubmit}
                    handleChange={handleChange}
                    errors={errors}
                    values={values}
                    change={change}
                    current={current}
                    setChange={setChange}
                    setCurrent={setCurrent}
                  />
                );
              }}
            </Formik>
          ) : current === 2 ? (
            <Formik
              initialValues={{preference: user.preference ?? ''}}
              onSubmit={values => {}}
              validationSchema={preferenceValidation}>
              {({
                handleChange,
                handleSubmit,
                values,
                errors,
                initialValues,
              }) => {
                return (
                  <PreferenceForm
                    navigation={navigation}
                    initialValues={initialValues}
                    handleSubmit={handleSubmit}
                    handleChange={handleChange}
                    errors={errors}
                    values={values}
                    change={change}
                    current={current}
                    setChange={setChange}
                    setCurrent={setCurrent}
                  />
                );
              }}
            </Formik>
          ) : (
            //  current === 3 ? (
            //   <Formik
            //     // key={i}
            //     initialValues={{preference: user.preference ?? ''}}
            //     onSubmit={values => {}}
            //     validationSchema={preferenceValidation}>
            //     {({
            //       handleChange,
            //       handleSubmit,
            //       values,
            //       errors,
            //       initialValues,
            //     }) => {
            //       return (
            //         <DateTimeForm
            //           navigation={navigation}
            //           initialValues={initialValues}
            //           handleSubmit={handleSubmit}
            //           handleChange={handleChange}
            //           errors={errors}
            //           values={values}
            //           change={change}
            //           current={current}
            //           setChange={setChange}
            //           setCurrent={setCurrent}
            //         />
            //       );
            //     }}
            //   </Formik>
            // ) :
            <View className="flex items-center w-full justify-center">
              <ActivityIndicator size="large" color="rgb(59 130 246)" />
            </View>
          )}
        </View>
        <Pagination size={3} current={current} />

        <View
          className={`flex-row ${
            current === 0 ? 'justify-end' : 'justify-between'
          } mx-3 mt-4`}>
          {current !== 0 && (
            <Button
              onPress={() => {
                setChange(false);
                setCurrent(10);
                setTimeout(() => {
                  setCurrent(current - 1);
                }, 1);
              }}
              className="bg-gray-500 ">
              <Text className="text-white">Prev</Text>
            </Button>
          )}
          <Button
            onPress={() => {
              setChange(true);
            }}
            className="bg-blue-500">
            <Text className="text-white">Next</Text>
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default OnBoarding;
