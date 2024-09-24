import styles from './style.module.scss'
import classNames from 'classnames/bind';
import errorImg from '../../assets/images/error.png'
import { useNavigate, useRouteError } from 'react-router-dom';
import { Button } from 'antd';
import { RouterError } from '../../models/common';



const ErrorPage = () => {
  const cx = classNames.bind(styles)
  const navigate = useNavigate();
  const error = useRouteError() as RouterError;
  return (
    <div className={cx("container")}>
      <img src={errorImg} alt='error' className={cx("error-img")} />
      <h1 className={cx("error-heading")}>Oops!</h1>
      <p className={cx("error-caption")}>Sorry, an unexpected error has occurred.</p>
      <p className={cx("error-detail")}>{`${error.status} ${error.statusText !== 'undefined' && error.statusText}`}</p>
      <Button type='primary' size='large' shape='round' onClick={() => navigate('/')}>
        Go to Homepage
      </Button>
    </div>
  )
}

export default ErrorPage