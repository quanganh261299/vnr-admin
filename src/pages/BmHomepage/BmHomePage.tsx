import { Button, Spin } from "antd"
import { useState } from "react"
import BmApi from "../../api/BmApi"
import { useNavigate } from "react-router-dom"

const BmHomePage: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const navigate = useNavigate()
  const getDataFromFacebook = () => {
    setIsLoading(true)
    BmApi.getDataFromFacebook().then(() => {
      alert('Thành công!')
      setIsLoading(false)
    }).catch(() => {
      alert('Thất bại!')
      setIsLoading(false)
    })
  }

  const Login = () => {
    localStorage.clear()
    navigate('/loginBM')
  }

  return (
    <>
      <Button type="primary" onClick={getDataFromFacebook}>Kéo dữ liệu</Button>
      <Button onClick={() => Login()}>Login</Button>
      <Spin spinning={isLoading} fullscreen></Spin>
    </>
  )
}

export default BmHomePage