import styles from './style.module.scss'
import classNames from 'classnames/bind';
import logo from '../../assets/images/login-admin.png'
import { Button, Form, FormProps, Input, message, Spin, Typography } from 'antd';
import { getAuthStatus, storeAuthStatus } from '../../helper/authStatus';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { EMAIL_REGEX, handleHomePageLink } from '../../helper/const';
import { LoginType } from '../../models/common';
import authApi from '../../api/authApi';

const Login = () => {
  const cx = classNames.bind(styles)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const { Link } = Typography;

  const onFinish: FormProps<LoginType>['onFinish'] = (values) => {
    setIsLoading(true)
    authApi.login(values)
      .then((res) => {
        storeAuthStatus(res.data.data.accessToken, res.data.data.role, res.data.data.identifyId)
        setIsLoading(false)
        window.location.href = handleHomePageLink(res.data.data.role)
      })
      .catch((err) => {
        setIsLoading(false)
        messageApi.open({
          type: 'error',
          content: err.response.data.message,
        });
        console.error("Error:", err.response.data.message);
      });
  };

  useEffect(() => {
    if (getAuthStatus()) {
      navigate('/', { replace: true })
    }
  }, [localStorage.getItem('isAllowed'), localStorage.getItem('token')])

  return (
    <>
      <div className={cx("container")}>
        {contextHolder}
        <img src={logo} alt='Vinara Group' className={cx('logo')} />
        <Form
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          className={cx("login-form")}
          autoComplete="off"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 32 }}
        >
          <Form.Item<LoginType>
            label="Email"
            name="username"
            rules={[
              {
                required: true,
                message: 'Không được để email trống!'
              },
              {
                pattern: EMAIL_REGEX,
                message: 'Email không hợp lệ!'
              }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item<LoginType>
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: 'Không được để password trống!'
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <div className={cx("login-container")}>
              <Button type="primary" htmlType="submit">
                Đăng nhập
              </Button>
              <span>hoặc</span>
              <Link onClick={() => navigate('/loginBM')}>Đăng nhập tài khoản BM</Link>
            </div>
          </Form.Item>
        </Form>
      </div>
      <Spin spinning={isLoading} fullscreen />
    </>
  )
}

export default Login