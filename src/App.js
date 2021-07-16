import React, { useEffect, useState } from 'react';
import { YellowBox, StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import { Appearance, AppearanceProvider } from 'react-native-appearance';
import { MenuProvider } from 'react-native-popup-menu';
import configureStore from './redux/store';
import AppContainer from './screens/AppContainer';
import { enableScreens } from 'react-native-screens';
import { AppCallWrapper } from './Core/chat/audioVideo';

const MainNavigator = AppCallWrapper(AppContainer);

const store = configureStore();

const App = (props) => {
  const [colorScheme, setColorScheme] = useState(Appearance.getColorScheme());
  enableScreens();

  useEffect(() => {
    YellowBox.ignoreWarnings(['Remote Debugger']);
    console.disableYellowBox = true;

    Appearance.addChangeListener(({ colorScheme }) => {
      setColorScheme(colorScheme);
    });
  }, []);

  return (
    <Provider store={store}>
      <AppearanceProvider>
        <MenuProvider>
          <StatusBar />
          <MainNavigator screenProps={{ theme: colorScheme }} />
        </MenuProvider>
      </AppearanceProvider>
    </Provider>
  );
};

export default App;
