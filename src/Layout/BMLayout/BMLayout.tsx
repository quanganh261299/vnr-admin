import { Layout } from "antd";
import { Outlet } from "react-router-dom"
import styles from './style.module.scss'

const BMLayout: React.FC = () => {
  const { Header, Footer, Content } = Layout;
  return (
    <Layout>
      <Header className={styles["header"]}>
        <h1 className={styles["title"]}>Business Management</h1>
      </Header>
      <Content className={styles["container"]}>
        <Outlet />
      </Content>
      <Footer className={styles["footer"]}>Copyright 2024 © Vinara Group</Footer>
    </Layout>
  )
}

export default BMLayout