import React, { useState } from 'react';
import PropTypes from 'prop-types';
import LogInForm from '@/shared/components/account/loginForm/LogInForm';
// import { handleLogin, handleAuthError } from '@/redux/actions/authActions';


import {
  AccountCard,
  AccountContent,
  AccountHead,
  AccountLogo,
  AccountLogoAccent,
  AccountOr,
  AccountTitle,
  AccountWrap,
} from '@/shared/components/account/AccountElements';

const LogIn = ({
  changeIsOpenModalFireBase,
  login,
  handleError,
  error,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleLogin = async (event) => {
    event.preventDefault();
  };
  
  const onSubmit = () => {
    // const user = fakeUsers.find(item => item.email === email && item.password === password);
    // if (user) {
    //   login({ ...user, token: getFakeToken(user.email) });
    // } else {
    //   handleError('Username or password is incorrect.');
    // }
  };

  return (
    <AccountWrap>
      <AccountContent>
        <AccountCard>
          <AccountHead>
            <AccountTitle>Welcome to
              <AccountLogo> Survey
                <AccountLogoAccent>CAT</AccountLogoAccent>
              </AccountLogo>
            </AccountTitle>
            <h4 className="subhead">Start your business easily</h4>
          </AccountHead>
          <LogInForm 
            onSubmit={onSubmit} 
            error={error} 
            email={email} 
            password={password} 
            setEmail={setEmail} 
            setPassword={setPassword} 
          />
        </AccountCard>
      </AccountContent>
    </AccountWrap>
  );
};

LogIn.propTypes = {
  changeIsOpenModalFireBase: PropTypes.func.isRequired,
  login: PropTypes.func.isRequired,
  handleError: PropTypes.func.isRequired,
  error: PropTypes.string.isRequired,
};

export default LogIn;
