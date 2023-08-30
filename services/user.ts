import firestore from '@react-native-firebase/firestore';
import {User} from '../types/user';

const usersCollection = firestore().collection('users');

export const getUser = (userId: string) => {
  return new Promise<User>((resolve, reject) => {
    usersCollection
      .doc(userId)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          resolve(documentSnapshot.data() as User);
        } else {
          reject({message: 'User does not exist'});
        }
      })
      .catch(error => {
        reject(error);
      });
  });
};

export const createEmptyUser = (userId: string) => {
  return new Promise((resolve, reject) => {
    usersCollection
      .doc(userId)
      .set({
        position: 0,
      })
      .then(() => {
        resolve('User created');
      })
      .catch(error => {
        reject(error);
      });
  });
};

export const checkIfusernameExists = (username: string, userId: string) => {
  return new Promise<boolean>((resolve, reject) => {
    // check if username exists
    // but also check if the username is the same as the current user
    usersCollection
      .where('username', '==', username)
      .get()
      .then(querySnapshot => {
        if (querySnapshot.size > 0) {
          querySnapshot.forEach(documentSnapshot => {
            if (documentSnapshot.id !== userId) {
              resolve(true);
            }
          });
        }
        resolve(false);
      })
      .catch(error => {
        reject(error);
      });
  });
};

export const saveUsername = (userId: string, username: string) => {
  return new Promise(async (resolve, reject) => {
    // check if username exists

    const usernameExists = await checkIfusernameExists(username, userId);
    if (usernameExists) {
      reject({message: 'Username already exists'});
      return;
    }
    // save user
    usersCollection
      .doc(userId)
      .update({
        username,
        position: 1,
      })
      .then(() => {
        resolve('Username saved');
      })
      .catch(error => {
        reject(error);
      });
  });
};

export const saveRole = (userId: string, role: 'petOwner' | 'petSitter') => {
  return new Promise(async (resolve, reject) => {
    usersCollection
      .doc(userId)
      .update({
        role,
        position: 2,
      })
      .then(() => {
        resolve('Role saved');
      })
      .catch(error => {
        reject(error);
      });
  });
};

export const savePreference = (
  userId: string,
  preference: 'dogWalking' | 'catSitting' | 'both',
) => {
  return new Promise(async (resolve, reject) => {
    usersCollection
      .doc(userId)
      .update({
        preference,
        position: 3,
      })
      .then(() => {
        resolve('Role saved');
      })
      .catch(error => {
        reject(error);
      });
  });
};
