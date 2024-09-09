import { Button, Modal } from "antd";
import { FC } from "react";
import styles from './style.module.scss'
import { FacebookOutlined, SwapLeftOutlined } from "@ant-design/icons";

interface Props {
  isOpen: boolean,
  isFBLogin: boolean,
  title: string,
  description: string,
  firstOptionBtn: string,
  secondOptionBtn: string,
  firstOptionAction: () => void,
  secondOptionAction: () => void,
  loginFB: () => void,
  setIsFBLogin: React.Dispatch<React.SetStateAction<boolean>>
}

const OptionLoginModal: FC<Props> = (props: Props) => {
  const { isOpen, isFBLogin, title, description, firstOptionBtn, secondOptionBtn, firstOptionAction, secondOptionAction, setIsFBLogin, loginFB } = props
  return (
    <Modal
      title={<div className={`${styles["center-text"]} ${styles["heading"]}`}>{title}</div>}
      open={isOpen}
      closable={false}
      maskClosable={false}
      centered
      footer={() => (
        <>
          <div className={styles["btn-container"]}>
            {
              isFBLogin ? (
                <>
                  <Button
                    size="large"
                    icon={<SwapLeftOutlined />}
                    onClick={() => setIsFBLogin(false)}
                  >
                    Back
                  </Button>
                  <Button
                    type="primary"
                    size="large"
                    icon={<FacebookOutlined />}
                    onClick={loginFB}
                  >
                    Facebook Login
                  </Button>
                </>

              )
                :
                (
                  <>
                    <Button
                      size="large"
                      onClick={firstOptionAction}
                    >
                      {firstOptionBtn}
                    </Button>
                    <Button
                      size="large"
                      onClick={secondOptionAction}
                    >
                      {secondOptionBtn}
                    </Button>
                  </>
                )
            }
          </div>
        </>
      )}
    >
      <p className={`${styles["center-text"]} ${styles["desc"]}`}>{description}</p>
    </Modal>
  )
}

export default OptionLoginModal