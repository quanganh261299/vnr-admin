import { Button, DatePicker, message, Spin } from "antd"
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
  const { RangePicker } = DatePicker
  const currentDate = new Date()
  const yesterday = new Date(currentDate)
  yesterday.setDate(currentDate.getDate() - 1)
  const [startTime, setStartTime] = useState<string>(formatDateYMD(currentDate))
  const [endTime, setEndTime] = useState<string>(formatDateYMD(yesterday))
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>([
    dayjs(yesterday),
    dayjs(currentDate),
  ])


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

  const handleRangeChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
    if (dates !== null) {
      setDateRange(dates);
      if (dates[0] !== null && dates[1] !== null) {
        const startTime = formatDateYMD(dates[0].toDate());
        const endTime = formatDateYMD(dates[1].toDate());
        setStartTime(startTime);
        setEndTime(endTime);
      }
    }
  };

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
        <RangePicker
          allowClear={false}
          format={"DD-MM-YYYY"}
          onChange={(dates) => handleRangeChange(dates)}
          placeholder={["Bắt đầu", "Kết thúc"]}
          value={dateRange}
        />
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