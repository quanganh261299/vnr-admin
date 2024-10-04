import React, { useEffect, useState } from 'react';
import {
  ApartmentOutlined,
  AppstoreOutlined,
  BarChartOutlined,
  CaretDownOutlined,
  CrownOutlined,
  DashboardOutlined,
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
import { clearAuthStatusAdmin } from '../../helper/authStatus';
import { handleDisplay, hasRole, ROLE } from '../../helper/const';
import { useTranslation } from 'react-i18next';
import { EPath } from '../../routes/routesConfig';

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
    clearAuthStatusAdmin();
    window.location.href = EPath.loginPage
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
    if (location.pathname === EPath.dashboard) {
      setHeaderName('Dashboard')
      setCurrent('dashboard')
    }
    else if (location.pathname.includes(EPath.systemManagement)) {
      setHeaderName('Quản lí hệ thống')
      setCurrent('system')
    }
    else if (location.pathname.includes(EPath.systemAccount)) {
      setHeaderName('Tài khoản hệ thống')
      setCurrent('account')
    }
    else if (location.pathname.includes(EPath.agencyManagement)) {
      setHeaderName('Quản lí chi nhánh')
      setCurrent('agency')
    }
    else if (location.pathname.includes(EPath.teamManagement)) {
      setHeaderName('Quản lí đội nhóm')
      setCurrent('team')
    }
    else if (location.pathname.includes(EPath.memberManagement)) {
      setHeaderName('Quản lí thành viên')
      if (role && hasRole([ROLE.GROUP], role)) {
        setCurrent('member-separated')
      }
      else setCurrent('member')
    }
    else if (location.pathname.includes(EPath.advertisementManagement)) {
      setHeaderName('Quản lí tài khoản quảng cáo')
      setCurrent('advertisement-account')
    }
    else if (location.pathname.includes(EPath.adAccount) && location.search.includes('isDeleted=true')) {
      setHeaderName('Tài khoản quảng cáo đã xóa')
      setCurrent('ad-account-deleted')
    }
    else if (location.pathname.includes(EPath.adAccount)) {
      setHeaderName('Tài khoản quảng cáo')
      setCurrent('ad-account')
    }
    else if (location.pathname.includes(EPath.bmAccount)) {
      setHeaderName('Tài khoản BM')
      setCurrent('bm-account')
    }
    else if (location.pathname.includes(EPath.statistic)) {
      setHeaderName('Thống kê')
      setCurrent('statistic')
    }
    else setCurrent('')
  }, [location, role])

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed} width={250}>
        <figure className={cx("logo-wrapper")}>
          <img src={logo} alt="VINARA GROUP" className={cx("logo")} />
        </figure>
        <Menu
          theme="dark"
          mode="inline"
          defaultOpenKeys={role && hasRole([ROLE.ADMIN], role) ? [] : ['system-nav']}
          selectedKeys={[current]}
          className='menu'
          items={[
            {
              key: 'dashboard',
              icon: <DashboardOutlined />,
              label: <Link to={EPath.dashboard}>Dashboard</Link>,
              style: { display: handleDisplay([ROLE.ADMIN], String(role)) }
            },
            {
              key: 'system-nav',
              icon: <AppstoreOutlined />,
              label: 'Hệ thống',
              style: { display: handleDisplay([ROLE.ADMIN, ROLE.ORGANIZATION, ROLE.BRANCH], String(role)) },
              children: [
                {
                  key: 'system',
                  icon: <SettingOutlined />,
                  label: <Link to={EPath.systemManagement}>Quản lí hệ thống</Link>,
                  style: { display: handleDisplay([ROLE.ADMIN], String(role)) }
                },
                {
                  key: 'agency',
                  icon: <ApartmentOutlined />,
                  label: <Link to={EPath.agencyManagement}>Quản lí chi nhánh</Link>,
                  style: { display: handleDisplay([ROLE.ADMIN, ROLE.ORGANIZATION], String(role)) }
                },
                {
                  key: 'team',
                  icon: <TeamOutlined />,
                  label: <Link to={EPath.teamManagement}>Quản lí đội nhóm</Link>,
                  style: { display: handleDisplay([ROLE.ADMIN, ROLE.ORGANIZATION, ROLE.BRANCH], String(role)) }
                },
                {
                  key: 'member',
                  icon: <UserOutlined />,
                  label: <Link to={EPath.memberManagement}>Quản lí thành viên</Link>,
                },
              ]
            },
            {
              key: 'member-separated',
              icon: <UserOutlined />,
              label: <Link to={EPath.memberManagement}>Quản lí thành viên</Link>,
              style: { display: handleDisplay([ROLE.GROUP], String(role)) }
            },
            {
              key: 'advertisement-account',
              icon: <DollarOutlined />,
              label: <Link to={EPath.advertisementManagement}>Quản lí tài khoản quảng cáo</Link>,
            },
            {
              key: 'account',
              icon: <CrownOutlined />,
              label: <Link to={EPath.systemAccount}>Tài khoản hệ thống</Link>,
              style: { display: handleDisplay([ROLE.ADMIN, ROLE.ORGANIZATION, ROLE.BRANCH], String(role)) }
            },
            {
              key: 'ad-account',
              icon: <TagOutlined />,
              label: <Link to={EPath.adAccount}>Tài khoản quảng cáo</Link>,
            },
            {
              key: 'ad-account-deleted',
              icon: <TagOutlined />,
              label: <Link to={EPath.deletedAdAccount}>Tài khoản quảng cáo đã xóa</Link>,
            },
            {
              key: 'statistic',
              icon: <BarChartOutlined />,
              label: <Link to={EPath.statistic}>Thống kê</Link>
            },
            {
              key: 'bm-account',
              icon: <IdcardOutlined />,
              label: <Link to={EPath.bmAccount}>Tài khoản BM</Link>,
            },
            {
              key: 'login-bm',
              icon: <LoginOutlined />,
              label: <div onClick={() => window.open(EPath.loginBmPage)}>Login tài khoản BM</div>,
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