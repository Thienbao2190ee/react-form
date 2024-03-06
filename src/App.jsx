import Home from './page/Home';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/layout';
import CreateForm from './page/creacte-form';
import './App.css';
import TakeATest from './page/take-a-test';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import CheckTheAns from './page/check-the-answer';

function App() {
  return (
    <Provider store={store}>
      <Layout>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create-form" element={<CreateForm />} />
            <Route path="/take-a-test/:id" element={<TakeATest />} />
            <Route path="/check-the-answer/:id" element={<CheckTheAns />} />
          </Routes>
        </BrowserRouter>
      </Layout>
    </Provider>
  );
}

export default App;
