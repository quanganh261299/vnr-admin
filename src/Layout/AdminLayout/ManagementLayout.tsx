import React, { useEffect, useState } from 'react';
import {
  ApartmentOutlined,
  AppstoreOutlined,
  BarChartOutlined,
  CaretDownOutlined,
  CrownOutlined,
  DollarOutlined,
  IdcardOutlined,
  LoginOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  TagOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Button, Dropdown, Layout, Menu, MenuProps } from 'antd';
import { Link, Outlet, useLocation } from 'react-router-dom';
import styles from './style.module.scss'
import classNames from 'classnames/bind';
import { Footer } from 'antd/es/layout/layout';
import logo from '../../assets/images/logo.png'
import avatar from '../../assets/images/avatar.png'
import { clearAuthStatus } from '../../helper/authStatus';
import { handleDisplay, ROLE } from '../../helper/const';
import { useTranslation } from 'react-i18next';

const { Header, Sider, Content } = Layout;

const ManagementLayout: React.FC = () => {
  const cx = classNames.bind(styles)
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const location = useLocation();
  const [current, setCurrent] = useState<string>('system');
  const [headerName, setHeaderName] = useState<string>('Quản lí hệ thống')
  const role = localStorage.getItem('role')
  const { t } = useTranslation()

  const Logout = () => {
    clearAuthStatus()
    window.location.href = '/login'
  }

  const dropDownItems: MenuProps['items'] = [
    {
      label: (
        <div className={cx("user-setting")} onClick={Logout}>
          <LogoutOutlined />
          <span>Logout</span>
        </div>
      ),
      key: '0',
    },
  ];

  useEffect(() => {
    if (location.pathname === '/') {
      setHeaderName('Quản lí hệ thống')
      setCurrent('system')
    }
    else if (location.pathname.includes('/account')) {
      setHeaderName('Tài khoản hệ thống')
      setCurrent('account')
    }
    else if (location.pathname.includes('/agency')) {
      setHeaderName('Quản lí chi nhánh')
      setCurrent('agency')
    }
    else if (location.pathname.includes('/team')) {
      setHeaderName('Quản lí đội nhóm')
      setCurrent('team')
    }
    else if (location.pathname.includes('/member')) {
      setHeaderName('Quản lí thành viên')
      setCurrent('member')
    }
    else if (location.pathname.includes('/advertisement-account')) {
      setHeaderName('Quản lí tài khoản quảng cáo')
      setCurrent('advertisement-account')
    }
    else if (location.pathname.includes('/ad-account') && location.search.includes('isDeleted=true')) {
      setHeaderName('Tài khoản quảng cáo đã xóa')
      setCurrent('ad-account-deleted')
    }
    else if (location.pathname.includes('/ad-account')) {
      setHeaderName('Tài khoản quảng cáo')
      setCurrent('ad-account')
    }
    else if (location.pathname.includes('/bm-account')) {
      setHeaderName('Tài khoản BM')
      setCurrent('bm-account')
    }
    else if (location.pathname.includes('/statistic')) {
      setHeaderName('Thống kê')
      setCurrent('statistic')
    }
    else setCurrent('')
  }, [location])

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed} width={250}>
        <figure className={cx("logo-wrapper")}>
          <img src={logo} alt="VINARA GROUP" className={cx("logo")} />
        </figure>
        <Menu
          theme="dark"
          mode="inline"
          defaultOpenKeys={['system-nav']}
          selectedKeys={[current]}
          className='menu'
          items={[
            {
              key: 'system-nav',
              icon: <AppstoreOutlined />,
              label: 'Hệ thống',
              style: { display: handleDisplay([ROLE.ADMIN, ROLE.ORGANIZATION, ROLE.BRANCH], String(role)) },
              children: [
                {
                  key: 'system',
                  icon: <SettingOutlined />,
                  label: <Link to='/'>Quản lí hệ thống</Link>,
                  style: { display: handleDisplay([ROLE.ADMIN], String(role)) }
                },
                {
                  key: 'agency',
                  icon: <ApartmentOutlined />,
                  label: <Link to='/agency'>Quản lí chi nhánh</Link>,
                  style: { display: handleDisplay([ROLE.ADMIN, ROLE.ORGANIZATION], String(role)) }
                },
                {
                  key: 'team',
                  icon: <TeamOutlined />,
                  label: <Link to='/team'>Quản lí đội nhóm</Link>,
                  style: { display: handleDisplay([ROLE.ADMIN, ROLE.ORGANIZATION, ROLE.BRANCH], String(role)) }
                },
                {
                  key: 'member',
                  icon: <UserOutlined />,
                  label: <Link to='/member'>Quản lí thành viên</Link>,
                },
              ]
            },
            {
              key: 'member',
              icon: <UserOutlined />,
              label: <Link to='/member'>Quản lí thành viên</Link>,
              style: { display: handleDisplay([ROLE.GROUP], String(role)) }
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
              style: { display: handleDisplay([ROLE.ADMIN, ROLE.ORGANIZATION, ROLE.BRANCH], String(role)) }
            },
            {
              key: 'ad-account',
              icon: <TagOutlined />,
              label: <Link to='/ad-account'>Tài khoản quảng cáo</Link>,
            },
            {
              key: 'ad-account-deleted',
              icon: <TagOutlined />,
              label: <Link to='/ad-account?isDeleted=true'>Tài khoản quảng cáo đã xóa</Link>,
            },
            {
              key: 'statistic',
              icon: <BarChartOutlined />,
              label: <Link to='/statistic'>Thống kê</Link>
            },
            {
              key: 'bm-account',
              icon: <IdcardOutlined />,
              label: <Link to='/bm-account'>Tài khoản BM</Link>,
            },
            {
              key: 'login-bm',
              icon: <LoginOutlined />,
              label: <div onClick={() => window.open('/loginBM')}>Login tài khoản BM</div>,
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header className={cx("header")}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className={cx("btn")}
          />
          <h1 className={cx('title')}>{headerName}</h1>
          <Dropdown menu={{ items: dropDownItems }} trigger={['click']}>
            <div className={cx("user-infor")}>
              <div className={cx("user-detail")}>
                <img src={avatar} alt="avatar" className={cx("avatar")} />
                <span>QUYỀN: {t(`roles.${role}`)}</span>
              </div>
              <CaretDownOutlined className={cx("user-icon")} />
            </div>
          </Dropdown>
        </Header>
        <Content className={cx("container")}>
          <Outlet />
        </Content>
        <Footer className={cx("footer")}>Copyright 2024 © Vinara Group</Footer>
      </Layout>
    </Layout>
  );
};

export default ManagementLayout;