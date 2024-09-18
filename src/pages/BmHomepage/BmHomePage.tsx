import { Button, DatePicker, Spin } from "antd"
import { useState } from "react"
import BmApi from "../../api/BmApi"
import { useNavigate } from "react-router-dom"
import { FacebookFilled, LogoutOutlined } from "@ant-design/icons"
import styles from './style.module.scss'
import logo from '../../assets/images/logo.png'
import { formatDateYMD } from "../../helper/const"
import dayjs, { Dayjs } from "dayjs"

const BmHomePage: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const navigate = useNavigate()
  const { RangePicker } = DatePicker;
  const currentDate = new Date();
  const yesterday = new Date(currentDate);
  yesterday.setDate(currentDate.getDate() - 1);
  const [startTime, setStartTime] = useState<string>(formatDateYMD(currentDate))
  const [endTime, setEndTime] = useState<string>(formatDateYMD(yesterday))
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>([
    dayjs(yesterday),
    dayjs(currentDate),
  ]);


  const getDataFromFacebook = () => {
    setIsLoading(true)
    BmApi.getDataFromFacebook(startTime, endTime).then(() => {
      alert('Thành công!')
      setIsLoading(false)
    }).catch(() => {
      alert('Thất bại!')
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

  return (
    <>
      <div className={styles["container"]}>
        <img src={logo} alt="VINARA" className={styles["img"]} />
        <RangePicker
          allowClear={false}
          format={"DD-MM-YYYY"}
          onChange={(dates) => handleRangeChange(dates)}
          placeholder={["Bắt đầu", "Kết thúc"]}
          value={dateRange}
        />
        <div className={styles["btn-list"]}>
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