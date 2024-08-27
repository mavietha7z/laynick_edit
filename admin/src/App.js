import { useSelector } from 'react-redux';
import { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css';
import { privateRoutes } from './routes';
import Overlay from './components/Overlay';
import Loading from './components/Loading';
import DefaultLayout from './layouts/DefaultLayout';

function App() {
    const { sidebar, loading } = useSelector((state) => state.module);

    useEffect(() => {
        if (loading) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [loading]);

    return (
        <div className="App">
            {sidebar && <Overlay />}
            {loading && <Loading />}

            <Router>
                <Routes>
                    {privateRoutes.map((route, index) => {
                        let Layout = DefaultLayout;

                        if (route.layout) {
                            Layout = route.layout;
                        } else if (route.layout === null) {
                            Layout = Fragment;
                        }

                        const Page = route.component;
                        return (
                            <Route
                                key={index}
                                path={route.path}
                                element={
                                    <Layout>
                                        <Page />
                                    </Layout>
                                }
                            />
                        );
                    })}
                </Routes>
            </Router>
        </div>
    );
}

export default App;
