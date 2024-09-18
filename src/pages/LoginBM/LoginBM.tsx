import FacebookLogin from '@greatsumini/react-facebook-login';
import styles from './style.module.scss'
import authApi from '../../api/authApi';
import { Button, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import { FacebookOutlined, RollbackOutlined } from '@ant-design/icons';
import loginImg from '../../assets/images/login.png'
import { getAuthFbStatus, storeAuthFBStatus } from '../../helper/authStatus';
import { useEffect, useState } from 'react';

const LoginBM = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const navigate = useNavigate()

  const loginFB = () => {
    setIsLoading(true)
    document.querySelector<HTMLElement>('.fb-login-special-btn')?.click();
  }

  useEffect(() => {
    if (getAuthFbStatus()) {
      navigate('/bm-homepage', { replace: true })
    }
  }, [localStorage.getItem('isAllowed'), localStorage.getItem('BmToken')])

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
            Login BM
          </Button>
        </div>
        <FacebookLogin
          appId="27101359412813286"
          scope='ads_management, ads_read, public_profile, email, business_management'
          className="fb-login-special-btn"
          onSuccess={(response) => {
            console.log('Login Success!', response);
            authApi.loginFB(response.accessToken).then((res) => {
              storeAuthFBStatus(res.data.data.accessToken)
              setIsLoading(false)
              window.location.href = '/bm-homepage'
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

export default LoginBM