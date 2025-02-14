import FacebookLogin from '@greatsumini/react-facebook-login';
import styles from './style.module.scss'
import classNames from 'classnames/bind';
import authApi from '../../api/authApi';
import { Button, message, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import { FacebookOutlined, RollbackOutlined } from '@ant-design/icons';
import loginImg from '../../assets/images/login.png'
import { getAuthFbStatus, storeAuthFBStatus } from '../../helper/authStatus';
import { useEffect, useState } from 'react';
import { EPath } from '../../routes/routesConfig';

const LoginBM = () => {
  const cx = classNames.bind(styles)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [messageApi, contextHolder] = message.useMessage()
  const navigate = useNavigate()

  const loginFB = () => {
    setIsLoading(true)
    document.querySelector<HTMLElement>('.fb-login-special-btn')?.click();
  }

  const error = (message: string) => {
    messageApi.open({
      type: 'error',
      content: message,
    });
  };

  useEffect(() => {
    if (getAuthFbStatus()) {
        window.location.href = EPath.bmHomePage
    }
  }, [localStorage.getItem('BmToken')])

  return (
    <>
      {contextHolder}
      <div className={cx("container")}>
        <img src={loginImg} alt='login' className={cx("login-logo")} />
        <div className={cx('btn-group')}>
          <Button
            onClick={() => navigate(EPath.loginPage)}
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
          appId='1040182517579604'
          scope='ads_management, ads_read, public_profile, email, business_management'
          className="fb-login-special-btn"
          onSuccess={(response) => {
            authApi.loginFB(response.accessToken).then((res) => {
              storeAuthFBStatus(res.data.data.accessToken)
              setIsLoading(false)
              window.location.href = EPath.bmHomePage
            })
              .catch((err) => {
                setIsLoading(false)
                error(err.response.data.message)
              })
          }}
          onFail={() => {
            setIsLoading(false)
          }}
          onProfileSuccess={(response) => {
            localStorage.setItem('profileFacebook', JSON.stringify(response));
          }}
        />
      </div>
      <Spin spinning={isLoading} fullscreen />
    </>
  )
}

export default LoginBM