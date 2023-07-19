import createWsMiddleware from './wire/WsMiddleware'
import createWireMiddleware from './wire/WireMiddleware'
import createControlMiddleware from './wire/ControlMiddleware'
import makeRootReducer from './reducers/rootReducer'
import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import rootSaga from './sagas'


const initialState = {}
export const store = configureStore(initialState)

function configureStore(initialState) {
  console.log(' [configureStore] called');
  const sagaMiddleware = createSagaMiddleware()
  const store = createStore(
    makeRootReducer(),
    initialState,
    applyMiddleware(createWsMiddleware(), createWireMiddleware(), createControlMiddleware(), sagaMiddleware)
  )
  let sagaTask = sagaMiddleware.run(function* () {
    yield rootSaga()
  })

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers    
    module.hot.accept(() => {
      store.replaceReducer(makeRootReducer())
    })
    module.hot.accept(() => {
      const sagas = require('./sagas');
      sagaTask.cancel()
      sagaTask.toPromise().then(() => {
        sagaTask = sagaMiddleware.run(function* replacedSaga(action) {
          yield sagas.default()
        })
      })
    })
  }

  return store
}