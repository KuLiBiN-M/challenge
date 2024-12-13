"use client";

import { Provider } from 'react-redux';
import { store } from './store/store';
import Board from './board'

export default function Container() {
  return (
    <Provider store={store}>
        <Board />
    </Provider>
  );
}
