import FacebookLogin from '@greatsumini/react-facebook-login';
import styles from './style.module.scss'
import authApi from '../../api/authApi';
import { Button, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import { FacebookOutlined, RollbackOutlined } from '@ant-design/icons';
import loginImg from '../../assets/images/login.png'
import { storeAuthStatus } from '../../helper/authStatus';
import { useState } from 'react';

const LoginPM = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const navigate = useNavigate()

  const loginFB = () => {
    setIsLoading(true)
    document.querySelector<HTMLElement>('.fb-login-special-btn')?.click();
  }

  return (
    <>
      <div className={styles["container"]}>
        <img src={loginImg} alt='login' className={styles["login-logo"]} />
        <div className={styles['btn-group']}>
          <Button
            onClick={() => navigate('/login')}
            size='large'
            icon={<RollbackOutlined />}
          >
            Login Admin
          </Button>
          <Button
            size='large'
            icon={<FacebookOutlined />}
            onClick={loginFB}
            type='primary'
          >
            Login PM
          </Button>
        </div>
        <FacebookLogin
          appId="27101359412813286"
          scope='ads_management, ads_read, public_profile, email, business_management'
          className="fb-login-special-btn"
          onSuccess={(response) => {
            console.log('Login Success!', response);
            authApi.loginFB(response.accessToken).then((res) => {
              storeAuthStatus(res.data.data.accessToken)
              setIsLoading(false)
              window.location.href = '/advertisement-account?isPM=true'
            })
          }}
          onFail={(error) => {
            console.log('Login Failed!', error);
            setIsLoading(false)
          }}
          onProfileSuccess={(response) => {
            console.log('Get Profile Success!', response);
          }}
        />
      </div>
      <Spin spinning={isLoading} fullscreen />
    </>
  )
}

export default LoginPM