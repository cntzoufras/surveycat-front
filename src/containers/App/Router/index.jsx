import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainWrapper from '../MainWrapper';
import NotFound404 from '../../DefaultPage/404/index';
import LogIn from '../../Account/LogIn/index';
import Register from '../../Account/Register/index';
import ResetPassword from '../../Account/ResetPassword/index';
import Survey from '../../Survey';
import WrappedRoutes from './WrappedRoutes';
import AuthCheck from '../AuthCheck';
import PrivateRoute from './PrivateRoute';
import PublicSurveyPage from '../../Survey/components/PublicSurveyPage';
import ThankYouSubmission from '../../Survey/components/ThankYouSubmission';

const Router = () => (
  <MainWrapper>
    <main>
      <Routes>
        <Route path="/" element={<LogIn />} />
        <Route path="/404" element={<NotFound404 />} />
        <Route path="/login" element={<LogIn />} />
        <Route exact path="/auth/register" element={<Register />} />
        <Route path="/reset_password" element={<ResetPassword />} />
        <Route path="/surveys/ps/:surveySlug" element={<PublicSurveyPage />} />
        <Route path="/thank-you" element={<ThankYouSubmission />} />
        <Route 
          exact 
          path="/survey" 
          element={(
            <AuthCheck>
              <PrivateRoute>
                <Survey />
              </PrivateRoute>
            </AuthCheck>
          )} 
        />
        <Route 
          path="/*" 
          element={(
            <AuthCheck>
              <PrivateRoute>
                <WrappedRoutes />
              </PrivateRoute>
            </AuthCheck>
          )} 
        />
      </Routes>
    </main>
  </MainWrapper>
);

export default Router;
