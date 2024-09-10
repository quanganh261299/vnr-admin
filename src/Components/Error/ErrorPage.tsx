import styles from './style.module.scss'
import errorImg from '../../assets/images/error.png'
import { useNavigate, useRouteError } from 'react-router-dom';
import { Button } from 'antd';
import { RouterError } from '../../models/common';



const ErrorPage = () => {
  const navigate = useNavigate();
  const error = useRouteError() as RouterError;
  return (
    <div className={styles["container"]}>
      <img src={errorImg} alt='error' className={styles["error-img"]} />
      <h1 className={styles["error-heading"]}>Oops!</h1>
      <p className={styles["error-caption"]}>Sorry, an unexpected error has occurred.</p>
      <p className={styles["error-detail"]}>{`${error.status} ${error.statusText !== 'undefined' && error.statusText}`}</p>
      <Button type='primary' size='large' shape='round' onClick={() => navigate('/')}>
        Go to Homepage
      </Button>
    </div>
  )
}

export default ErrorPage