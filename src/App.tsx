import {Provider} from 'react-redux';
import {PaperProvider} from 'react-native-paper';
import Router from './router';
import store from '../redux/store';

function App(): JSX.Element {
  return (
    <Provider store={store}>
      <PaperProvider>
        <Router />
      </PaperProvider>
    </Provider>
  );
}

export default App;
