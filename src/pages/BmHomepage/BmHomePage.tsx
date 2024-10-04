import { Button, DatePicker, Flex, message, Spin } from "antd"
import { useEffect, useState } from "react"
import BmApi from "../../api/BmApi"
import { useNavigate } from "react-router-dom"
import { FacebookFilled, LogoutOutlined } from "@ant-design/icons"
import styles from './style.module.scss'
import classNames from "classnames/bind"
import logo from '../../assets/images/logo.png'
import { formatDateYMD } from "../../helper/const"
import dayjs, { Dayjs } from "dayjs"
import { EPath } from "../../routes/routesConfig"
import { clearAuthStatusBm, getAuthFbStatus } from "../../helper/authStatus"

const BmHomePage: React.FC = () => {
  const cx = classNames.bind(styles)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const navigate = useNavigate()
  const [messageApi, contextHolder] = message.useMessage()
  const currentDate = new Date()
  const yesterday = new Date(currentDate)
  yesterday.setDate(currentDate.getDate() - 1)
  const [startTime, setStartTime] = useState<string>('')
  const [endTime, setEndTime] = useState<string>('')
  const [startDate, setStartDate] = useState<Dayjs | undefined>(undefined)
  const [endDate, setEndDate] = useState<Dayjs | null>(null)


  const getDataFromFacebook = () => {
    setIsLoading(true)
    BmApi.getDataFromFacebook(startTime, endTime).then(() => {
      success('Kéo dữ liệu thành công!')
      setIsLoading(false)
    }).catch((err) => {
      error(err.response.data.message || err.response.message)
      setIsLoading(false)
    })
  }

  const Logout = () => {
    clearAuthStatusBm();
    navigate(EPath.loginBmPage)
  }

  const onChangeStart = (date: Dayjs | null) => {
    if (date) {
      setEndDate(null)
      setEndTime('')
      setStartDate(date)
      setStartTime(formatDateYMD(date.toDate()))
    }
  }

  const onChangeEnd = (date: Dayjs | null) => {
    if (date) {
      setEndDate(date)
      setEndTime(formatDateYMD(date.toDate()))
    }
  }

  const success = (message: string) => {
    messageApi.open({
      type: 'success',
      content: message,
    });
  };

  const error = (message: string) => {
    messageApi.open({
      type: 'error',
      content: message,
    });
  };

  useEffect(() => {
    if(getAuthFbStatus()) {
      window.location.href = EPath.loginBmPage
    }
  }, [localStorage.getItem('BmToken')])

  return (
    <>
      {contextHolder}
      <div className={cx("container")}>
        <img src={logo} alt="VINARA" className={cx("img-logo")} />
        <Flex gap={'small'} align="center">
          <DatePicker
            allowClear={false}
            format={"DD-MM-YYYY"}
            placeholder="Bắt đầu"
            maxDate={dayjs()}
            onChange={onChangeStart}
          />
          <span>~</span>
          <DatePicker
            allowClear={false}
            format={"DD-MM-YYYY"}
            placeholder="Kết thúc"
            disabled={!startDate}
            onChange={onChangeEnd}
            value={endDate}
            minDate={startDate}
            maxDate={startDate?.add(7, 'day')}
          />
        </Flex>
        <div className={cx("btn-list")}>
          <Button
            type="primary"
            onClick={getDataFromFacebook}
            icon={<FacebookFilled />}
            disabled={!startTime || !endTime}
          >
            Lấy dữ liệu từ Facebook
          </Button>
          <Button
            onClick={() => Logout()}
            icon={<LogoutOutlined />}
          >
            Logout
          </Button>
        </div>
      </div>
      <Spin spinning={isLoading} fullscreen></Spin>
    </>
  )
}

export default BmHomePage