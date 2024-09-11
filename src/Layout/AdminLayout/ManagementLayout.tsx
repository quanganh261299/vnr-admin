import React, { useEffect, useState } from 'react';
import {
  ApartmentOutlined,
  CaretDownOutlined,
  CrownOutlined,
  DollarOutlined,
  IdcardOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  TagOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Button, Dropdown, Layout, Menu, MenuProps } from 'antd';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import styles from './style.module.scss'
import { Footer } from 'antd/es/layout/layout';
import logo from '../../assets/images/logo.png'
import avatar from '../../assets/images/avatar.png'
import { clearAuthStatus } from '../../helper/authStatus';

const { Header, Sider, Content } = Layout;

const ManagementLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const [current, setCurrent] = useState('system');
  const navigate = useNavigate();

  const Logout = () => {
    clearAuthStatus()
    navigate('/login')
  }

  const dropDownItems: MenuProps['items'] = [
    {
      label: (
        <div className={styles["user-setting"]} onClick={Logout}>
          <LogoutOutlined />
          <span>Logout</span>
        </div>
      ),
      key: '0',
    },
  ];

  useEffect(() => {
    if (location.pathname === '/') {
      setCurrent('system')
    }
    else if (location.pathname.includes('/account')) {
      setCurrent('account')
    }
    else if (location.pathname.includes('/agency')) {
      setCurrent('agency')
    }
    else if (location.pathname.includes('/team')) {
      setCurrent('team')
    }
    else if (location.pathname.includes('/member')) {
      setCurrent('member')
    }
    else if (location.pathname.includes('/advertisement-account')) {
      setCurrent('advertisement-account')
    }
    else if (location.pathname.includes('/ad-account')) {
      setCurrent('ad-account')
    }
    else if (location.pathname.includes('/bm-account')) {
      setCurrent('bm-account')
    }
    else setCurrent('')
  }, [location])

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed} width={250}>
        <figure className={styles["logo-wrapper"]}>
          <img src={logo} alt="VINARA GROUP" className={styles["logo"]} />
        </figure>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[current]}
          className='menu'
          items={[
            {
              key: 'system',
              icon: <SettingOutlined />,
              label: <Link to='/'>Quản lí hệ thống</Link>,
            },
            {
              key: 'agency',
              icon: <ApartmentOutlined />,
              label: <Link to='/agency'>Quản lí chi nhánh</Link>,
            },
            {
              key: 'team',
              icon: <TeamOutlined />,
              label: <Link to='/team'>Quản lí đội nhóm</Link>,
            },
            {
              key: 'member',
              icon: <UserOutlined />,
              label: <Link to='/member'>Quản lí thành viên</Link>,
            },
            {
              key: 'advertisement-account',
              icon: <DollarOutlined />,
              label: <Link to='/advertisement-account'>Quản lí tài khoản quảng cáo</Link>,
            },
            {
              key: 'account',
              icon: <CrownOutlined />,
              label: <Link to='/account'>Tài khoản hệ thống</Link>,
            },
            {
              key: 'ad-account',
              icon: <TagOutlined />,
              label: <Link to='/ad-account'>Tài khoản quảng cáo</Link>,
            },
            {
              key: 'bm-account',
              icon: <IdcardOutlined />,
              label: <Link to='/bm-account'>Tài khoản BM</Link>,
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header className={styles["header"]}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className={styles["btn"]}
          />
          <Dropdown menu={{ items: dropDownItems }} trigger={['click']}>
            <div className={styles["user-infor"]}>
              <div className={styles["user-detail"]}>
                <img src={avatar} alt="avatar" className={styles["avatar"]} />
                <span>Hello, admin</span>
              </div>
              <CaretDownOutlined className={styles["user-icon"]} />
            </div>
          </Dropdown>
        </Header>
        <Content className={styles["container"]}>
          <Outlet />
        </Content>
        <Footer className={styles["footer"]}>Copyright 2024 © Vinara Group</Footer>
      </Layout>
    </Layout>
  );
};

export default ManagementLayout;