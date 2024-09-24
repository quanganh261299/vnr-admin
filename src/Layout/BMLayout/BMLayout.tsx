import { Layout } from "antd";
import { Outlet, useNavigate } from "react-router-dom"
import styles from './style.module.scss'
import BmApi from "../../api/BmApi";
import { formatDateYMD } from "../../helper/const";

const BMLayout: React.FC = () => {
  const { Header, Footer, Content } = Layout;
  const navigate = useNavigate()
  const profileFacebook = JSON.parse(localStorage.getItem('profileFacebook') || '{}');
  const token = localStorage.getItem('BmToken');
  const currentDate = new Date();
  const yesterday = new Date(currentDate);
  yesterday.setDate(currentDate.getDate() - 1);


  const fetchData = async () => {
    if (token) {
      console.log('Kéo dữ liệu Facebook ...')
      try {
        BmApi.getDataFromFacebook(formatDateYMD(yesterday), formatDateYMD(currentDate))
          .then(() => console.info('Thành công'))
          .catch((err) => console.error(`Thất bại: ${err}`))
      } catch (error) {
        console.error('Lỗi khi gọi API:', error);
      }
    }
  };

  const scheduleNextFetch = () => {
    const now = new Date();
    const targetHour = 22;
    const targetMinute = 0;

    const nextFetch = new Date(now.getFullYear(), now.getMonth(), now.getDate(), targetHour, targetMinute, 0, 0);

    if (now > nextFetch) {
      nextFetch.setDate(nextFetch.getDate() + 1);
    }

    const delay = nextFetch.getTime() - now.getTime();

    setTimeout(() => {
      fetchData();
      scheduleNextFetch();
    }, delay);
  };

  setInterval(() => {
    BmApi.checkAccount().then(() => console.log('Check account thành công!'))
      .catch(() => {
        console.log('Check account thất bại!')
        localStorage.removeItem('BmToken')
        localStorage.removeItem('isBM')
        localStorage.removeItem('profileFacebook')
        navigate('/loginBM')
      })
  }, 30000)

  scheduleNextFetch();

  return (
    <Layout>
      <Header className={styles["header"]}>
        <h1 className={styles["title"]}>Business Management</h1>
        <div className={styles['facebook-profile']}>
          <img src={profileFacebook?.picture?.data?.url} alt="avatar" className={styles["fb-img"]} />
          <h1 className={styles["facebook-name"]}>{profileFacebook?.name}</h1>
        </div>
      </Header>
      <Content className={styles["container"]}>
        <Outlet />
      </Content>
      <Footer className={styles["footer"]}>Copyright 2024 © Vinara Group</Footer>
    </Layout>
  )
}

export default BMLayout