import { Button, DatePicker, Flex, message, Spin } from "antd"
import { useState } from "react"
import BmApi from "../../api/BmApi"
import { useNavigate } from "react-router-dom"
import { FacebookFilled, LogoutOutlined } from "@ant-design/icons"
import styles from './style.module.scss'
import classNames from "classnames/bind"
import logo from '../../assets/images/logo.png'
import { formatDateYMD } from "../../helper/const"
import dayjs, { Dayjs } from "dayjs"

const BmHomePage: React.FC = () => {
  const cx = classNames.bind(styles)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const navigate = useNavigate()
  const [messageApi, contextHolder] = message.useMessage()
  const currentDate = new Date()
  const yesterday = new Date(currentDate)
  yesterday.setDate(currentDate.getDate() - 1)
  const [startTime, setStartTime] = useState<string>(formatDateYMD(currentDate))
  const [endTime, setEndTime] = useState<string>(formatDateYMD(yesterday))
  const [startDate, setStartDate] = useState<Dayjs | undefined>(undefined)


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
    localStorage.removeItem('isBM')
    localStorage.removeItem('BmToken')
    navigate('/loginBM')
  }

  const onChangeStart = (date: Dayjs | null) => {
    if (date) {
      setStartDate(date)
      setStartTime(formatDateYMD(date.toDate()))
    }
  }

  const onChangeEnd = (date: Dayjs | null) => {
    if (date) {
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
            minDate={startDate}
            maxDate={startDate?.add(7, 'day')}
          />
        </Flex>
        <div className={cx("btn-list")}>
          <Button
            type="primary"
            onClick={getDataFromFacebook}
            icon={<FacebookFilled />}
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